import { Link } from "react-router";
import { ArrowRight, FlaskConical } from "lucide-react";

export function LabPromo() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <Link
        to="/lab/"
        className="reveal group relative block overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1 sm:p-10"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
            <FlaskConical size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs tracking-widest text-emerald-600">HANDS-ON LAB · 新专栏</p>
            <h2 className="mt-2 text-xl font-black text-foreground sm:text-2xl">
              动手做一个 mini Agent：5 关从零写出自己的 Agent
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              零依赖、零框架、纯 Node.js。从一次裸 fetch 开始，逐关加上工具调用、流式事件、上下文压缩，
              每关结尾对照 Pi 源码验收——理论给地图，动手给肌肉记忆。
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform group-hover:scale-105">
            开始闯关
            <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </section>
  );
}
