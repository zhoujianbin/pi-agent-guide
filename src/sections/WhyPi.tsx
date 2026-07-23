import { RefreshCcw, Wrench, MessagesSquare, Radio, GitBranch, Puzzle, Code2, Cpu, BookOpen } from "lucide-react";

const capabilities = [
  {
    icon: RefreshCcw,
    title: "Agent Loop",
    desc: "模型循环调用、明确的停止条件信号灯、层层设防的错误处理——引擎的每一圈都兜得住。",
  },
  {
    icon: Wrench,
    title: "工具系统",
    desc: "定义 / 注册 / 拦截 / 执行 / 回收的五步管道，让模型的每一次“动手”都在管控之内。",
  },
  {
    icon: MessagesSquare,
    title: "消息系统",
    desc: "内部用自由联合类型充分表达，跨边界时统一翻译成标准 Message——内富外严。",
  },
  {
    icon: Radio,
    title: "事件驱动",
    desc: "发布订阅解耦 UI 与运行时，“emit 即 await”的同步屏障保证时序可预测。",
  },
  {
    icon: GitBranch,
    title: "会话管理",
    desc: "Session Tree 让对话可存储、可恢复、可分叉，回退与分支都是数据结构的自然能力。",
  },
  {
    icon: Puzzle,
    title: "扩展机制",
    desc: "工厂函数 + 事件总线，新能力以插件方式挂进来，核心代码零改动。",
  },
];

const audiences = [
  { icon: Code2, label: "想自己搭 Agent 的开发者" },
  { icon: Cpu, label: "想理解生产级 Agent 内部运转的工程师" },
  { icon: BookOpen, label: "想看懂 Harness 设计的好奇心读者" },
];

export function WhyPi() {
  return (
    <section id="why" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-12">
          <p className="font-mono text-xs tracking-widest text-emerald-600">WHY PI</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            为什么值得学 <span className="text-gradient">Pi</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            大多数 Agent 教程止步于调 API。Pi 把“能上线”的完整答案写在源码里：
            六项核心能力，每一项都对应一个真实工程痛点。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className="reveal group rounded-2xl border border-border/80 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:glow-cyan"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 text-emerald-600 transition-all duration-300 group-hover:from-emerald-100 group-hover:to-sky-100">
                <c.icon size={21} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 rounded-2xl border border-border/80 bg-white/80 p-6 shadow-soft sm:p-8">
          <p className="font-mono text-xs tracking-widest text-sky-600">WHO SHOULD LEARN</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.label} className="flex items-center gap-3 text-sm text-foreground/85">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <a.icon size={17} />
                </span>
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
