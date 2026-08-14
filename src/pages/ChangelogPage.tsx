import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ExternalLink, Filter, Radar, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { applyPageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/useReveal";
import {
  changelogVersions,
  CHANGELOG_SOURCE,
  CHANGELOG_UPDATED,
  CHAPTER_SHORT,
  type ChangelogItem,
} from "@/lib/changelog";

export const CHANGELOG_TITLE = "Pi 版本雷达：每个版本更新了啥，对应指南哪一章 | PI agent学习指南";
export const CHANGELOG_DESCRIPTION =
  "追踪 Pi（earendil-works/pi）官方版本更新：v0.73 至最新版的中文人话解读，每条变更标注对应指南章节——压缩重试、全屏 TUI、远程会话、约束采样、项目信任，读完指南也能跟上迭代。";

const TAG_CLS: Record<string, string> = {
  TUI: "border-sky-100 bg-sky-50/70 text-sky-700",
  扩展: "border-violet-100 bg-violet-50/70 text-violet-700",
  Provider: "border-amber-100 bg-amber-50/70 text-amber-700",
  工程: "border-slate-200 bg-slate-50/80 text-slate-600",
  安全: "border-rose-100 bg-rose-50/70 text-rose-700",
};

function ItemRow({ item }: { item: ChangelogItem }) {
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-border/60 bg-white/80 p-4 sm:flex-row sm:items-start sm:gap-3">
      <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/90">
        {item.breaking && (
          <span className="mr-1.5 inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5 align-middle font-mono text-[10px] font-bold text-rose-600">
            不兼容
          </span>
        )}
        {item.text}
      </p>
      <span className="flex shrink-0 flex-wrap items-center gap-1.5">
        {item.chapters?.map((c) => (
          <Link
            key={c}
            to={`/chapter/${c}/`}
            title={`第 ${c} 章：${CHAPTER_SHORT[c]}`}
            className="inline-flex items-center rounded-md border border-emerald-100 bg-emerald-50/70 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100/70"
          >
            第{c}章
          </Link>
        ))}
        {item.tag && (
          <span
            className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${TAG_CLS[item.tag]}`}
          >
            {item.tag}
          </span>
        )}
      </span>
    </li>
  );
}

export default function ChangelogPage() {
  const ref = useReveal<HTMLDivElement>();
  const [chapterFilter, setChapterFilter] = useState<number | null>(null);

  useEffect(() => {
    applyPageMeta({ title: CHANGELOG_TITLE, description: CHANGELOG_DESCRIPTION, path: "/changelog/" });
    window.scrollTo({ top: 0 });
  }, []);

  const versions = useMemo(() => {
    if (chapterFilter === null) return changelogVersions;
    return changelogVersions
      .map((v) => ({
        ...v,
        items: v.items.filter((i) => i.chapters?.includes(chapterFilter)),
      }))
      .filter((v) => v.items.length > 0);
  }, [chapterFilter]);

  const totalItems = changelogVersions.reduce((n, v) => n + v.items.length, 0);
  const latest = changelogVersions[0];
  const oldest = changelogVersions[changelogVersions.length - 1];
  // 各章节被提到的次数（用于筛选条）
  const chapterCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const v of changelogVersions)
      for (const i of v.items)
        for (const c of i.chapters ?? []) counts.set(c, (counts.get(c) ?? 0) + 1);
    return counts;
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main id="changelog-root" className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <header className="reveal mb-10 text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-600">RELEASE RADAR</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Pi <span className="text-gradient">版本雷达</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Pi 三个月发了十几个版本，指南会不会过时？这里把{" "}
            <strong className="text-foreground">
              {oldest.version} → {latest.version}
            </strong>{" "}
            的官方更新翻译成中文人话，共 {totalItems} 条精选——每条都标注
            <strong className="text-foreground">对应指南哪一章</strong>，让十章内容变成你理解新功能的地图。
          </p>
          <p className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground/70">
            <RefreshCw size={11} className="inline" />
            每周边定时任务自动检查新版本，最近更新 {CHANGELOG_UPDATED}；完整原文见{" "}
            <a
              href={CHANGELOG_SOURCE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              GitHub Releases
            </a>
          </p>

          {/* 章节筛选 */}
          <div className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-1.5">
            <Filter size={13} className="mr-1 text-muted-foreground/60" />
            <button
              onClick={() => setChapterFilter(null)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors ${
                chapterFilter === null
                  ? "border-emerald-400 bg-emerald-500 text-white shadow-soft"
                  : "border-border/80 bg-white text-muted-foreground hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              全部
            </button>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => {
              const count = chapterCounts.get(c) ?? 0;
              if (count === 0) return null;
              const active = chapterFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => setChapterFilter(active ? null : c)}
                  title={`第 ${c} 章：${CHAPTER_SHORT[c]}`}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-emerald-400 bg-emerald-500 text-white shadow-soft"
                      : "border-border/80 bg-white text-muted-foreground hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  第{c}章 · {count}
                </button>
              );
            })}
          </div>
        </header>

        {versions.length === 0 && (
          <p className="reveal rounded-2xl border border-border/70 bg-white py-10 text-center text-sm text-muted-foreground shadow-soft">
            这一章在追踪区间内没有对应变更，点「全部」看看别的。
          </p>
        )}

        {/* 时间线 */}
        <div className="relative flex flex-col gap-8 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-gradient-to-b before:from-emerald-300 before:via-sky-200 before:to-transparent sm:before:left-[8px]">
          {versions.map((v) => (
            <section key={v.version} className="reveal relative pl-8 sm:pl-10">
              <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-400 bg-white shadow-soft" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-mono text-xl font-black text-foreground">{v.version}</h2>
                <time className="font-mono text-xs text-muted-foreground/70">{v.date}</time>
                <a
                  href={`${CHANGELOG_SOURCE}/tag/${v.version}.0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`查看 ${v.version} 完整发布说明`}
                  className="text-muted-foreground/50 transition-colors hover:text-emerald-600"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="mt-2 border-l-2 border-emerald-300 pl-3 text-sm font-medium leading-relaxed text-emerald-800/90">
                {v.headline}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {v.items.map((item, i) => (
                  <ItemRow key={i} item={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="reveal mt-16 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-soft">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
            <Radar size={19} />
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">新功能看不懂？回章节里找地基</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            压缩重试对应第 9 章的切割与摘要、约束采样对应第 5 章的工具管道、远程会话对应第 7 章事件流与第 10
            章会话存储——版本会变，地基不变。
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            回到十章指南
            <ArrowRight size={14} />
          </Link>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
