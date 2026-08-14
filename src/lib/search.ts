/**
 * 全站搜索：纯前端、零依赖。
 * 索引三块内容：十章正文（按小节切分）、30 组面试问答、速查表全部条目。
 * 内容总量约几十 KB，构建期随 bundle 内联，查询为纯内存匹配，即时返回。
 */
import { chapters } from "@/lib/chapters";
import { flattenCheatsheet } from "@/lib/cheatsheet";
import { flattenEcosystem } from "@/lib/ecosystem";
import { flattenChangelog } from "@/lib/changelog";
import { labs } from "@/lib/lab";

export type SearchKind = "chapter" | "question" | "cheat" | "eco" | "lab" | "log";

export interface SearchEntry {
  kind: SearchKind;
  /** 展示标题：小节标题 / 问题 / 命令名 */
  title: string;
  /** 面包屑：第 N 章 · 章标题 / 速查表 · 分组 */
  crumb: string;
  /** 可检索全文（已小写、去 markdown 符号） */
  text: string;
  /** 跳转目标 */
  to: string;
}

export interface SearchResult extends SearchEntry {
  /** 命中位置附近的摘要 */
  snippet: string;
  score: number;
}

/** 去 markdown 记号，保留纯文本 */
function stripMarkdown(md: string): string {
  return md
    .replace(/^\[\[qa:\d+\]\]\s*$/gm, " ")
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, " ")) // 代码块保留代码文本
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接保留锚文本
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[*_`|]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let index: SearchEntry[] | null = null;

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const ch of chapters) {
    const crumb = `第 ${ch.id} 章 · ${ch.title}`;
    // 按二级/三级标题切小节，每节成为独立条目，标题参与匹配
    const blocks = ch.body.split(/^(#{2,3}\s+.+)$/m);
    // blocks: [前言, 标题1, 正文1, 标题2, 正文2, ...]
    for (let i = 0; i < blocks.length; i++) {
      const isHeading = /^#{2,3}\s+/.test(blocks[i]);
      if (isHeading) continue;
      const heading = i > 0 ? blocks[i - 1].replace(/^#{2,3}\s+/, "").trim() : ch.title;
      const text = stripMarkdown(blocks[i]);
      if (text.length < 20) continue;
      entries.push({
        kind: "chapter",
        title: heading,
        crumb,
        text: `${heading} ${text}`.toLowerCase(),
        to: `/chapter/${ch.id}/`,
      });
    }
    // 面试问答
    ch.interview.forEach((item, i) => {
      entries.push({
        kind: "question",
        title: item.q,
        crumb: `面试题 ${ch.id}-${i + 1} · ${ch.title}`,
        text: `${item.q} ${item.a}`.toLowerCase(),
        to: "/questions/",
      });
    });
  }

  for (const item of flattenCheatsheet()) {
    entries.push({
      kind: "cheat",
      title: item.key,
      crumb: `速查表 · ${item.group}`,
      text: `${item.key} ${item.desc}`.toLowerCase(),
      to: "/cheatsheet/",
    });
  }

  for (const item of flattenEcosystem()) {
    entries.push({
      kind: "eco",
      title: item.key,
      crumb: item.group,
      text: `${item.key} ${item.desc}`.toLowerCase(),
      to: "/ecosystem/",
    });
  }

  for (const item of flattenChangelog()) {
    entries.push({
      kind: "log",
      title: item.title,
      crumb: item.crumb,
      text: item.text,
      to: item.to,
    });
  }

  // 实战关卡：按小节切分，同章节处理
  for (const lab of labs) {
    const crumb = `实战第 ${lab.step} 关 · ${lab.title}`;
    const blocks = lab.body.split(/^(#{2,3}\s+.+)$/m);
    for (let i = 0; i < blocks.length; i++) {
      if (/^#{2,3}\s+/.test(blocks[i])) continue;
      const heading = i > 0 ? blocks[i - 1].replace(/^#{2,3}\s+/, "").trim() : lab.title;
      const text = stripMarkdown(blocks[i]);
      if (text.length < 20) continue;
      entries.push({
        kind: "lab",
        title: heading,
        crumb,
        text: `${heading} ${text}`.toLowerCase(),
        to: `/lab/${lab.step}/`,
      });
    }
  }

  return entries;
}

export function getIndex(): SearchEntry[] {
  if (!index) index = buildIndex();
  return index;
}

function makeSnippet(text: string, q: string, len = 96): string {
  const raw = text;
  const pos = raw.indexOf(q);
  if (pos < 0) return raw.slice(0, len) + (raw.length > len ? "…" : "");
  const start = Math.max(0, pos - 24);
  const end = Math.min(raw.length, pos + q.length + len - 24);
  return (start > 0 ? "…" : "") + raw.slice(start, end).trim() + (end < raw.length ? "…" : "");
}

/** 空格分词，全部词都命中才返回；标题命中权重高于正文 */
export function searchDocs(query: string, limit = 14): SearchResult[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];
  for (const e of getIndex()) {
    let score = 0;
    let allHit = true;
    for (const t of terms) {
      const inTitle = e.title.toLowerCase().includes(t);
      const inText = e.text.includes(t);
      if (!inTitle && !inText) {
        allHit = false;
        break;
      }
      score += inTitle ? 3 : 1;
    }
    if (!allHit) continue;
    if (e.kind === "question") score += 0.5; // 问答略微提权，转化价值高
    results.push({ ...e, score, snippet: makeSnippet(e.text, terms[0]) });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
