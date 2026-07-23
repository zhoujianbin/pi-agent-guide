import { Compass, Cog, Layers, Infinity as InfinityIcon } from "lucide-react";

const stages = [
  {
    icon: Compass,
    step: "阶段 ①",
    range: "第 1 – 2 章",
    title: "建立全局观",
    desc: "先看懂 Pi 的整体样貌与三层架构骨骼，知道每个包为什么存在、依赖流向何方。",
  },
  {
    icon: Cog,
    step: "阶段 ②",
    range: "第 3 – 5 章",
    title: "拆解运行时主循环",
    desc: "深入 Agent Loop、多模型统一调用与工具管道——Agent 真正“干活”的核心三段。",
  },
  {
    icon: Layers,
    step: "阶段 ③",
    range: "第 6 – 7 章",
    title: "拆解支撑系统",
    desc: "消息系统与事件驱动：记忆如何组织传递，各模块如何有序通信。",
  },
  {
    icon: InfinityIcon,
    step: "阶段 ④",
    range: "第 8 – 10 章",
    title: "长生对话的工程问题",
    desc: "上下文工程、压缩算法与会话树——让 Agent 连续工作几小时也不丢记忆。",
  },
];

export function LearningPath() {
  return (
    <section id="path" className="bg-grid relative py-20 sm:py-24">
      <div className="bg-noise pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-14">
          <p className="font-mono text-xs tracking-widest text-emerald-600">LEARNING PATH</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            四段递进的<span className="text-gradient">学习路径</span>
          </h2>
        </div>

        <div className="relative">
          {/* 竖向时间线（移动端）/ 横向（桌面） */}
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-emerald-300/70 via-sky-300/50 to-transparent md:hidden" />
          <div className="grid gap-10 md:grid-cols-4 md:gap-6">
            {stages.map((s, i) => (
              <div key={s.title} className="reveal relative pl-14 md:pl-0" style={{ animationDelay: `${i * 0.12}s` }}>
                {/* 节点圆点 */}
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-soft md:relative md:mb-5">
                  <s.icon size={18} className="text-emerald-600" />
                </div>
                {/* 桌面连接线 */}
                {i < stages.length - 1 && (
                  <div className="absolute left-14 right-0 top-5 hidden h-px bg-gradient-to-r from-emerald-300/60 to-sky-300/40 md:block" style={{ width: "calc(100% - 3.5rem)" }} />
                )}
                <p className="font-mono text-xs text-sky-600">{s.step} · {s.range}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
