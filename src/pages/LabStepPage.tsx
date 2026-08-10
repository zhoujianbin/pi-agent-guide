import { useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router";
import { getLab, labs } from "@/lib/lab";
import { renderMarkdown } from "@/lib/markdown";
import { applyPageMeta, SITE_NAME } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, FlaskConical, LayoutGrid } from "lucide-react";

export default function LabStepPage() {
  const { step } = useParams();
  const lab = getLab(Number(step));

  const html = useMemo(() => (lab ? renderMarkdown(lab.body) : ""), [lab]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (lab) {
      applyPageMeta({
        title: `实战第${lab.step}关 ${lab.title} | ${SITE_NAME}`,
        description: lab.subtitle || `动手做 mini Agent 第 ${lab.step} 关：${lab.title}`,
        path: `/lab/${lab.step}/`,
      });
    }
  }, [lab]);

  if (!lab) return <Navigate to="/lab/" replace />;
  // URL 规范化：统一尾部斜杠
  if (!window.location.pathname.endsWith("/")) {
    return <Navigate to={`/lab/${lab.step}/`} replace />;
  }

  const prev = labs.find((l) => l.step === lab.step - 1);
  const next = labs.find((l) => l.step === lab.step + 1);

  const navBtn =
    "inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground shadow-soft transition-colors hover:border-emerald-300 hover:text-emerald-600";
  const navBtnDisabled =
    "inline-flex items-center gap-1 rounded-lg border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground/40";

  return (
    <div className="bg-grid min-h-screen">
      <div className="bg-noise pointer-events-none fixed inset-0" />
      <Navbar />

      <main id="lab-step-root" className="relative mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <Link
          to="/lab/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-emerald-600"
        >
          <ArrowLeft size={15} />
          返回实战专栏
        </Link>

        {/* 顶部关卡导航 */}
        <nav className="mt-4 flex items-center gap-2">
          {prev ? (
            <Link to={`/lab/${prev.step}/`} className={navBtn}>
              <ArrowLeft size={13} />
              上一关
            </Link>
          ) : (
            <span className={navBtnDisabled} aria-disabled="true">
              <ArrowLeft size={13} />
              上一关
            </span>
          )}
          <Link to="/lab/" className={navBtn}>
            <LayoutGrid size={13} />
            关卡目录
          </Link>
          {next ? (
            <Link to={`/lab/${next.step}/`} className={navBtn}>
              下一关
              <ArrowRight size={13} />
            </Link>
          ) : (
            <span className={navBtnDisabled} aria-disabled="true">
              下一关
              <ArrowRight size={13} />
            </span>
          )}
        </nav>

        {/* 头部 */}
        <header className="mt-8">
          <div className="flex items-baseline gap-4">
            <span className="text-gradient font-mono text-6xl font-black sm:text-7xl">
              {String(lab.step).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="secondary"
                className="border border-sky-100 bg-sky-50/70 font-mono text-[10px] text-sky-700"
              >
                <FlaskConical size={10} className="mr-1" />
                实战关卡
              </Badge>
              {lab.tags.map((t) => (
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
            {lab.title}
          </h1>
          {lab.subtitle && (
            <p className="mt-4 border-l-2 border-emerald-300 pl-4 text-base leading-relaxed text-muted-foreground">
              {lab.subtitle}
            </p>
          )}
        </header>

        {/* 正文 */}
        <article className="md-body mt-10">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>

        {/* 上一关 / 下一关（关底） */}
        <nav className="mt-16 grid gap-4 border-t border-border/70 pt-10 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/lab/${prev.step}/`}
              className="gradient-border group p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <ArrowLeft size={13} /> 上一关
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-emerald-600">
                {String(prev.step).padStart(2, "0")} · {prev.title}
              </p>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next ? (
            <Link
              to={`/lab/${next.step}/`}
              className="gradient-border group p-5 text-right shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                下一关 <ArrowRight size={13} />
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-sky-600">
                {String(next.step).padStart(2, "0")} · {next.title}
              </p>
            </Link>
          ) : (
            <Link
              to="/ecosystem/"
              className="gradient-border group p-5 text-right shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                已完成全部关卡 <ArrowRight size={13} />
              </p>
              <p className="mt-2 text-sm font-bold text-foreground/90 group-hover:text-emerald-600">
                去生态精选找灵感
              </p>
            </Link>
          )}
        </nav>
      </main>

      <Footer />
    </div>
  );
}
