/** 冒烟测试：用无头 Chrome 验证速查表筛选与全站搜索（⌘K）在构建产物上真实可用 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain" };

function chromePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  for (const c of ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"]) if (existsSync(c)) return c;
  throw new Error("no chrome");
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(DIST, urlPath);
    const isDir = existsSync(file) && (await stat(file)).isDirectory();
    if (!existsSync(file) || isDir) {
      const cand = path.join(file, "index.html");
      file = existsSync(cand) ? cand : path.join(DIST, "index.html");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: "shell", args: ["--no-sandbox"] });
const page = await browser.newPage();
const fail = (msg) => { console.error("✗ " + msg); process.exitCode = 1; };
const ok = (msg) => console.log("✓ " + msg);

// 1. 速查表页：预渲染静态内容 + 页内筛选
await page.goto(`http://127.0.0.1:${port}/cheatsheet/`, { waitUntil: "networkidle0" });
await page.waitForSelector("#cheatsheet-root", { timeout: 15000 });
const staticText = await page.evaluate(() => document.body.innerText);
if (staticText.includes("/compact") && staticText.includes("Ctrl+P") && staticText.includes("--tools")) ok("速查表静态渲染含斜杠命令/快捷键/CLI 内容");
else fail("速查表静态内容缺失");

await page.type("#cheatsheet-root input", "compact");
await new Promise((r) => setTimeout(r, 300));
const filtered = await page.evaluate(() => document.body.innerText);
if (filtered.includes("/compact [提示]") && !filtered.includes("/login, /logout")) ok("页内筛选生效（compact 命中，login 被过滤）");
else fail("页内筛选异常");

// 2. 全站搜索：⌘K 打开 → 输入 → 出结果 → Enter 跳转
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle0" });
await page.keyboard.down("Meta");
await page.keyboard.press("k");
await page.keyboard.up("Meta");
await page.waitForSelector('[role="dialog"] input', { timeout: 5000 });
ok("⌘K 打开搜索框");
await page.type('[role="dialog"] input', "压缩");
await new Promise((r) => setTimeout(r, 300));
const resultCount = await page.evaluate(() => document.querySelectorAll('[role="dialog"] button').length);
if (resultCount > 0) ok(`搜索「压缩」返回 ${resultCount} 条结果`);
else fail("搜索无结果");
const kinds = await page.evaluate(() => document.querySelector('[role="dialog"]').innerText);
if (kinds.includes("面试题") || kinds.includes("章节")) ok("「压缩」命中章节/面试题内容");
else fail("搜索结果异常: " + kinds.slice(0, 120));
const beforePath = new URL(page.url()).pathname;
await page.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 500));
const afterPath = new URL(page.url()).pathname;
if (afterPath !== beforePath) ok(`Enter 跳转 ${beforePath} → ${afterPath}`);
else fail("Enter 未跳转");

// 3. 英文/命令关键词
await page.keyboard.down("Meta"); await page.keyboard.press("k"); await page.keyboard.up("Meta");
await page.waitForSelector('[role="dialog"] input', { timeout: 5000 });
await page.type('[role="dialog"] input', "fork");
await new Promise((r) => setTimeout(r, 300));
const forkResults = await page.evaluate(() => document.querySelector('[role="dialog"]').innerText);
if (forkResults.includes("/fork")) ok("搜索「fork」命中速查表 /fork 条目");
else fail("fork 搜索异常");

await browser.close();
server.close();
console.log(process.exitCode ? "—— 有失败项" : "—— 全部通过");
