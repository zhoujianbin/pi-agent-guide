import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, Navigate } from "react-router";
import { getChapter, chapters } from "@/lib/chapters";
import { renderMarkdown } from "@/lib/markdown";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QaBubble } from "@/components/QaBubble";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CircleHelp, LayoutGrid } from "lucide-react";

interface Segment {
  marker: number | null;
  html: string;
}

/** 按 [[qa:N]] 标记把正文切段，段首挂对应气泡 */
function splitBody(body: string): Segment[] {
  const stripped = body.replace(/^#\s+.*(\r?\n)+/, ""); // 去掉与页头重复的一级标题
  const parts = stripped.split(/^\[\[qa:(\d+)\]\]\s*$/m);
  const segments: Segment[] = [];
  let pendingMarker: number | null = null;
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      pendingMarker = Number(part);
      continue;
    }
    if (part.trim() === "" && pendingMarker === null) continue;
    segments.push({ marker: pendingMarker, html: renderMarkdown(part) });
    pendingMarker = null;
  }
  return segments;
}

export default function ChapterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chapter = getChapter(Number(id));

  const segments = useMemo(() => (chapter ? splitBody(chapter.body) : []), [chapter]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (chapter) document.title = `第${chapter.id}章 · ${chapter.title} | PI agent学习指南`;
    return () => {
      document.title = "PI agent学习指南";
    };
  }, [chapter]);

  if (!chapter) return <Navigate to="/" replace />;

  const prev = chapters.find((c) => c.id === chapter.id - 1);
  const next = chapters.find((c) => c.id === chapter.id + 1);

  const navBtn =
    "inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground shadow-soft transition-colors hover:border-emerald-300 hover:text-emerald-600";
  const navBtnDisabled =
    "inline-flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground/40";

  return (
    <div className="bg-grid min-h-screen">
      <div className="bg-noise pointer-events-none fixed inset-0" />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={15} />
          返回首页
        </Link>

        {/* 顶部快捷章导航 */}
        <nav className="mt-4 flex items-center gap-2">
          {prev ? (
            <Link to={`/chapter/${prev.id}`} className={navBtn}>
              <ArrowLeft size={13} />
              上一章
            </Link>
          ) : (
            <span className={navBtnDisabled} aria-disabled="true">
              <ArrowLeft size={13} />
              上一章
            </span>
          )}
          <a
            href="/#chapters"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
              setTimeout(() => {
                document.getElementById("chapters")?.scrollIntoView({ behavior: "smooth" });
              }, 120);
            }}
            className={navBtn}
          >
            <LayoutGrid size={13} />
            章节目录
          </a>
          {next ? (
            <Link to={`/chapter/${next.id}`} className={navBtn}>
              下一章
              <ArrowRight size={13} />
            </Link>
          ) : (
            <span className={navBtnDisabled} aria-disabled="true">
              下一章
              <ArrowRight size={13} />
            </span>
          )}
        </nav>

        {/* 章节头部 */}
        <header className="mt-8">
          <div className="flex items-baseline gap-4">
            <span className="text-gradient font-mono text-6xl font-black sm:text-7xl">
              {String(chapter.id).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {chapter.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="border border-emerald-100 bg-emerald-50/70 font-mono text-[10px] text-emerald-700"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <p className="mt-4 border-l-2 border-emerald-300 pl-4 text-base leading-relaxed text-muted-foreground">
              {chapter.subtitle}
            </p>
          )}
        </header>

        {/* 带着问题读 */}
        {chapter.interview.length > 0 && (
          <section className="glow-cyan relative mt-10 overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
                  <CircleHelp size={17} />
                </span>
                <h2 className="text-lg font-bold text-foreground">带着问题读</h2>
              </div>
              <p className="mt-2.5 text-sm text-muted-foreground">
                读完本章，你应该能回答这三个问题：
              </p>
              <ol className="mt-4 space-y-3">
                {chapter.interview.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-mono text-xs font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-foreground/90">
                      {item.q}
                      <span className="mt-1 block text-xs text-muted-foreground/80">
                        答案见正文中对应的「面试题 {i + 1}」气泡
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Markdown 正文（分段渲染，段间插入面试气泡） */}
        <article className="md-body mt-10">
          {segments.map((seg, i) => (
            <div key={i}>
              {seg.marker !== null && chapter.interview[seg.marker - 1] && (
                <QaBubble n={seg.marker} item={chapter.interview[seg.marker - 1]} />
              )}
              <div dangerouslySetInnerHTML={{ __html: seg.html }} />
            </div>
          ))}
        </article>

        {/* 上一章 / 下一章（章末） */}
        <nav className="mt-16 grid gap-4 border-t border-border/70 pt-10 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/chapter/${prev.id}`}
              className="gradient-border group p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <ArrowLeft size={13} /> 上一章
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-emerald-600">
                {String(prev.id).padStart(2, "0")} · {prev.title}
              </p>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next ? (
            <Link
              to={`/chapter/${next.id}`}
              className="gradient-border group p-5 text-right shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                下一章 <ArrowRight size={13} />
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-sky-600">
                {String(next.id).padStart(2, "0")} · {next.title}
              </p>
            </Link>
          ) : (
            <Link
              to="/"
              className="gradient-border group p-5 text-right shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                已完成全部章节 <ArrowRight size={13} />
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-emerald-600">
                回到首页
              </p>
            </Link>
          )}
        </nav>
      </main>

      <Footer />
    </div>
  );
}
