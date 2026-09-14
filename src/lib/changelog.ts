/**
 * 版本雷达数据：Pi（earendil-works/pi）官方 release notes 的中文精选解读。
 * 来源：https://github.com/earendil-works/pi/releases
 * 每条变更标注对应的指南章节（chapters），或归为 TUI / 扩展 / Provider / 工程 四类。
 * 由每周定时任务检查新版本并增补（见 CHANGELOG_UPDATED）。
 */

export interface ChangelogItem {
  /** 中文一句话解读 */
  text: string;
  /** 对应的指南章节号（1-10），可多个 */
  chapters?: number[];
  /** 非章节归类标签 */
  tag?: "TUI" | "扩展" | "Provider" | "工程" | "安全";
  /** 不兼容变更标记 */
  breaking?: boolean;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  /** 这个版本的一句话主线 */
  headline: string;
  items: ChangelogItem[];
}

export const CHANGELOG_UPDATED = "2026-09-14";
export const CHANGELOG_SOURCE = "https://github.com/earendil-works/pi/releases";

export const changelogVersions: ChangelogVersion[] = [
  {
    version: "v0.85",
    date: "2026-09-04",
    headline: "GPT-6 Astra 上线、Claude thinking 力度跨轮保持、SDK 能恢复外部存储的内存会话",
    items: [
      {
        text: "GPT-6 Astra 模型上线：OpenAI API key 和 OpenAI Codex 订阅都能直接用（v0.85.1）",
        chapters: [4],
        tag: "Provider",
      },
      {
        text: "持久化 Claude thinking effort：支持的 Anthropic 传输层会保留每轮 effort，并从签名 thinking 不匹配中安全恢复——thinking 设置不再「一轮就丢」",
        chapters: [4],
      },
      {
        text: "SessionManager.inMemory() 支持恢复外部管理的会话条目——SDK 场景下内存会话也能「断点续传」",
        chapters: [10],
      },
      {
        text: "全屏转录新增「跳到最新消息」按钮，工作指示器内嵌进编辑器边框并跟随 thinking 级别配色；Alt+滚轮五倍速滚动（v0.85.1）",
        tag: "TUI",
      },
      {
        text: "修复 0.85.0 误发布内部实验代码导致的 SDK 导入失败：client 与 experimental/plugin 子路径改为仅源码提供，受支持的本地 SDK 与 stdio RPC API 不变（v0.85.1）",
        tag: "工程",
      },
      {
        text: "GPT-5.6+ Responses 模型的长 prompt 缓存改用 prompt_cache_options.ttl: \"30m\"，替代不再适用的 24h 保留字段（v0.85.1）",
        chapters: [8],
      },
    ],
  },
  {
    version: "v0.84",
    date: "2026-08-06",
    headline: "全屏 TUI、远程会话客户端、Markdown 显示变换——Pi 开始把「界面」和「接入方式」都开放出来",
    items: [
      {
        text: "实验性全屏 TUI 模式（--tui-mode fullscreen）：粘性编辑器、状态栏与 widget 停靠、可拖动滚动条，转录区独立滚动",
        tag: "TUI",
      },
      {
        text: "实验性远程会话客户端 API：传输中立的 PiClient、CBOR 协议、Unix-socket 传输，以及带转录 reducer 的 RemoteSession 控制器——可以把 Pi 的会话接到自己的前端上",
        chapters: [7, 10],
      },
      {
        text: "registerMarkdownTransformer() 钩子：对用户和助手的 Markdown 做「仅显示」转换，可链式注册——显示层与消息层分离的典型应用",
        chapters: [6],
        tag: "扩展",
      },
      {
        text: "Mermaid 图表的 Unicode 终端渲染，交互式消息里也能画图（含流式渲染）",
        tag: "TUI",
      },
      {
        text: "pi auth check 认证预检：验证 Provider 凭据是否可用；Qwen Token Plan Individual 成为内置 Provider（v0.84.1）",
        chapters: [4],
        tag: "Provider",
      },
      {
        text: "扩展的 tool_call 事件支持 terminate：拦截工具调用后可以直接终止整批，不再多发一次模型请求（v0.84.1）",
        chapters: [5],
        tag: "扩展",
      },
      {
        text: "defaultTools 设置：全局或按项目配置启动时加载的内置工具集（v0.84.2）；Windows 新增可选原生 PowerShell 工具（v0.84.3）",
        chapters: [5],
      },
      {
        text: "/thinking 选择器上线，模型与 thinking 选择默认只在当前会话生效，Ctrl+S 才显式保存为全局默认——告别「选一次就改了全局配置」（v0.84.3）",
        chapters: [4],
        tag: "TUI",
      },
      {
        text: "session_compact_failed 扩展事件：压缩失败与中止暴露原因、重试状态和错误信息；大工具结果越过阈值时改为同一轮内「先执行工具、再压缩、再继续」（v0.84.3 / v0.84.4）",
        chapters: [9],
        tag: "扩展",
      },
      {
        text: "RPC clear_queue 可取回并清空排队的 steering / follow-up 消息；ui_prompt_start / ui_prompt_end 事件让宿主区分「agent 在干活」和「在等用户输入」（v0.84.4）",
        chapters: [7],
      },
      {
        text: "GoogleThinkingLevel 类型更名为 GoogleApiThinkingLevel，新增 ResolvedGoogleThinkingLevel——写 Google 相关扩展的需要改名（v0.84.3）",
        tag: "扩展",
        breaking: true,
      },
    ],
  },
  {
    version: "v0.83",
    date: "2026-07-29",
    headline: "凭据导出与无头登录，stop reason 开始「说真话」",
    items: [
      {
        text: "pi auth print-api-key / print-bearer-token：把配置好的凭据导出给外部客户端用，OAuth 自动刷新、可设最小有效期",
        chapters: [4],
      },
      {
        text: "无头环境 OpenRouter 登录：SSH 场景下粘贴重定向 URL 或授权码即可完成 /login",
        tag: "Provider",
      },
      {
        text: "原始 stop reason 透传：Google / Anthropic / Bedrock / Mistral / OpenAI 的终止原因不再被抹平，未映射的终止原因会上报为 Provider 错误而不是假装成功——容错设计的重要一课",
        chapters: [6, 7],
      },
      {
        text: "新增 \"pending\" stop reason 表示流式消息只到了一部分，自定义 Provider 可以表达「还没完」",
        chapters: [7],
      },
      {
        text: "TypeBox 升级到 1.3.7，移除多个废弃 API——写扩展时用到旧 API 的需要迁移",
        tag: "扩展",
        breaking: true,
      },
    ],
  },
  {
    version: "v0.82",
    date: "2026-07-24",
    headline: "约束采样让工具调用更可靠，OAuth 登录进入 /login",
    items: [
      {
        text: "约束工具采样（Constrained Sampling）：工具可以要求严格 JSON Schema 输出或用语法约束生成，模型能力元数据自动拦截不支持的请求——「工具用严格 schema」从建议变成机制",
        chapters: [5],
      },
      {
        text: "OpenRouter 和 Kimi Code 订阅支持 /login OAuth 授权，不用再手动配 API key",
        tag: "Provider",
      },
      {
        text: "bash 工具获得会话环境变量（PI_SESSION_ID / PI_PROVIDER / PI_MODEL 等），RPC 的 bash 命令支持流式输出事件",
        chapters: [5, 7],
      },
      {
        text: "DNS 解析失败（ENOTFOUND / EAI_AGAIN）现在会触发自动重试——瞬时网络故障不再直接打断对话",
        chapters: [7],
      },
    ],
  },
  {
    version: "v0.81",
    date: "2026-07-21",
    headline: "压缩学会「弹性」：Provider 抖动时按策略重试，全过程可观测",
    items: [
      {
        text: "弹性压缩与分支摘要：压缩时遇到 Provider 临时故障会按配置的重试策略重试，重试生命周期事件暴露给交互界面、JSON、RPC 和 SDK——第 9 章压缩算法的生产化续集",
        chapters: [9],
      },
      {
        text: "pi-ai 新增 retryAssistantCall()：对瞬时 assistant 故障做有界重试，带生命周期回调和 abort 处理",
        chapters: [7],
      },
      {
        text: "GitHub Releases 附带确定性、带校验和的源码归档，可独立重建二进制",
        tag: "工程",
      },
      {
        text: "修复 Kimi K3 模型：使用 OpenAI thinking 格式并支持 reasoning effort",
        tag: "Provider",
      },
    ],
  },
  {
    version: "v0.80",
    date: "2026-06-23",
    headline: "max thinking 级别、长上下文精确定价，pi-ai 旧 API 迁移到 compat（持续一个月的密集修补）",
    items: [
      {
        text: "新增 max thinking 级别（在 xhigh 之上），GPT-5.6 与 adaptive Claude 模型原生支持",
        chapters: [4],
      },
      {
        text: "基于输入量的定价阶梯：长上下文请求按阶梯精确计费，自定义模型也可配置——成本核算进入「看得见的成本」时代",
        chapters: [8],
      },
      {
        text: "pi-ai 旧全局 API（stream / complete / getModel…）移至 /compat 入口，新代码应使用 createModels() / Provider-factory",
        chapters: [2],
        breaking: true,
      },
      {
        text: "选择性 Provider 入口：pi-ai/base + pi-agent-core/base，打包应用只带用到的 Provider 传输层",
        chapters: [2],
      },
      {
        text: "压缩后 token 估算数随压缩结果和事件返回，客户端可以展示「压掉了多少」",
        chapters: [9],
      },
      {
        text: "导出 InMemorySessionStorage / JsonlSessionStorage，会话存储层正式成为可编程接口；会话条目 ID 改用 uuidv7 随机尾部",
        chapters: [10],
      },
      {
        text: "修复压缩摘要请求串行化（避免单并发 Provider 收到重叠请求）、compact 后输出预算忽略过期用量等一系列第 9 章相关的边界修复",
        chapters: [9],
      },
    ],
  },
  {
    version: "v0.79",
    date: "2026-06-08",
    headline: "项目信任机制上线：加载项目本地配置前先问你一句",
    items: [
      {
        text: "项目信任保护：加载项目本地的设置、资源、指令和包之前会请求确认，支持记住决定和 --approve / --no-approve 非交互控制——prompt 注入防线前移到了启动时刻",
        tag: "安全",
      },
      {
        text: "project_trust 扩展事件：扩展可以接管信任决策（决定 / 记住 / 推迟）",
        tag: "扩展",
      },
      {
        text: "页脚显示最近一次请求的 prompt 缓存命中率（CH）——缓存效果第一次「看得见」",
        chapters: [8],
      },
      {
        text: "压缩摘要的系统提示词改为中立措辞，非编码类 agent 复用压缩器时不再被「编程助手」人设带偏",
        chapters: [9],
      },
    ],
  },
  {
    version: "v0.78",
    date: "2026-05-29",
    headline: "命名会话、可点击文件链接，扩展能感知自己运行在什么模式里",
    items: [
      {
        text: "命名启动会话：--name / -n 在交互、print、JSON、RPC 各模式下都能启动前指定会话显示名",
        chapters: [10],
      },
      {
        text: "内置文件工具的路径渲染为 OSC 8 file:// 超链接，终端里直接点开（含 tmux）",
        chapters: [5],
        tag: "TUI",
      },
      {
        text: "扩展上下文新增 ctx.mode 与 ctx.getSystemPromptOptions()：扩展可以区分自己跑在 TUI / RPC / JSON / print 哪种模式，并检查基础系统提示词输入",
        tag: "扩展",
      },
      {
        text: "新增容器化文档与 Gondolin 示例：把内置工具路由进本地 micro-VM 执行",
        tag: "安全",
      },
    ],
  },
  {
    version: "v0.77",
    date: "2026-05-28",
    headline: "工具可以按名单禁用，输入事件能区分「排队」和「插队」",
    items: [
      {
        text: "--exclude-tools / -xt：按名字禁用指定内置、扩展或自定义工具，其余照常——最小权限原则落到 CLI 参数上",
        chapters: [5],
      },
      {
        text: "扩展输入事件新增 streamingBehavior：区分空闲输入、流式中途的「插队」指令和排队 follow-up——第 7 章事件流的粒度再细一档",
        chapters: [7],
        tag: "扩展",
      },
      {
        text: "SIGTERM/SIGHUP 退出时先触发 session_shutdown 让扩展清理资源（如 socket），终端再关闭——优雅停机不再是可选项",
        chapters: [7],
      },
      {
        text: "Claude Opus 4.8 模型元数据与 adaptive-thinking 覆盖更新",
        tag: "Provider",
      },
    ],
  },
  {
    version: "v0.76",
    date: "2026-05-27",
    headline: "会话 ID 可以显式指定，bash 输出可以不进上下文",
    items: [
      {
        text: "--session-id <id>：脚本可以精确创建或恢复某个项目本地会话——自动化场景的基础能力",
        chapters: [10],
      },
      {
        text: "RPC bash 命令支持 excludeFromContext：命令执行了，但输出不随下一条 prompt 发给模型——上下文精打细算的又一工具",
        chapters: [8],
      },
      {
        text: "Provider 重试与超时全面可控：retry.provider.maxRetries 显式生效，Codex WebSocket/SSE 等待都有界",
        chapters: [7],
      },
      {
        text: "修复图片附件的 token 估算与用户消息、工具结果不一致的问题",
        chapters: [8],
      },
    ],
  },
  {
    version: "v0.75",
    date: "2026-05-17",
    headline: "启动时自动检查更新，扩展宿主预编译提速",
    items: [
      {
        text: "启动时自动检查新版本并提示，不必再手动 pi update",
        tag: "工程",
      },
      {
        text: "扩展宿主构建期预编译，消除 jiti 导入开销，扩展加载更快",
        tag: "扩展",
      },
      {
        text: "修复 /compact 对默认压缩提示的处理",
        chapters: [9],
      },
    ],
  },
  {
    version: "v0.74",
    date: "2026-05-07",
    headline: "包作用域迁移到 @earendil-works，Codex 有了 WebSocket 长连接",
    items: [
      {
        text: "包作用域从 @mariozechner 迁移到 @earendil-works——本指南所有包名均以新作用域为准",
        chapters: [2],
        breaking: true,
      },
      {
        text: "OpenAI Codex WebSocket 传输（websocket-cached）：ChatGPT Plus/Pro 用户保持长连接，后续请求更快",
        chapters: [4, 7],
      },
      {
        text: "Anthropic 模型支持扩展 thinking 级别 high / xhigh",
        chapters: [4],
      },
      {
        text: "ChatGPT Pro 用户新增 o3 / o4-mini",
        tag: "Provider",
      },
    ],
  },
  {
    version: "v0.73",
    date: "2026-05-04",
    headline: "自更新支持包名迁移，models.json 接受注释和尾逗号",
    items: [
      {
        text: "pi update --self 支持跨包名自更新：自动卸载旧的全局包并安装新作用域的包",
        tag: "工程",
      },
      {
        text: "OAuth Provider 可以在 /login 里呈现多个登录选项，交互式认证流程成形",
        tag: "Provider",
      },
      {
        text: "models.json 支持 JSONC 风格解析（注释 + 尾逗号），自定义 Provider 配置更好维护",
        chapters: [4],
      },
    ],
  },
];

/** 章节号 → 短名（与 content/chapters 一致） */
export const CHAPTER_SHORT: Record<number, string> = {
  1: "总览",
  2: "三层架构",
  3: "Agent Loop",
  4: "模型调用",
  5: "工具系统",
  6: "消息系统",
  7: "事件驱动",
  8: "上下文工程",
  9: "上下文压缩",
  10: "会话管理",
};

/** 拍平供全站搜索索引 */
export function flattenChangelog() {
  return changelogVersions.flatMap((v) =>
    v.items.map((item) => ({
      title: item.text.slice(0, 40),
      crumb: `版本雷达 · ${v.version}`,
      text: `${v.version} ${v.headline} ${item.text}`.toLowerCase(),
      to: "/changelog/",
    })),
  );
}
