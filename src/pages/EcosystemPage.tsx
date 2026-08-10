import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Check, Copy, ExternalLink, Filter, Package, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { applyPageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/useReveal";
import {
  ecoCategories,
  ECO_TYPE_META,
  ECO_SNAPSHOT_DATE,
  ECO_REGISTRY_URL,
  type EcoPackage,
} from "@/lib/ecosystem";

export const ECOSYSTEM_TITLE = "Pi 生态精选：值得装的社区扩展与技能包 | PI agent学习指南";
export const ECOSYSTEM_DESCRIPTION =
  "从 Pi 官方包注册表（5300+ 社区包）精选的中文导购：子代理与工作流、记忆与上下文、计划协作、代码质量、安全权限、联网集成、技能方法论与可观测性，每个包附一句话简介与一行安装命令。";

function CopyInstall({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  const cmd = `pi install npm:${name}`;
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* 剪贴板不可用时静默 */
        }
      }}
      className="group/cmd mt-3 flex w-full items-center gap-2 rounded-lg border border-border/60 bg-slate-50 px-3 py-2 text-left font-mono text-xs text-slate-600 transition-colors hover:border-emerald-300"
      aria-label={`复制安装命令 ${cmd}`}
    >
      <span className="truncate">$ {cmd}</span>
      {copied ? (
        <Check size={13} className="ml-auto shrink-0 text-emerald-500" />
      ) : (
        <Copy size={13} className="ml-auto shrink-0 text-muted-foreground/50 transition-colors group-hover/cmd:text-emerald-500" />
      )}
    </button>
  );
}

function PackageCard({ pkg }: { pkg: EcoPackage }) {
  const meta = ECO_TYPE_META[pkg.type];
  return (
    <article className="gradient-border flex flex-col rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${meta.cls}`}
        >
          {meta.label}
        </span>
        {pkg.downloadsK !== null && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/70">
            <TrendingUp size={11} />
            约 {pkg.downloadsK >= 100 ? `${Math.round(pkg.downloadsK)}K` : `${pkg.downloadsK}K`}/月
          </span>
        )}
        {pkg.downloadsK === null && (
          <span className="ml-auto font-mono text-[11px] text-muted-foreground/50">新包</span>
        )}
      </div>
      <h3 className="mt-2.5 break-all font-mono text-sm font-bold text-foreground">{pkg.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{pkg.desc}</p>
      {pkg.why && (
        <p className="mt-2 border-l-2 border-emerald-300 pl-2.5 text-xs leading-relaxed text-emerald-700/90">
          {pkg.why}
        </p>
      )}
      <CopyInstall name={pkg.name} />
    </article>
  );
}

function SectionHead({ icon, title, intro }: { icon: ReactNode; title: string; intro: string }) {
  return (
    <div className="reveal mb-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-soft">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{intro}</p>
    </div>
  );
}

export default function EcosystemPage() {
  const ref = useReveal<HTMLDivElement>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    applyPageMeta({ title: ECOSYSTEM_TITLE, description: ECOSYSTEM_DESCRIPTION, path: "/ecosystem/" });
    window.scrollTo({ top: 0 });
  }, []);

  const q = query.trim().toLowerCase();
  const cats = useMemo(() => {
    if (!q) return ecoCategories;
    return ecoCategories
      .map((c) => ({
        ...c,
        packages: c.packages.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q) ||
            (p.why ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.packages.length > 0);
  }, [q]);

  const total = ecoCategories.reduce((n, c) => n + c.packages.length, 0);

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main id="ecosystem-root" className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
        <header className="reveal mb-10 text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-600">ECOSYSTEM PICKS</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Pi <span className="text-gradient">生态精选</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Pi 官方哲学是「内核最小，能力靠装」——官方包注册表已有 5300+ 个社区包。
            这里按品类精选 {total} 个值得先看一眼的，翻译成中文一句话，附一行安装命令。
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-muted-foreground/70">
            下载量为 {ECO_SNAPSHOT_DATE} 的 npm 月下载快照，仅作量级参考；最新数据以{" "}
            <a
              href={ECO_REGISTRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              pi.dev/packages
            </a>{" "}
            为准。
          </p>

          <div className="relative mx-auto mt-7 max-w-md">
            <Filter
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="筛选包名或简介，如 memory、子代理、安全…"
              className="w-full rounded-full border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm shadow-soft outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-emerald-300"
            />
          </div>
        </header>

        {cats.length === 0 && (
          <p className="reveal rounded-2xl border border-border/70 bg-white py-10 text-center text-sm text-muted-foreground shadow-soft">
            没有匹配「{query}」的包，换个关键词试试。
          </p>
        )}

        {cats.map((cat) => (
          <section key={cat.id} className="mb-14">
            <SectionHead icon={<Package size={17} />} title={cat.title} intro={cat.intro} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.packages.map((p) => (
                <PackageCard key={p.name} pkg={p} />
              ))}
            </div>
          </section>
        ))}

        <footer className="reveal mt-16 rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 text-center shadow-soft">
          <p className="text-lg font-bold text-foreground">这些包装上去为什么就能用？</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            扩展、技能、提示词模板背后是同一套「事件 + 注册」机制——第 6
            章事件系统和第 10 章会话管理里有源码级拆解，读完你就能自己写一个上架。
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/chapter/6/"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              读第 6 章：事件驱动
              <ArrowRight size={14} />
            </Link>
            <a
              href={ECO_REGISTRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-white px-5 py-2.5 text-sm font-semibold text-muted-foreground shadow-soft transition-colors hover:border-emerald-300 hover:text-emerald-600"
            >
              逛完整注册表
              <ExternalLink size={13} />
            </a>
          </div>
        </footer>
      </main>
      <Footer />
    </div>
  );
}
