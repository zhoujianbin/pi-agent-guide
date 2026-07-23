import { MessageCircle, Sparkles, Video } from "lucide-react";

const channels = [
  {
    src: "./qrcode-wechat.png",
    alt: "微信二维码",
    icon: MessageCircle,
    label: "微信",
    desc: "我的个人微信",
    hint: "扫码加我，一起聊 Agent 工程",
  },
  {
    src: "./qrcode-channels.png",
    alt: "视频号二维码：建斌聊AI",
    icon: Video,
    label: "视频号 · 建斌聊AI",
    desc: "AI Agent 源码拆解短视频",
    hint: "通勤路上也能刷完一章",
  },
];

export function FollowMe() {
  return (
    <section id="follow" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="reveal relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-soft sm:p-12">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

          <div className="relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs text-sky-700">
                <Sparkles size={13} />
                持续更新
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                觉得有收获？
                <br />
                <span className="text-gradient">扫码找我聊聊</span>
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                这个站点来自我逐行读 Pi 源码时记下的笔记。如果你也在做 Agent、
                或者正在啃某个开源项目的源码，欢迎来交流——读源码这件事，
                有人一起聊会走得更远。
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto">
              {channels.map((c) => (
                <div
                  key={c.label}
                  className="glow-cyan flex flex-col items-center gap-2.5 rounded-2xl border border-emerald-200/70 bg-white p-4 shadow-soft"
                >
                  <div className="flex items-center gap-1.5 self-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500 text-white">
                      <c.icon size={12} />
                    </span>
                    <span className="text-sm font-bold text-foreground">{c.label}</span>
                    <span className="text-[11px] text-muted-foreground">{c.desc}</span>
                  </div>
                  <img
                    src={c.src}
                    alt={c.alt}
                    className="h-44 w-44 rounded-xl bg-white object-contain p-1 sm:h-48 sm:w-48"
                  />
                  <p className="font-mono text-[11px] text-muted-foreground">{c.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
