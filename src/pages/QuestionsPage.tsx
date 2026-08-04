import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { chapters } from "@/lib/chapters";
import { applyPageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/useReveal";

export const QUESTIONS_TITLE = "AI Agent 面试题：30 问 30 答（基于生产级源码）| PI agent学习指南";
export const QUESTIONS_DESCRIPTION =
  "30 道 AI Agent 核心面试题与源码级答案：Agent Loop 停止条件、工具管道、消息系统、上下文工程、压缩算法与会话树，全部基于近 8 万 Star 的开源项目 Pi 源码拆解，每题附展开阅读章节。";

export default function QuestionsPage() {
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    applyPageMeta({ title: QUESTIONS_TITLE, description: QUESTIONS_DESCRIPTION, path: "/questions/" });
    window.scrollTo({ top: 0 });
  }, []);

  const total = chapters.reduce((n, c) => n + c.interview.length, 0);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main id="questions-root" className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <header className="reveal mb-14 text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-600">INTERVIEW {total} Q&amp;A</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            AI Agent 面试题：<span className="text-gradient">{total} 问 {total} 答</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            全部题目来自《PI agent 学习指南》十章，答案基于开源项目 Pi（GitHub 近 8 万 Star）的生产级源码，
            不是网上抄来的八股文。每题附「展开阅读」，答不上来的地方点进去看完整拆解。
          </p>
        </header>

        <div className="flex flex-col gap-14">
          {chapters.map((ch) => (
            <section key={ch.id} className="reveal">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-black text-emerald-200">
                  {String(ch.id).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-bold text-foreground">{ch.title}</h2>
                <Link
                  to={`/chapter/${ch.id}/`}
                  className="ml-auto shrink-0 text-sm text-emerald-600 transition-colors hover:text-emerald-500"
                >
                  读全章 →
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {ch.interview.map((item, i) => (
                  <article
                    key={i}
                    className="gradient-border rounded-2xl p-5 shadow-soft sm:p-6"
                  >
                    <h3 className="flex items-start gap-2.5 text-base font-bold leading-snug text-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-sky-500 text-white">
                        <HelpCircle size={12} strokeWidth={2.5} />
                      </span>
                      {item.q}
                    </h3>
                    <p className="mt-3 pl-[30px] text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                    <div className="mt-3 pl-[30px]">
                      <Link
                        to={`/chapter/${ch.id}/`}
                        className="group inline-flex items-center gap-1 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-500"
                      >
                        展开阅读：第 {ch.id} 章
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="reveal mt-16 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-soft">
          <p className="text-lg font-bold text-foreground">答上来几题？</p>
          <p className="mt-2 text-sm text-muted-foreground">
            答不上来的章节，才是真正值得读的部分——每章开头都带着这三个问题去读，效率高得多。
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            回到首页开始学
            <ArrowRight size={14} />
          </Link>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
