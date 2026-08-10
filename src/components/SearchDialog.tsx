import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Search, FileText, CircleHelp, SquareTerminal, CornerDownLeft } from "lucide-react";
import { searchDocs, type SearchKind, type SearchResult } from "@/lib/search";

const KIND_META: Record<SearchKind, { label: string; cls: string; icon: ReactNode }> = {
  chapter: {
    label: "章节",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    icon: <FileText size={11} />,
  },
  question: {
    label: "面试题",
    cls: "bg-sky-50 text-sky-700 border-sky-200/70",
    icon: <CircleHelp size={11} />,
  },
  cheat: {
    label: "速查表",
    cls: "bg-amber-50 text-amber-700 border-amber-200/70",
    icon: <SquareTerminal size={11} />,
  },
};

const HOT_ENTRIES = [
  { to: "/#chapters", label: "十章指南目录", desc: "从三层架构到会话树，逐章拆解" },
  { to: "/questions/", label: "面试 30 题", desc: "30 问 30 答，读完自测" },
  { to: "/cheatsheet/", label: "命令速查表", desc: "斜杠命令 / CLI / 快捷键" },
];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results: SearchResult[] = useMemo(() => searchDocs(query), [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // 等动画帧再聚焦，避免移动端键盘弹起抖动
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (to: string) => {
    onClose();
    if (to.includes("#")) {
      const [path, hash] = to.split("#");
      navigate(path || "/");
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      navigate(to);
      window.scrollTo({ top: 0 });
    }
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].to);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-900/30 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-4">
          <Search size={16} className="shrink-0 text-muted-foreground/60" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="搜索章节、面试题、命令……"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground/50"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border/80 bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {query.trim() === "" && (
            <div className="p-1">
              <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] tracking-widest text-muted-foreground/60">
                快速入口
              </p>
              {HOT_ENTRIES.map((h) => (
                <button
                  key={h.to}
                  onClick={() => go(h.to)}
                  className="flex w-full items-baseline gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-secondary/70"
                >
                  <span className="shrink-0 text-sm font-semibold text-foreground">{h.label}</span>
                  <span className="truncate text-xs text-muted-foreground">{h.desc}</span>
                </button>
              ))}
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              没有找到「{query}」相关内容
            </p>
          )}

          {results.map((r, i) => {
            const meta = KIND_META[r.kind];
            return (
              <button
                key={`${r.to}-${r.title}-${i}`}
                onClick={() => go(r.to)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === active ? "bg-emerald-50/80" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${meta.cls}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">{r.title}</span>
                  {i === active && (
                    <CornerDownLeft size={12} className="ml-auto shrink-0 text-emerald-500" />
                  )}
                </span>
                <span className="pl-[52px] text-xs text-muted-foreground/80">
                  <span className="mr-2 text-muted-foreground/50">{r.crumb}</span>
                  {r.snippet}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 border-t border-border/60 px-4 py-2.5 font-mono text-[10px] text-muted-foreground/60 sm:flex">
          <span>↑↓ 选择</span>
          <span>Enter 跳转</span>
          <span>Esc 关闭</span>
          <span className="ml-auto">全站内容 · 本地即时匹配</span>
        </div>
      </div>
    </div>
  );
}
