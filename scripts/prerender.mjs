/**
 * 构建后预渲染脚本（puppeteer-core + 本机 Chrome，不下载 Chromium）
 *
 * 流程：
 *  1. 启动一个指向 dist/ 的静态服务器（带 SPA fallback）
 *  2. 无头 Chrome 访问 / 和 /chapter/1..10，等待 React 渲染完成
 *  3. 抓取渲染后的完整 HTML，重写 head（title/description/canonical/og）
 *  4. 注入结构化数据（首页 WebSite；章节页 FAQPage）
 *  5. 章节页写到 dist/chapter/N/index.html（修正相对资源路径为绝对路径）
 *  6. 重新生成 dist/sitemap.xml（lastmod = 构建日期）
 *
 * Chrome 路径可通过环境变量 PUPPETEER_EXECUTABLE_PATH 指定，
 * 缺省按常见安装位置自动探测。
 */
import http from "node:http";
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const CONTENT_DIR = path.join(ROOT, "content", "chapters");

const SITE_URL = "https://pistudy.com.cn";
const SITE_NAME = "PI agent学习指南";
const HOME_TITLE = "PI agent学习指南 - 生产级 AI Agent 运行时中文实战教程";
const HOME_DESCRIPTION =
  "《PI agent学习指南》——基于开源项目 Pi 源码逐行拆解的中文实战教程：十章读懂生产级 AI Agent 运行时，覆盖 Agent Loop、工具管道、上下文工程与会话树，每章附面试问答与架构图解。";
const QUESTIONS_TITLE = "AI Agent 面试题：30 问 30 答（基于生产级源码）| PI agent学习指南";
const QUESTIONS_DESCRIPTION =
  "30 道 AI Agent 核心面试题与源码级答案：Agent Loop 停止条件、工具管道、消息系统、上下文工程、压缩算法与会话树，全部基于近 8 万 Star 的开源项目 Pi 源码拆解，每题附展开阅读章节。";

/* ---------- frontmatter 轻量解析（与 src/lib/chapters.ts 逻辑一致） ---------- */

const stripQuotes = (s) => s.trim().replace(/^["']|["']$/g, "").trim();

function parseChapter(raw, fallbackId) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data = {};
  if (match) {
    let currentKey = null;
    for (const line of match[1].split(/\r?\n/)) {
      const objItem = line.match(/^\s+-\s+([A-Za-z_][\w-]*)\s*:\s*(.+)$/);
      if (objItem && currentKey) {
        (data[currentKey] ??= []).push({ [objItem[1]]: stripQuotes(objItem[2]) });
        continue;
      }
      const strItem = line.match(/^\s+-\s+(.*)$/);
      if (strItem && currentKey) {
        (data[currentKey] ??= []).push(stripQuotes(strItem[1]));
        continue;
      }
      const objField = line.match(/^\s{2,}([A-Za-z_][\w-]*)\s*:\s*(.+)$/);
      if (objField && currentKey) {
        const arr = data[currentKey];
        if (Array.isArray(arr) && arr.length > 0) {
          const last = arr[arr.length - 1];
          if (typeof last === "object") {
            last[objField[1]] = stripQuotes(objField[2]);
            continue;
          }
        }
      }
      const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
      if (kv) {
        const [, key, value] = kv;
        currentKey = key;
        if (value === "") data[key] = [];
        else if (value.startsWith("[") && value.endsWith("]"))
          data[key] = value.slice(1, -1).split(",").map(stripQuotes).filter(Boolean);
        else data[key] = stripQuotes(value);
      }
    }
  }
  const interview = (Array.isArray(data.interview) ? data.interview : [])
    .map((item) =>
      typeof item === "object"
        ? { q: String(item.q ?? ""), a: String(item.a ?? "") }
        : { q: String(item), a: "" },
    )
    .filter((item) => item.q);
  return {
    id: Number(data.chapter ?? fallbackId),
    title: String(data.title ?? `第 ${fallbackId} 章`),
    subtitle: String(data.subtitle ?? ""),
    interview,
  };
}

async function loadChapters() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => /^ch\d+\.md$/.test(f)).sort();
  const chapters = [];
  for (let i = 0; i < files.length; i++) {
    const raw = await readFile(path.join(CONTENT_DIR, files[i]), "utf8");
    chapters.push(parseChapter(raw, i + 1));
  }
  return chapters.sort((a, b) => a.id - b.id);
}

/* ---------- head 重写与 JSON-LD 注入 ---------- */

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function replaceMeta(html, selector, attr, value) {
  // selector 形如 name="description" 或 property="og:title"
  const re = new RegExp(`(<meta\\s+[^>]*${selector}[^>]*${attr}=")[^"]*(")`);
  return html.replace(re, `$1${escapeHtml(value)}$2`);
}

