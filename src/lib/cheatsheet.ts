/**
 * Pi 速查表数据：斜杠命令 / CLI 参数 / 编辑器技巧 / 快捷键。
 * 内容依据官方文档整理：
 *   - packages/coding-agent/docs/usage.md（斜杠命令、CLI 参考、编辑器特性、消息队列）
 *   - packages/coding-agent/docs/keybindings.md（默认快捷键）
 * 官方文档更新后请同步此处。
 */

export interface CheatItem {
  /** 命令、参数或按键，如 "/compact [提示]"、"-p, --print"、"Ctrl+P" */
  key: string;
  /** 中文说明 */
  desc: string;
  /** 可选补充说明（灰色小字） */
  note?: string;
}

export interface CheatGroup {
  id: string;
  title: string;
  items: CheatItem[];
}

/* ---------------- 斜杠命令 ---------------- */

export const slashGroups: CheatGroup[] = [
  {
    id: "slash-session",
    title: "会话管理",
    items: [
      { key: "/new", desc: "开一个新会话" },
      { key: "/resume", desc: "从历史会话里选一个继续" },
      { key: "/name <名称>", desc: "给当前会话起显示名，方便日后查找" },
      { key: "/session", desc: "查看会话文件、ID、消息数、Token 用量和花费" },
      { key: "/tree", desc: "打开会话树视图，跳到任意历史节点继续", note: "从中间节点继续会产生新分支，原分支保留" },
      { key: "/fork", desc: "从某条更早的用户消息分叉出一个新会话" },
      { key: "/clone", desc: "把当前活跃分支复制成一个新会话" },
      { key: "/compact [提示]", desc: "手动压缩上下文，可附带指令告诉它保留什么重点" },
    ],
  },
  {
    id: "slash-model",
    title: "模型与凭证",
    items: [
      { key: "/login, /logout", desc: "管理 OAuth 或 API Key 凭证" },
      { key: "/model", desc: "打开模型切换器" },
      { key: "/scoped-models", desc: "设置哪些模型参与 Ctrl+P 循环切换" },
      { key: "/settings", desc: "思考强度、主题、消息送达方式、TUI 模式等设置" },
      { key: "/llama", desc: "下载、加载、卸载 llama.cpp 本地模型" },
    ],
  },
  {
    id: "slash-share",
    title: "导出与分享",
    items: [
      { key: "/copy", desc: "复制最后一条助手消息到剪贴板" },
      { key: "/export [文件]", desc: "把会话导出为 HTML 或 JSONL" },
      { key: "/import <文件>", desc: "从 JSONL 文件导入并恢复会话" },
      { key: "/share", desc: "上传为私有 GitHub Gist，生成可分享的 HTML 链接" },
    ],
  },
  {
    id: "slash-system",
    title: "系统与其他",
    items: [
      { key: "/reload", desc: "重载快捷键、扩展、技能、提示词模板、主题和上下文文件", note: "改完配置不用重启会话" },
      { key: "/trust", desc: "保存当前项目的信任决策（写入 trust.json）" },
      { key: "/hotkeys", desc: "显示所有快捷键" },
      { key: "/changelog", desc: "查看版本更新历史" },
      { key: "/quit", desc: "退出 Pi" },
    ],
  },
];

/* ---------------- CLI 参数 ---------------- */

