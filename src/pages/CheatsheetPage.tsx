import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Filter, SquareTerminal, Keyboard, Wrench, PencilLine } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { applyPageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/useReveal";
import {
  slashGroups,
  cliGroups,
  keyGroups,
  editorTips,
  builtinTools,
  type CheatGroup,
  type CheatItem,
} from "@/lib/cheatsheet";

export const CHEATSHEET_TITLE = "Pi 速查表：斜杠命令 / CLI 参数 / 快捷键一页全收录 | PI agent学习指南";
export const CHEATSHEET_DESCRIPTION =
  "Pi coding agent 中文速查表：全部斜杠命令（会话分叉、压缩、导出分享）、CLI 参数（四种运行模式、工具白名单、模型切换）、编辑器技巧与默认快捷键，依据官方文档整理，支持页内筛选。";

const monoCell = "font-mono text-[13px] font-semibold text-emerald-700";
const descCell = "text-sm leading-relaxed text-muted-foreground";

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-block rounded-md border border-border/80 bg-secondary/70 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground/80 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      {children}
    </kbd>
  );
}

function ItemRow({ item, isKey }: { item: CheatItem; isKey?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/50 px-4 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4 sm:px-5">
      <span className={`shrink-0 sm:w-64 ${monoCell}`}>
        {isKey ? <Kbd>{item.key}</Kbd> : item.key}
      </span>
      <span className={descCell}>
        {item.desc}
        {item.note && (
          <span className="mt-0.5 block text-xs text-muted-foreground/70">{item.note}</span>
        )}
      </span>
    </div>
  );
}

function GroupCard({ group, isKey }: { group: CheatGroup; isKey?: boolean }) {
  if (group.items.length === 0) return null;
  return (
    <div className="reveal overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
      <h3 className="border-b border-border/60 bg-gradient-to-r from-emerald-50/80 to-sky-50/60 px-4 py-2.5 text-sm font-bold text-foreground sm:px-5">
        {group.title}
      </h3>
      <div>
        {group.items.map((item, i) => (
          <ItemRow key={i} item={item} isKey={isKey} />
        ))}
      </div>
    </div>
  );
}

function filterGroups(groups: CheatGroup[], q: string): CheatGroup[] {
  if (!q) return groups;
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (it) =>
          it.key.toLowerCase().includes(q) ||
          it.desc.toLowerCase().includes(q) ||
          (it.note ?? "").toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length > 0);
}

function filterItems(items: CheatItem[], q: string): CheatItem[] {
  if (!q) return items;
  return items.filter(
    (it) => it.key.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q),
  );
}

function SectionHead({
  icon,
  kicker,
  title,
  desc,
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="reveal mb-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
          {icon}
        </span>
        <div>
          <p className="font-mono text-[10px] tracking-widest text-emerald-600">{kicker}</p>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export default function CheatsheetPage() {
  const ref = useReveal<HTMLDivElement>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    applyPageMeta({ title: CHEATSHEET_TITLE, description: CHEATSHEET_DESCRIPTION, path: "/cheatsheet/" });
    window.scrollTo({ top: 0 });
  }, []);

  const q = query.trim().toLowerCase();
  const slash = useMemo(() => filterGroups(slashGroups, q), [q]);
  const cli = useMemo(() => filterGroups(cliGroups, q), [q]);
  const keys = useMemo(() => filterGroups(keyGroups, q), [q]);
  const tips = useMemo(() => filterItems(editorTips, q), [q]);
  const tools = useMemo(() => filterItems(builtinTools, q), [q]);
  const empty =
    slash.length + cli.length + keys.length + tips.length + tools.length === 0;

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main id="cheatsheet-root" className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <header className="reveal mb-10 text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-600">CHEATSHEET</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Pi <span className="text-gradient">速查表</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            斜杠命令、CLI 参数、编辑器技巧、默认快捷键，一页全收录。内容依据 Pi
            官方文档（usage / keybindings）整理，适合收藏后随用随查。
          </p>

          <div className="relative mx-auto mt-7 max-w-md">
            <Filter
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="筛选命令或快捷键，如 compact、Ctrl、tools…"
              className="w-full rounded-full border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-emerald-300"
            />
          </div>
        </header>

        {empty && (
          <p className="reveal rounded-2xl border border-border/70 bg-white py-10 text-center text-sm text-muted-foreground shadow-soft">
            没有匹配「{query}」的条目，换个关键词试试。
          </p>
        )}

        {slash.length > 0 && (
          <section className="mb-14">
            <SectionHead
              icon={<SquareTerminal size={17} />}
              kicker="SLASH COMMANDS"
              title="斜杠命令"
              desc="在编辑器里输入 / 会弹出命令补全。扩展可以注册自定义命令，技能以 /skill:名称 调用，提示词模板以 /模板名 展开。"
            />
            <div className="flex flex-col gap-5">
              {slash.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          </section>
        )}

        {tools.length > 0 && (
          <section className="mb-14">
            <SectionHead
              icon={<Wrench size={17} />}
              kicker="BUILT-IN TOOLS"
              title="内置工具"
              desc="Pi 默认只给模型四个工具，其余按需用 --tools 开启——这正是第 4 章「工具系统」讲的极简工具集设计。"
            />
            <div className="reveal overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
              {tools.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {cli.length > 0 && (
          <section className="mb-14">
            <SectionHead
              icon={<SquareTerminal size={17} />}
              kicker="CLI REFERENCE"
              title="CLI 参数"
              desc="pi [选项] [@文件...] [消息...]——四种运行模式覆盖日常编码、脚本自动化、RPC 集成和 SDK 嵌入。"
            />
            <div className="flex flex-col gap-5">
              {cli.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          </section>
        )}

        {tips.length > 0 && (
          <section className="mb-14">
            <SectionHead
              icon={<PencilLine size={17} />}
              kicker="EDITOR"
              title="编辑器技巧"
              desc="几个容易被忽略但很提效的内置能力。"
            />
            <div className="reveal overflow-hidden rounded-2xl border border-border/70 bg-white shadow-soft">
              {tips.map((item, i) => (
                <ItemRow key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {keys.length > 0 && (
          <section className="mb-14">
            <SectionHead
              icon={<Keyboard size={17} />}
              kicker="KEYBINDINGS"
              title="默认快捷键"
              desc="所有快捷键都可以在 ~/.pi/agent/keybindings.json 里自定义，改完用 /reload 生效，不用重启会话。"
            />
            <div className="flex flex-col gap-5">
              {keys.map((g) => (
                <GroupCard key={g.id} group={g} isKey />
              ))}
            </div>
          </section>
        )}

        <footer className="reveal mt-16 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-soft">
          <p className="text-lg font-bold text-foreground">命令记住了，原理呢？</p>
          <p className="mt-2 text-sm text-muted-foreground">
            /tree、/compact 这些命令背后是会话树和压缩算法——十章指南里有源码级拆解。
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
