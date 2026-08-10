/**
 * Pi 生态精选数据：从官方包注册表 pi.dev/packages 精选的社区包。
 * 下载量为 2026-08-10 编辑时的 npm 月下载快照，仅作量级参考；
 * 最新数据以 https://pi.dev/packages 为准。
 */

export type EcoType = "extension" | "skill" | "package";

export interface EcoPackage {
  /** npm 包名，也是 pi install npm:<name> 的安装名 */
  name: string;
  /** 中文一句话简介 */
  desc: string;
  type: EcoType;
  /** 月下载量快照（约数，单位 K/月）；新包暂无数据则为 null */
  downloadsK: number | null;
  /** 推荐理由（可选，比 desc 更进一步的点评） */
  why?: string;
}

export interface EcoCategory {
  id: string;
  title: string;
  /** 品类导语：为什么需要这类包 */
  intro: string;
  packages: EcoPackage[];
}

export const ECO_SNAPSHOT_DATE = "2026-08-10";
export const ECO_REGISTRY_URL = "https://pi.dev/packages";

export const ecoCategories: EcoCategory[] = [
  {
    id: "eco-agents",
    title: "多智能体与工作流",
    intro:
      "Pi 官方刻意不内置子代理——「做法有很多种，留给生态」。于是社区最热闹的品类就是这个：单代理委派、多代理编排、自治目标循环，各取所需。",
    packages: [
      {
        name: "pi-subagents",
        desc: "单代理委派 + 脚本化多代理工作流，生态里下载量最高的子代理方案",
        type: "package",
        downloadsK: 210.9,
        why: "想体验「Claude Code 那种子代理」又不想去读源码，先装它",
      },
      {
        name: "@tintinweb/pi-subagents",
        desc: "Claude Code 风格的自治子代理，带智能任务分派",
        type: "extension",
        downloadsK: 41.5,
      },
      {
        name: "@quintinshaw/pi-dynamic-workflows",
        desc: "把任务扇出给上百个子代理：模型路由、成本核算、断点续跑、git worktree 隔离，自带 /workflows 面板和 /deep-research",
        type: "package",
        downloadsK: 30.9,
        why: "重型编排玩家之选，功能密度极高",
      },
      {
        name: "@narumitw/pi-goal",
        desc: "自治目标模式：给一个 /goal，agent 自己排队执行直到完成",
        type: "extension",
        downloadsK: 30.2,
      },
    ],
  },
  {
    id: "eco-memory",
    title: "记忆与上下文",
    intro:
      "第 9 章讲过 Pi 的压缩算法是「摘要式」的。想要跨会话的长期记忆、语义搜索、上下文瘦身，生态给出了多条路线。",
    packages: [
      {
        name: "context-mode",
        desc: "号称节省 98% 上下文窗口：沙箱执行 + FTS5 知识库 + 意图驱动检索，同时兼容 Claude Code、Codex 等",
        type: "package",
        downloadsK: 74.2,
      },
      {
        name: "@remnic/plugin-pi",
        desc: "Remnic 记忆扩展，让 Pi 跨会话记住你的偏好和项目背景",
        type: "package",
        downloadsK: 29.4,
      },
      {
        name: "pi-hermes-memory",
        desc: "持久记忆 + 会话全文搜索（SQLite FTS5）+ 密钥扫描，732 个测试护航",
        type: "extension",
        downloadsK: 22.3,
        why: "工程完成度很高，把记忆、搜索、安全三件事一次做齐",
      },
      {
        name: "pi-memory",
        desc: "qmd 语义搜索驱动的记忆扩展：日报、长期记忆、草稿本三层结构",
        type: "package",
        downloadsK: 18.2,
      },
      {
        name: "@hypabolic/pi-hypa",
        desc: "把嘈杂的工具输出挡在上下文之外：shell 命令自动改写压缩，证据可回溯",
        type: "package",
        downloadsK: 14.7,
      },
    ],
  },
  {
    id: "eco-plan",
    title: "计划与人机协作",
    intro:
      "官方态度是「计划写进 PLAN.md 文件就行」，但很多人就想要一个看得见、能批注的计划界面——下面这些包补上了这块。",
    packages: [
      {
        name: "@juicesharp/rpiv-ask-user-question",
        desc: "模型不确定时弹出结构化问卷让你点选，而不是自由发挥瞎猜",
        type: "extension",
        downloadsK: 51.6,
        why: "小改动大体验：把「澄清问题」从打字变成点选",
      },
      {
        name: "@juicesharp/rpiv-todo",
        desc: "给模型一个待办清单，以悬浮层实时渲染，/reload 和压缩后依然存活",
        type: "extension",
        downloadsK: 42.2,
      },
      {
        name: "@plannotator/pi-extension",
        desc: "交互式计划评审：在 agent 的计划和代码上做批注，逐条确认或打回",
        type: "package",
        downloadsK: 38.3,
      },
      {
        name: "@narumitw/pi-plan-mode",
        desc: "Codex 风格的只读 /plan 协作模式：先讨论方案，确认后再动手",
        type: "extension",
        downloadsK: 16.9,
      },
    ],
  },
  {
    id: "eco-quality",
    title: "代码质量与编辑",
    intro: "让 agent 写完代码后能自我检查、精确修改，而不是「看起来差不多」。",
    packages: [
      {
        name: "pi-lens",
        desc: "实时代码反馈：LSP、linter、格式化、类型检查、结构分析一次接入",
        type: "extension",
        downloadsK: 41.6,
      },
      {
        name: "pi-simplify",
        desc: "自动审查最近改动的代码，专挑清晰度、一致性、可维护性问题",
        type: "extension",
        downloadsK: 31.3,
      },
      {
        name: "@ff-labs/pi-fff",
        desc: "FFF 驱动的模糊文件与内容搜索，大仓库里找东西明显更快",
        type: "extension",
        downloadsK: 31,
      },
      {
        name: "pi-hashline-edit-pro",
        desc: "哈希锚定的行级读写撤销工具：每行一个稳定 3 字符锚点，杜绝模糊误改",
        type: "extension",
        downloadsK: 15.7,
        why: "直接回应了「edit 工具模糊匹配改错行」这个真实痛点",
      },
    ],
  },
  {
    id: "eco-security",
    title: "安全与权限",
    intro:
      "Pi 默认以你的用户权限运行、没有内置沙箱（第 1 章就强调过）。认真用在生产环境的话，这一类值得先看。",
    packages: [
      {
        name: "@vigolium/piolium",
        desc: "多阶段安全审计：专家子代理分头查、隔离上下文、并发受限、可断点续审",
        type: "extension",
        downloadsK: 79.6,
        why: "目前生态下载量第一的安全类包",
      },
      {
        name: "@gotgenes/pi-permission-system",
        desc: "给 Pi 补上权限强制层：哪些工具能用、碰哪些路径，规则化管控",
        type: "extension",
        downloadsK: 31,
      },
      {
        name: "pi-landstrip",
        desc: "沙箱化 Bash 与进程级隔离的 agent 执行环境",
        type: "extension",
        downloadsK: 14.7,
      },
    ],
  },
  {
    id: "eco-connect",
    title: "联网与外部集成",
    intro: "搜索、网页、浏览器、MCP、IM——把 Pi 接到外部世界的各种插头。",
    packages: [
      {
        name: "pi-web-access",
        desc: "联网全家桶：网页搜索、URL 抓取、克隆 GitHub 仓库、PDF 提取、YouTube 视频理解，支持十余家搜索 API",
        type: "extension",
        downloadsK: 222,
        why: "全生态下载量第一，联网能力基本一包搞定",
      },
      {
        name: "pi-mcp-adapter",
        desc: "MCP 适配器：官方不内置 MCP，想用 MCP 服务器就装它",
        type: "extension",
        downloadsK: 54.4,
      },
      {
        name: "@llblab/pi-telegram",
        desc: "Telegram 运行时适配器，把 Pi 变成电报里的机器人",
        type: "extension",
        downloadsK: 14.3,
      },
      {
        name: "pi-agent-browser-native",
        desc: "把 agent-browser 暴露为原生工具，给 Pi 加上浏览器自动化",
        type: "extension",
        downloadsK: 13.8,
      },
      {
        name: "pi-zhihu-search",
        desc: "中文社区作品：知乎站内搜索 + 知乎直答 + 全网搜索 + 热榜四个技能一包集成，零第三方依赖",
        type: "skill",
        downloadsK: null,
        why: "难得的中文社区包，skill 写法是很好的学习样本",
      },
    ],
  },
  {
    id: "eco-skills",
    title: "技能包与方法论",
    intro:
      "技能是「给模型看的指令包」，第 10 章讲过渐进式披露的原理。这几个包等于把别人多年的工程方法论直接装进你的 agent。",
    packages: [
      {
        name: "@dietrichgebert/ponytail",
        desc: "「懒人资深工程师」模式：最好的代码是没写的代码，先质疑需求再动手",
        type: "skill",
        downloadsK: 40.2,
      },
      {
        name: "bigpowers",
        desc: "73 个 agent 技能，把 17 年软件工程纪律压成一套独立开发者方法论",
        type: "skill",
        downloadsK: 15.4,
        why: "技能数量之王，适合拆开研读写法",
      },
      {
        name: "gentle-pi",
        desc: "把 Pi 变成「绅士架构师」：SDD/OpenSpec 规范驱动 + 严格 TDD + 评审护栏",
        type: "package",
        downloadsK: 13.9,
      },
    ],
  },
  {
    id: "eco-observe",
    title: "观测与界面",
    intro: "看清 agent 在干什么、花了多少钱，顺便让终端更好看。",
    packages: [
      {
        name: "@raindrop-ai/pi-agent",
        desc: "Raindrop 可观测性：自动追踪会话、轮次、LLM 调用和工具执行",
        type: "package",
        downloadsK: 25,
      },
      {
        name: "@braintrust/pi-extension",
        desc: "Braintrust 追踪扩展：会话/轮次/LLM 调用/工具执行全量上报",
        type: "package",
        downloadsK: 18.2,
      },
      {
        name: "pi-powerline-footer",
        desc: "Powerline 风格状态栏，终端颜值即战力",
        type: "extension",
        downloadsK: 16.9,
      },
    ],
  },
];

export const ECO_TYPE_META: Record<EcoType, { label: string; cls: string }> = {
  extension: { label: "扩展", cls: "border-emerald-200/70 bg-emerald-50 text-emerald-700" },
  skill: { label: "技能", cls: "border-sky-200/70 bg-sky-50 text-sky-700" },
  package: { label: "组合包", cls: "border-violet-200/70 bg-violet-50 text-violet-700" },
};

/** 供全站搜索索引使用的扁平化条目 */
export function flattenEcosystem(): { key: string; desc: string; group: string }[] {
  const out: { key: string; desc: string; group: string }[] = [];
  for (const cat of ecoCategories) {
    for (const p of cat.packages) {
      out.push({ key: p.name, desc: p.desc, group: `生态精选 · ${cat.title}` });
    }
  }
  return out;
}