export const cliGroups: CheatGroup[] = [
  {
    id: "cli-mode",
    title: "运行模式",
    items: [
      { key: "pi", desc: "交互式模式（默认），完整终端 UI" },
      { key: "-p, --print", desc: "打印回复后退出，一次性执行", note: "可接管道：cat README.md | pi -p \"总结这段文字\"" },
      { key: "--mode json", desc: "以 JSON 行输出全部事件流，适合脚本集成" },
      { key: "--mode rpc", desc: "stdin/stdout JSONL 协议的 RPC 模式，供非 Node 程序集成" },
      { key: "--export <输入> [输出]", desc: "把会话文件导出为 HTML" },
    ],
  },
  {
    id: "cli-session",
    title: "会话选项",
    items: [
      { key: "-c, --continue", desc: "继续最近一次会话" },
      { key: "-r, --resume", desc: "浏览并选择一个历史会话" },
      { key: "--session <路径|ID>", desc: "打开指定会话文件或会话 ID（支持部分 UUID）" },
      { key: "--fork <路径|ID>", desc: "把某个会话分叉成一个新会话文件" },
      { key: "--no-session", desc: "临时会话，不保存" },
      { key: "-n, --name <名称>", desc: "启动时设置会话显示名" },
      { key: "--session-dir <目录>", desc: "自定义会话存储目录" },
    ],
  },
  {
    id: "cli-model",
    title: "模型选项",
    items: [
      { key: "--provider <名称>", desc: "指定供应商，如 anthropic、openai、google" },
      { key: "--model <模式>", desc: "模型 ID 或模式，支持 provider/id 前缀和 :<思考等级> 后缀", note: "例：pi --model openai/gpt-4o、pi --model sonnet:high" },
      { key: "--api-key <key>", desc: "直接传 API Key，覆盖环境变量" },
      { key: "--thinking <等级>", desc: "off / minimal / low / medium / high / xhigh / max" },
      { key: "--models <模式列表>", desc: "逗号分隔，限定 Ctrl+P 循环的模型范围" },
      { key: "--list-models [关键词]", desc: "列出可用模型" },
    ],
  },
  {
    id: "cli-tools",
    title: "工具开关",
    items: [
      { key: "-t, --tools <列表>", desc: "白名单：只允许列出的工具", note: "只读审查：pi --tools read,grep,find,ls -p \"审查代码\"" },
      { key: "-xt, --exclude-tools <列表>", desc: "禁用指定工具，其余保留" },
      { key: "-nbt, --no-builtin-tools", desc: "关闭所有内置工具，只保留扩展提供的工具" },
      { key: "-nt, --no-tools", desc: "完全禁用工具，纯对话" },
    ],
  },
  {
    id: "cli-resource",
    title: "资源加载",
    items: [
      { key: "-e, --extension <来源>", desc: "加载扩展（路径 / npm / git），可重复" },
      { key: "--skill <路径>", desc: "加载技能，可重复" },
      { key: "--prompt-template <路径>", desc: "加载提示词模板，可重复" },
      { key: "--theme <路径>", desc: "加载主题，可重复" },
      { key: "--no-extensions / --no-skills / --no-themes", desc: "关闭对应的自动发现机制" },
      { key: "-nc, --no-context-files", desc: "不加载 AGENTS.md / CLAUDE.md 上下文文件" },
    ],
  },
  {
    id: "cli-misc",
    title: "其他常用",
    items: [
      { key: "--system-prompt <文本>", desc: "替换默认系统提示词（上下文文件和技能仍会追加）" },
      { key: "--append-system-prompt <文本>", desc: "在默认系统提示词后追加内容" },
      { key: "-a, --approve", desc: "本次运行信任项目级文件（跳过信任询问）" },
      { key: "-na, --no-approve", desc: "本次运行忽略项目级文件" },
      { key: "@文件", desc: "把文件内容带进消息：pi @code.ts \"审查这个文件\"" },
      { key: "-v, --version / -h, --help", desc: "查看版本 / 帮助" },
    ],
  },
  {
    id: "cli-package",
    title: "包管理（pi packages）",
    items: [
      { key: "pi install <来源> [-l]", desc: "安装扩展/技能/主题包，-l 装到项目级", note: "来源可以是 npm:包名 或 git:仓库地址" },
      { key: "pi remove <来源> [-l]", desc: "移除包（uninstall 是别名）" },
      { key: "pi update --all", desc: "更新 pi 本体和全部包" },
      { key: "pi update --self", desc: "只更新 pi 本体" },
      { key: "pi update --models", desc: "只刷新模型目录" },
      { key: "pi list", desc: "列出已安装的包" },
      { key: "pi config", desc: "启用/禁用包内资源" },
    ],
  },
];

/* ---------------- 编辑器技巧 ---------------- */

export const editorTips: CheatItem[] = [
  { key: "@", desc: "模糊搜索并引用项目文件，随消息一起发给模型" },
  { key: "Tab", desc: "路径补全" },
  { key: "Shift+Enter", desc: "多行输入（Windows Terminal 用 Ctrl+Enter）" },
  { key: "Ctrl+X", desc: "复制最后一条助手消息；在 /tree 里复制选中的消息" },
  { key: "Ctrl+V", desc: "粘贴图片或文本（Windows 用 Alt+V），也可以直接把图拖进终端" },
  { key: "!命令", desc: "执行 shell 命令，并把输出发给模型", note: "如 !git status，让模型看到当前仓库状态" },
  { key: "!!命令", desc: "执行 shell 命令但不发给模型（隐藏执行）" },
  { key: "Ctrl+G", desc: "在外部编辑器里写长 prompt（$VISUAL / $EDITOR）" },
];