function applyHead(html, { title, description, url }) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name="description"', "content", description);
  html = replaceMeta(html, 'property="og:title"', "content", title);
  html = replaceMeta(html, 'property="og:description"', "content", description);
  html = replaceMeta(html, 'property="og:url"', "content", url);
  html = replaceMeta(html, 'name="twitter:title"', "content", title);
  html = replaceMeta(html, 'name="twitter:description"', "content", description);
  html = html.replace(
    /(<link\s+[^>]*rel="canonical"[^>]*href=")[^"]*(")/,
    `$1${url}$2`,
  );
  return html;
}

function injectJsonLd(html, obj) {
  // 先清除页面里已有的 JSON-LD（章节页经由 SPA fallback 的 dist/index.html 加载，
  // 会残留首页快照注入的 WebSite 标注），再注入当前页面专属的结构化数据
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  const tag = `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "PI agent 学习指南",
    url: SITE_URL,
    inLanguage: "zh-CN",
    author: { "@type": "Person", name: "建斌聊AI" },
  };
}

function faqJsonLd(chapter) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chapter.interview.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** 面试 30 题合集页：全站所有问答合并为一个 FAQPage */
function questionsJsonLd(chapters) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chapters.flatMap((chapter) =>
      chapter.interview.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}

/* ---------- 静态服务器（dist + SPA fallback） ---------- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function serve(dir) {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = path.join(dir, urlPath);
      if (!file.startsWith(dir)) throw new Error("bad path");
      const isDir = existsSync(file) && (await stat(file)).isDirectory();
      if (!existsSync(file) || isDir) {
        const candidate = path.join(file, "index.html");
        file = existsSync(candidate) ? candidate : path.join(dir, "index.html");
      }
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

/* ---------- Chrome 探测 ---------- */

function chromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error("未找到本机 Chrome，请设置 PUPPETEER_EXECUTABLE_PATH");
}

/* ---------- 主流程 ---------- */

async function main() {
  const chapters = await loadChapters();
  const { server, port } = await serve(DIST);
  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: "shell",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const buildDate = new Date().toISOString().slice(0, 10);
  const routes = ["/", "/questions/", ...chapters.map((c) => `/chapter/${c.id}/`)];

  try {
    const page = await browser.newPage();
    for (const route of routes) {
      const isHome = route === "/";
      const isQuestions = route === "/questions/";
      const chapter = isHome || isQuestions ? null : chapters.find((c) => `/chapter/${c.id}/` === route);
      await page.goto(`http://127.0.0.1:${port}${route}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      // 等 React 把目标路由渲染出来：首页等 h1，合集页等 #questions-root，章节页等正文容器 .md-body
      // （首页快照写入 dist/index.html 后，静态 h1 会立即命中，故子页面必须等各自专属节点）
      const readySelector = isHome ? "#root h1" : isQuestions ? "#root #questions-root" : "#root .md-body";
      await page.waitForSelector(readySelector, { timeout: 30000 });
      let html = await page.evaluate(() => "<!doctype html>\n" + document.documentElement.outerHTML);

      const title = isHome
        ? HOME_TITLE
        : isQuestions
          ? QUESTIONS_TITLE
          : `第${chapter.id}章 ${chapter.title} | ${SITE_NAME}`;
      const description = isHome
        ? HOME_DESCRIPTION
        : isQuestions
          ? QUESTIONS_DESCRIPTION
          : chapter.subtitle || `${chapter.title}——《PI agent学习指南》第 ${chapter.id} 章，源码级拆解。`;
      const url = isHome ? `${SITE_URL}/` : `${SITE_URL}${route}`;

      html = applyHead(html, { title, description, url });
      html = injectJsonLd(
        html,
        isHome ? websiteJsonLd() : isQuestions ? questionsJsonLd(chapters) : faqJsonLd(chapter),
      );

      if (isHome) {
        await writeFile(path.join(DIST, "index.html"), html);
      } else {
        // 子目录页面：相对资源路径改为绝对路径，避免 ./assets 解析到子目录下
        html = html.replace(/(src|href)="\.\/assets\//g, '$1="/assets/');
        const outDir = isQuestions
          ? path.join(DIST, "questions")
          : path.join(DIST, "chapter", String(chapter.id));
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, "index.html"), html);
      }
      console.log(`✓ prerendered ${route}`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  // sitemap：lastmod 用构建日期
  const urls = [
    `  <url><loc>${SITE_URL}/</loc><lastmod>${buildDate}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${SITE_URL}/questions/</loc><lastmod>${buildDate}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...chapters.map(
      (c) =>
        `  <url><loc>${SITE_URL}/chapter/${c.id}/</loc><lastmod>${buildDate}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap);
  console.log(`✓ sitemap.xml (lastmod ${buildDate}, ${routes.length} urls)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
