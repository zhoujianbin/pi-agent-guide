import { Package, Bot, TerminalSquare, MonitorSmartphone, ExternalLink } from "lucide-react";

const packages = [
  {
    icon: Package,
    name: "pi-ai",
    desc: "统一多模型 LLM API。一套中立格式驾驭十几家厂商，翻译器架构把协议差异关在边界层。",
  },
  {
    icon: Bot,
    name: "pi-agent-core",
    desc: "Agent 运行时核心。循环引擎、工具管道、事件总线、会话树都在这里，与 UI 和模型彻底解耦。",
  },
  {
    icon: TerminalSquare,
    name: "pi-coding-agent",
    desc: "交互式编程 CLI。基于核心运行时构建的完整产品形态，开箱即用的终端编程助手。",
  },
  {
    icon: MonitorSmartphone,
    name: "pi-tui",
    desc: "独立的终端 UI 层。负责渲染与交互，可替换、可裁剪，展示“表现层”该有的克制。",
  },
];

export function AboutPi() {
  return (
    <section id="about" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-12">
          <p className="font-mono text-xs tracking-widest text-emerald-600">ABOUT PI</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            关于 <span className="text-gradient">Pi 项目</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pi 是一个开源的生产级 AI Agent 运行时底座（MIT License）。四个核心包各司其职，
            组合出一个“模型自由、界面自由、扩展自由”的 Agent 工程参考实现。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {packages.map((p, i) => (
            <div
              key={p.name}
              className="gradient-border reveal group p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 text-emerald-600">
                  <p.icon size={19} />
                </span>
                <h3 className="font-mono text-lg font-bold text-emerald-700">{p.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-wrap gap-4">
          <a
            href="https://github.com/earendil-works/pi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground/85 shadow-soft transition-colors hover:border-emerald-300 hover:text-emerald-600"
          >
            GitHub 仓库 <ExternalLink size={14} />
          </a>
          <a
            href="https://pi.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm text-foreground/85 shadow-soft transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            pi.dev 官网 <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