/* ---------------- 快捷键 ---------------- */

export const keyGroups: CheatGroup[] = [
  {
    id: "key-global",
    title: "全局",
    items: [
      { key: "Esc", desc: "中断当前执行，并把排队消息退回编辑器" },
      { key: "Ctrl+C", desc: "第一次清空编辑器，第二次退出" },
      { key: "Ctrl+D", desc: "编辑器为空时退出" },
      { key: "Ctrl+Z", desc: "挂起到后台（Windows 无此绑定），fg 恢复" },
    ],
  },
  {
    id: "key-model",
    title: "模型与思考",
    items: [
      { key: "Ctrl+L", desc: "打开模型选择器" },
      { key: "Ctrl+P", desc: "循环切换到下一个模型" },
      { key: "Shift+Ctrl+P", desc: "循环切换到上一个模型" },
      { key: "Shift+Tab", desc: "循环切换思考等级（编辑器边框颜色会跟着变）" },
      { key: "Ctrl+T", desc: "折叠 / 展开思考块" },
    ],
  },
  {
    id: "key-queue",
    title: "消息队列（agent 还在干活时）",
    items: [
      { key: "Enter", desc: "排队 steering 消息：当前这轮工具调用结束后立即插入" },
      { key: "Alt+Enter", desc: "排队 follow-up 消息：等 agent 全部做完再发" },
      { key: "Alt+Up", desc: "把排队的消息取回编辑器" },
    ],
  },
  {
    id: "key-display",
    title: "显示与复制",
    items: [
      { key: "Ctrl+O", desc: "折叠 / 展开工具输出" },
      { key: "Ctrl+X", desc: "复制最后一条助手消息" },
      { key: "Ctrl+P（/tree 内）", desc: "切换路径显示；Ctrl+S 切换排序；Ctrl+N 只看命名会话" },
    ],
  },
  {
    id: "key-editor",
    title: "行编辑（Emacs 风）",
    items: [
      { key: "Ctrl+A / Ctrl+E", desc: "光标到行首 / 行尾" },
      { key: "Ctrl+W", desc: "向前删除一个词（Alt+Backspace 同效）" },
      { key: "Ctrl+U / Ctrl+K", desc: "删到行首 / 删到行尾" },
      { key: "Ctrl+Y", desc: "粘贴最近一次删除的文本；Alt+Y 循环更早的删除" },
      { key: "Ctrl+-", desc: "撤销上一次编辑" },
      { key: "Alt+B / Alt+F", desc: "按词左移 / 右移光标" },
    ],
  },
];

/** 内置工具速览 */
export const builtinTools: CheatItem[] = [
  { key: "read", desc: "读文件（默认启用）" },
  { key: "write", desc: "创建 / 覆盖文件（默认启用）" },
  { key: "edit", desc: "局部补丁修改（默认启用）" },
  { key: "bash", desc: "执行 shell 命令（默认启用）" },
  { key: "grep / find / ls", desc: "搜索与列目录（需用 --tools 显式开启）" },
];

/** 供全站搜索索引使用的扁平化条目 */
export interface CheatSearchEntry {
  key: string;
  desc: string;
  group: string;
}

export function flattenCheatsheet(): CheatSearchEntry[] {
  const out: CheatSearchEntry[] = [];
  const push = (groups: CheatGroup[], prefix: string) => {
    for (const g of groups) {
      for (const item of g.items) {
        out.push({ key: item.key, desc: item.desc, group: `${prefix} · ${g.title}` });
      }
    }
  };
  push(slashGroups, "斜杠命令");
  push(cliGroups, "CLI 参数");
  push(keyGroups, "快捷键");
  for (const item of editorTips) out.push({ key: item.key, desc: item.desc, group: "编辑器技巧" });
  for (const item of builtinTools) out.push({ key: item.key, desc: item.desc, group: "内置工具" });
  return out;
}
