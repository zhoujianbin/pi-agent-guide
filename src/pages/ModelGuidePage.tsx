import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Gift,
  Info,
  Layers3,
  MousePointerClick,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { applyPageMeta } from "@/lib/seo";
import {
  apiPlans,
  ARK_INVITE_CODE,
  ARK_INVITE_URL,
  MODEL_GUIDE_VERIFIED_AT,
  modelPlans,
  type ModelPlan,
} from "@/lib/model-guide";

const TITLE = "国产模型选型指南（含羊毛）：Coding Plan 怎么选 | PI agent学习指南";
const DESCRIPTION =
  "按预算、使用频率和工具习惯选择国产 AI 编程模型：方舟、MiniMax、GLM、Kimi、阿里百炼、DeepSeek 与硅基流动，附官方价格核验、续费避坑和邀请优惠。";

const accentStyles: Record<ModelPlan["accent"], { badge: string; border: string; icon: string }> = {
  emerald: { badge: "bg-emerald-50 text-emerald-700", border: "hover:border-emerald-300", icon: "bg-emerald-500" },
  violet: { badge: "bg-violet-50 text-violet-700", border: "hover:border-violet-300", icon: "bg-violet-500" },
  sky: { badge: "bg-sky-50 text-sky-700", border: "hover:border-sky-300", icon: "bg-sky-500" },
  amber: { badge: "bg-amber-50 text-amber-700", border: "hover:border-amber-300", icon: "bg-amber-500" },
  slate: { badge: "bg-slate-100 text-slate-700", border: "hover:border-slate-300", icon: "bg-slate-600" },
};

