import type { InterviewItem } from "@/lib/chapters";
import { MessageSquareQuote } from "lucide-react";

/**
 * 面试问答气泡：桌面端浮动在正文右侧，移动端为正文流中的全宽卡片
 */
export function QaBubble({ n, item }: { n: number; item: InterviewItem }) {
  return (
    <aside className="my-5 w-full lg:float-right lg:clear-right lg:my-1 lg:mb-5 lg:ml-6 lg:w-60">
      <div className="gradient-border shadow-soft p-4">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-sky-500 text-white">
            <MessageSquareQuote size={11} />
          </span>
          <span className="font-mono text-[11px] font-bold tracking-wide text-emerald-600">
            面试题 {n}
          </span>
        </div>
        <p className="mt-2.5 text-[13px] font-bold leading-snug text-foreground">
          {item.q}
        </p>
        <p className="mt-2 border-t border-dashed border-emerald-200/80 pt-2 text-xs leading-relaxed text-[#4a6355]">
          {item.a}
        </p>
      </div>
    </aside>
  );
}
