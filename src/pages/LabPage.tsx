import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, FlaskConical, Github, Hammer, TerminalSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { labs } from "@/lib/lab";
import { applyPageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/badge";

export const LAB_TITLE = "动手做一个 mini Agent：6 关从零写出自己的 Agent | PI agent学习指南";
export const LAB_DESCRIPTION =
  "零依赖、零框架、纯 Node.js：从一次裸 fetch 调用开始，逐关加上工具调用循环、流式事件、上下文压缩、可交互 REPL 与会话分叉，每关对照 Pi 源码讲清原理。";

const PREP = [
  { k: "Node 20+", v: "自带全局 fetch，不用装任何依赖" },
  { k: "一个 API Key", v: "任意 OpenAI 兼容供应商（DeepSeek / 通义 / 智谱…）" },
  { k: "一个终端", v: "全部代码 node 直接跑，没有构建步骤" },
];

export default function LabPage() {
  const ref = useReveal<HTMLDivElement>();

  useEffect(() => {
    applyPageMeta({ title: LAB_TITLE, description: LAB_DESCRIPTION, path: "/lab/" });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main id="lab-root" className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <header className="reveal mb-12 text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-600">HANDS-ON LAB</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            动手做一个 <span className="text-gradient">mini Agent</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            十章指南告诉你 Pi 是怎么设计的；这个专栏让你<strong className="text-foreground">亲手写一个</strong>。
            零依赖、零框架，6 关从一次裸 fetch 开始，逐关加工具、流式、压缩、REPL，最后给会话装上分叉时光机。
            每关结尾对照 Pi 源码——读完理论再来动手，或者动手卡住了回去翻理论，都行。
          </p>
        </header>

        {/* 环境准备 */}
        <section className="reveal mb-12 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 shadow-soft sm:p-7">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
              <TerminalSquare size={17} />
            </span>
            <h2 className="text-lg font-bold text-foreground">动手前只要三样东西</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PREP.map((p) => (
              <div key={p.k} className="rounded-xl border border-border/60 bg-white/80 p-4">
                <p className="font-mono text-sm font-bold text-emerald-700">{p.k}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 配套开源仓库 */}
        <a
          href="https://github.com/zhoujianbin/pi-mini-agent"
          target="_blank"
          rel="noopener noreferrer"
          className="reveal group mb-12 flex flex-col items-start gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:p-7"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-soft">
            <Github size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-foreground">配套代码已开源：pi-mini-agent</span>
              <Badge variant="secondary" className="border border-emerald-100 bg-emerald-50/70 font-mono text-[10px] text-emerald-700">
                6 关全部用真实 API 实测通过
              </Badge>
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              克隆下来配好 Key 就能逐关跑，含 playground 测试文件；实跑中踩出的两个真实 bug 也留在了代码注释里。
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 font-mono text-xs font-bold text-foreground transition-colors group-hover:border-emerald-400 group-hover:text-emerald-600">
            github.com/zhoujianbin/pi-mini-agent
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>

        {/* 关卡列表 */}
        <div className="flex flex-col gap-5">
          {labs.map((lab) => (
            <Link
              key={lab.step}
              to={`/lab/${lab.step}/`}
              className="reveal gradient-border group block rounded-2xl p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <span className="text-gradient shrink-0 font-mono text-4xl font-black">
                  {String(lab.step).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-600">
                      {lab.title}
                    </h2>
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lab.subtitle}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    开始这一关
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="reveal mt-16 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-soft">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
            <Hammer size={19} />
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">先读理论还是直接上手？</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            推荐交替进行：第 1~2 关配第 3、5 章，第 3 关配第 6、7 章，第 4 关配第 8、9 章，第 5 关配第 3、4 章，第 6 关配第 10 章。
            理论给地图，动手给肌肉记忆。
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            回到十章指南
            <ArrowRight size={14} />
          </Link>
        </footer>

        <p className="reveal mt-8 text-center font-mono text-xs text-muted-foreground/60">
          <FlaskConical size={11} className="mr-1 inline" />
          专栏代码均为原创教学示例，已开源在{" "}
          <a
            href="https://github.com/zhoujianbin/pi-mini-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-emerald-600"
          >
            pi-mini-agent
          </a>
          ，MIT 许可，随意取用
        </p>
      </main>
      <Footer />
    </div>
  );
}
