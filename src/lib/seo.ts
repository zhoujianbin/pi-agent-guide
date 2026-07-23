/** 路由级动态元信息：零依赖实现，直接操作 document.head */

export const SITE_NAME = "PI agent学习指南";
export const SITE_URL = "https://pistudy.com.cn";

export const HOME_TITLE = "PI agent学习指南 - 生产级 AI Agent 运行时中文实战教程";
export const HOME_DESCRIPTION =
  "《PI agent学习指南》——基于开源项目 Pi 源码逐行拆解的中文实战教程：十章读懂生产级 AI Agent 运行时，覆盖 Agent Loop、工具管道、上下文工程与会话树，每章附面试问答与架构图解。";

function setMetaContent(selector: string, content: string): void {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

function setCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

export interface PageMeta {
  title: string;
  description: string;
  /** 站内路径，如 "/" 或 "/chapter/3/"（章节页统一尾部斜杠） */
  path: string;
}

/** 切换路由时更新 title / description / canonical / og:url */
export function applyPageMeta({ title, description, path }: PageMeta): void {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', url);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setCanonical(url);
}

export function chapterTitle(id: number, title: string): string {
  return `第${id}章 ${title} | ${SITE_NAME}`;
}
