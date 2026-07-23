import { Button } from "@/components/ui/button";
import { AgentLoopDiagram } from "@/components/AgentLoopDiagram";
import { ArrowDown, Github } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-grid relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div className="bg-noise pointer-events-none absolute inset-0" />
      {/* 氛围光斑 */}
      <div className="hero-orb pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="hero-orb pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" style={{ animationDelay: "3s" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="reveal">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            生产级 AI Agent 运行时 · 源码拆解
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            PI agent
            <br />
            <span className="text-gradient">学习指南</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            从零看懂一个生产级 AI Agent 的运行时底座——不是玩具框架，
            而是真正能上线的 Agent 工程参考实现。十章导读，
            带你拆解 Agent Loop、工具管道、上下文工程与会话树的每一处设计权衡。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="glow-cyan bg-gradient-to-r from-emerald-500 to-sky-500 font-semibold text-white hover:opacity-90"
              onClick={() => document.getElementById("chapters")?.scrollIntoView({ behavior: "smooth" })}
            >
              开始学习
              <ArrowDown className="ml-1.5" size={17} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border bg-white/70 hover:border-emerald-300 hover:text-emerald-600"
              asChild
            >
              <a href="https://github.com/earendil-works/pi" target="_blank" rel="noreferrer">
                <Github className="mr-1.5" size={17} />
                Pi 官方仓库
              </a>
            </Button>
          </div>
          <div className="mt-10 flex gap-8 font-mono text-xs text-muted-foreground">
            <span><span className="font-bold text-emerald-600">4</span> 核心包</span>
            <span><span className="font-bold text-emerald-600">10</span> 章拆解</span>
            <span><span className="font-bold text-emerald-600">28</span> 幅图解</span>
          </div>
        </div>

        <div className="reveal hidden lg:block" style={{ animationDelay: "0.2s" }}>
          <AgentLoopDiagram />
        </div>
      </div>
    </section>
  );
}
