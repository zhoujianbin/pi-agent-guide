import { Link } from "react-router";
import { chapters } from "@/lib/chapters";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function ChapterGrid() {
  return (
    <section id="chapters" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal mb-12">
          <p className="font-mono text-xs tracking-widest text-emerald-600">10 CHAPTERS</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            十章<span className="text-gradient">指南</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            每章一篇精华导读，配原创图解与代码示意。点击卡片进入完整章节。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((ch, i) => (
            <Link
              key={ch.id}
              to={`/chapter/${ch.id}/`}
              className="gradient-border reveal group flex flex-col p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:glow-violet"
              style={{ animationDelay: `${(i % 3) * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-4xl font-black text-emerald-100 transition-colors duration-300 group-hover:text-emerald-300">
                  {String(ch.id).padStart(2, "0")}
                </span>
                <ArrowRight
                  size={18}
                  className="mt-1.5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-500 group-hover:opacity-100"
                />
              </div>
              <h3 className="mt-4 text-base font-bold leading-snug text-foreground">{ch.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{ch.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ch.tags.slice(0, 3).map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="border border-emerald-100 bg-emerald-50/70 font-mono text-[10px] text-emerald-700"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