function ExternalCTA({ href, children, invited = false, className = "" }: { href: string; children: ReactNode; invited?: boolean; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel={invited ? "sponsored noreferrer" : "noreferrer"}
      className={className}
    >
      {children}
    </a>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="font-mono text-xs font-semibold tracking-[0.18em] text-emerald-600">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

export default function ModelGuidePage() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    applyPageMeta({ title: TITLE, description: DESCRIPTION, path: "/model-guide/" });
    window.scrollTo({ top: 0 });
  }, []);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(ARK_INVITE_CODE);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="model-guide-root" className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-emerald-600">
            <ArrowLeft size={15} />
            返回首页
          </Link>

          <header className="relative mt-7 overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-10 shadow-soft sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <Sparkles size={13} />
                官方信息核验于 {MODEL_GUIDE_VERIFIED_AT}
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
                国产模型选型指南
                <span className="ml-3 inline-flex -translate-y-1 items-center rounded-full bg-amber-400 px-3 py-1 align-middle text-sm font-black text-amber-950 sm:text-base">含羊毛</span>
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
                不追模型跑分，先算你的真实成本。按使用频率、预算和工具习惯，选对 Coding Plan 或按量 API。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#quick-pick" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-soft transition-opacity hover:opacity-90">
                  <MousePointerClick size={17} />
                  30 秒对号入座
                </a>
                <a href="#ark-deal" className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100">
                  <Gift size={17} />
                  先看当前羊毛
                </a>
              </div>
            </div>
          </header>

          <section aria-label="邀请链接说明" className="mt-5 flex gap-3 rounded-2xl border border-border/70 bg-white px-5 py-4 text-xs leading-6 text-muted-foreground">
            <Info size={17} className="mt-0.5 shrink-0 text-sky-500" />
            <p>
              带“邀请优惠”标记的链接为本站邀请链接。你通过链接订阅可能获得额外优惠，本站也可能获得平台奖励，不会因此增加你的费用。推荐同时考虑价格、模型覆盖和工具兼容性，不只按返利排序。
            </p>
          </section>

          <section id="quick-pick" className="scroll-mt-24 py-16 sm:py-20">
            <SectionHeading
              eyebrow="QUICK PICK"
              title="先按使用方式选，不按热度选"
              description="同一个套餐，对高频用户可能很便宜，对偶尔使用的人反而是浪费。先找到最接近你的那一行。"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Layers3 size={21} />, title: "想低成本试多家模型", pick: "先看方舟 Lite", why: "多模型、工具不限，当前入门价低。" },
                { icon: <Zap size={21} />, title: "明确以 GLM 为主力", pick: "先看 GLM Coding Plan", why: "按用量选 Lite / Pro / Max，不必为多模型买单。" },
                { icon: <WalletCards size={21} />, title: "已有 Kimi 会员", pick: "Plus 起用 Kimi Code", why: "Go 不含编程权益，别买错档。" },
                { icon: <ReceiptText size={21} />, title: "用量少或波动很大", pick: "优先按量 API", why: "不为用不完的包月额度付费。" },
              ].map((item) => (
                <article key={item.title} className="rounded-2xl border border-border/70 bg-white p-5 shadow-soft">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{item.icon}</span>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-base font-black text-emerald-600">{item.pick}</p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.why}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="ark-deal" className="scroll-mt-24 pb-16 sm:pb-20">
            <div className="relative overflow-hidden rounded-[2rem] border border-amber-300/80 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 shadow-soft sm:p-9">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-300/30 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950"><Gift size={13} />当前羊毛</span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-800">邀请优惠</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-foreground sm:text-3xl">方舟 Coding Plan：叠加邀请 9.5 折，低至约 9.4 元</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    官方活动页当前限时 9.9 元起，首次订阅通过邀请可再享 9.5 折。支持 GLM-5.3 系列、DeepSeek-V4.1-Flash 1017 版、Doubao-Seed-Evolving 等模型，工具不限，订阅越多越划算。
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-amber-900">
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />Lite 优惠后约 9.4 元起</span>
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />当前 2.5 折活动最多前两个月</span>
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />第三个月起恢复原价</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-white/90 p-5 shadow-soft">
                  <p className="text-xs font-semibold text-muted-foreground">首次订阅邀请码</p>
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-4 py-3">
                    <code className="font-mono text-xl font-black tracking-wider text-amber-800">{ARK_INVITE_CODE}</code>
                    <button
                      type="button"
                      onClick={copyInviteCode}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
                      aria-live="polite"
                    >
                      {copyState === "copied" ? <Check size={14} /> : <Copy size={14} />}
                      {copyState === "copied" ? "已复制" : copyState === "failed" ? "请手动复制" : "复制邀请码"}
                    </button>
                  </div>
                  <ExternalCTA
                    href={ARK_INVITE_URL}
                    invited
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-black text-white shadow-soft transition-colors hover:bg-amber-600"
                  >
                    立即订阅方舟 Coding Plan
                    <ArrowUpRight size={17} />
                  </ExternalCTA>
                  <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">优惠资格、名额与实付金额以订购页为准</p>
                </div>
              </div>
            </div>
          </section>

          <section id="plans" className="scroll-mt-24 pb-16 sm:pb-20">
            <SectionHeading
              eyebrow="SUBSCRIPTION PLANS"
              title="包月与订阅方案详细对比"
              description="重点看续费价格、额度口径和工具限制。首月低价适合试用，但长期成本要看恢复原价之后。"
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {modelPlans.map((plan) => {
                const accent = accentStyles[plan.accent];
                return (
                  <article key={plan.id} className={`flex flex-col rounded-3xl border border-border/70 bg-white p-6 shadow-soft transition-colors sm:p-7 ${accent.border}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${accent.badge}`}>{plan.badge}</span>
                      {plan.invited && <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700"><BadgePercent size={14} />邀请优惠</span>}
                    </div>
                    <h3 className="mt-4 text-xl font-black text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-black text-emerald-600">{plan.price}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.description}</p>
                    <ul className="mt-4 space-y-2">
                      {plan.models.map((model) => (
                        <li key={model} className="flex items-start gap-2 text-sm text-foreground/85">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                          {model}
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-5 space-y-3 rounded-2xl bg-secondary/45 p-4 text-xs leading-6">
                      <div><dt className="font-bold text-foreground">适合谁</dt><dd className="text-muted-foreground">{plan.fit}</dd></div>
                      {plan.renewal && <div><dt className="font-bold text-foreground">价格与续费</dt><dd className="text-muted-foreground">{plan.renewal}</dd></div>}
                      <div><dt className="font-bold text-foreground">注意</dt><dd className="text-muted-foreground">{plan.note}</dd></div>
                    </dl>
                    <ExternalCTA
                      href={plan.url}
                      invited={plan.invited}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      {plan.cta}
                      <ArrowUpRight size={16} />
                    </ExternalCTA>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="api" className="scroll-mt-24 pb-16 sm:pb-20">
            <SectionHeading
              eyebrow="PAY AS YOU GO"
              title="用量不稳定，按量 API 可能更合适"
              description="API 适合低频使用、自己开发应用或需要跨模型实验的人；包月 Coding Plan 则主要面向交互式编程工具，两者额度和用途不能混为一谈。"
            />
            <div className="grid gap-5 md:grid-cols-2">
              {apiPlans.map((plan) => (
                <article key={plan.name} className="rounded-3xl border border-border/70 bg-white p-6 shadow-soft sm:p-7">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">{plan.badge}</span>
                  <h3 className="mt-4 text-xl font-black text-foreground">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{plan.description}</p>
                  <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900"><strong>注意：</strong>{plan.note}</p>
                  <ExternalCTA href={plan.url} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    {plan.cta}<ExternalLink size={15} />
                  </ExternalCTA>
                </article>
              ))}
            </div>
          </section>

          <section id="checklist" className="scroll-mt-24 rounded-[2rem] border border-border/70 bg-slate-900 p-6 text-white sm:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck size={25} className="text-emerald-400" />
              <h2 className="text-2xl font-black">付款前的 5 项检查</h2>
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {[
                "看续费价，不只看首月价",
                "看额度按请求、积分还是 token 计算",
                "确认是否限交互式编程工具",
                "确认滚动窗口、周限额与月度总限额",
                "先小额试用，再决定包季或包年",
              ].map((item, index) => (
                <li key={item} className="rounded-2xl bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  <span className="font-mono text-xs font-bold text-emerald-400">0{index + 1}</span>
                  <p className="mt-2">{item}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-6 text-slate-400">
              本页不是模型性能排名，也未对每个账号进行调用测试。模型、活动、额度与价格会调整，请在付款前以对应官方页面为最终依据。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
