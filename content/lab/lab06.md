---
step: 6
title: 会话分叉：给 Agent 装上时光机
subtitle: 会话不是一条数组，而是一棵树——只追加的 JSONL + parentId 指针，/branch 一条命令回到任意时间点重新生长。
tags: [会话树, JSONL, 收官关卡]
---

## 这一关做什么

前五关的 messages 数组都是一条直线：只能往前长，说错话、走错路都回不去。这一关给它升维成**会话树**：

- 每次对话**自动落盘**，关掉终端明天还能续上
- `/history` 查看当前分支的完整对话
- `/branch 3` 从第 3 条消息处**开岔**，接下来的对话从那个时间点重新生长——旧分支原样保留

这就是第 10 章的核心机制，也是你在 Pi 里按两下 `Esc` 回到历史消息重新提问时发生的事。做完你会理解：为什么"分叉"在 Pi 里几乎零成本。

## 关键直觉：两个决定

整关的实现只需要两个设计决定：

1. **会话文件是只追加（append-only）的 JSONL**。每条消息一行：`{id, parentId, message}`。永远不修改、不删除已有行。
2. **"当前对话"不是文件本身，而是从某个叶子节点沿 parentId 一路走回根的那条链**。

于是分叉变得 trivial：把"叶子指针"挪回历史上任意一点，之后的新消息把 parentId 指向那里——文件里自然就长出了第二个分支。不用复制文件、不用复制消息，**改一个指针而已**。

## 动手前

在 lab05 的基础上改。环境变量不变。

> 📦 配套代码：[github.com/zhoujianbin/pi-mini-agent](https://github.com/zhoujianbin/pi-mini-agent)，`npm run lab06` 直接跑（已实测：分叉后模型重新读文件，旧分支完整保留，重启后续上当前分支）。

## 完整代码

新建 `lab06/branch.mjs`（工具、模型调用、Agent Loop 与 lab05 相同，只展示新增的会话层）：

```js
// lab06/branch.mjs —— 会话层：只追加的 JSONL + parentId 树
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const SESSION_DIR = path.resolve("sessions");
const SESSION_FILE = path.join(SESSION_DIR, "session.jsonl");

let entries = [];   // 全量条目（含所有分支）
let leafId = null;  // 当前叶子：新消息的 parentId 都指向它

const byId = () => new Map(entries.map((e) => [e.id, e]));

/** 从叶子沿 parentId 走回根，还原成发给模型的 messages 数组 */
function chainFrom(leaf) {
  const map = byId();
  const chain = [];
  for (let cur = leaf; cur; cur = map.get(cur.parentId)) chain.unshift(cur);
  return chain;
}

async function appendEntry(message) {
  const entry = { id: randomUUID().slice(0, 8), parentId: leafId, message };
  entries.push(entry);
  leafId = entry.id;
  await appendFile(SESSION_FILE, JSON.stringify(entry) + "\n", "utf8"); // 只追加
  return entry;
}

async function loadSession() {
  await mkdir(SESSION_DIR, { recursive: true });
  try {
    const raw = await readFile(SESSION_FILE, "utf8");
    entries = raw.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
  } catch {
    entries = []; // 文件不存在 = 全新会话
  }
  if (entries.length > 0) {
    leafId = entries[entries.length - 1].id; // 续上最近一次离开的叶子
  } else {
    await appendEntry({ role: "system", content: SYSTEM_PROMPT });
  }
}
```

Agent Loop 里唯一的改动：**每次调用模型前，从当前叶子重建 messages**——

```js
async function runTask(task) {
  await appendEntry({ role: "user", content: task });
  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const messages = chainFrom(byId().get(leafId)).map((e) => e.message);
    const { message, usage } = await callModel(messages);
    await appendEntry(message);
    // …工具调用与 lab05 相同，结果也 appendEntry…
  }
}
```

REPL 里加两条命令（分支就是挪指针，注意文件一个字节都没改）：

```js
if (input === "/history") {
  const chain = chainFrom(byId().get(leafId));
  chain.forEach((e, i) => console.log(`  [${i}] ${e.message.role}  ${preview(e.message)}`));
}
const m = input.match(/^\/branch\s+(\d+)$/);
if (m) {
  const chain = chainFrom(byId().get(leafId));
  const target = chain[Number(m[1])];
  if (target) leafId = target.id; // 分叉完成，就这一行
}
```

跑起来，试这个剧本：

```bash
node lab06/branch.mjs
# 你> 读一下 hello.txt 里写了什么        ← agent 调 read_file 后回答
# 你> /history                          ← 链上有 5 条：[0]system [1]user [2]⚡read_file [3]tool [4]assistant
# 你> /branch 1                         ← 回到"刚问完、还没读文件"的那一刻
# 你> hello.txt 里写了什么？            ← agent 会【重新】调一次 read_file！
```

最后一步是魔法发生的地方：新分支里根本没有上次读文件的工具结果，模型只能重新读——**记忆真的被倒带了**。打开 `sessions/session.jsonl`，你会看到第 1 条 user 消息有两个"孩子"，那就是你的第一个分叉。

## 逐段拆解

**1. 只追加是灵魂。** 从不修改已有行，意味着崩溃恢复免费（最后一行可能截断，跳过即可）、并发追加安全、历史不可篡改。Pi 的会话文件同样是 JSONL——第 10 章有格式对照。

**2. 链是"算"出来的，不是存出来的。** 文件里只有节点和指针，"当前对话"永远是临时计算结果。这就是为什么切分支 O(1)：没有两份对话副本，只有两条共学前半段的链。

**3. 重建 messages 的时机。** 注意 `chainFrom` 在**每轮**模型调用前执行，而不是缓存一个数组。这样 `/branch` 挪完指针，下一轮请求自动用新链——分支切换没有任何需要"同步"的状态。

**4. 树 ≠ 每条消息都分叉。** 实际文件里 99% 的节点只有一个孩子，树是稀疏的。存储成本不随分叉次数爆炸，这也是 Pi 敢把分叉做成日常操作的原因。

## 常见坑

- **createInterface 之后先做异步 IO**：管道输入（`printf ... | node`）下，如果 `createInterface` 和 `for await` 之间插了别的 `await`，stdin 在迭代器挂上之前就到 EOF，缓冲的行会被丢掉，进程报 `unsettled top-level await` 直接退出——**这个坑是实跑真踩出来的**。修复：所有异步初始化做完再 `createInterface`
- **分叉点落在工具调用对中间**：回到 `[2]`（assistant 发起了 tool_call）却把 `[3]`（tool 结果）丢掉，下一轮请求直接被供应商 400。教学版没拦这个，你可以试试踩一脚，再想想第 9 章压缩的安全切割点是不是同一个问题
- **把分叉做成"复制整个文件"**：那就失去了树的全部意义——共享前缀应该物理上只存一份

## 闯关自测

- [ ] 能用一张图解释"为什么开岔只改一个指针"
- [ ] 打开 session.jsonl，找到有两个孩子的节点
- [ ] 分叉后提问，观察到模型重新调用了工具（记忆倒带的证据）
- [ ] 重启进程，确认会话自动续上当前分支

## 对应理论章节

- 第 10 章：会话管理——存储格式、恢复与分叉，这一关就是它的最小实现
- 第 6 章：消息系统——链重建时 entry → message 的投影，正是 AgentMessage/LLM Message 分层的动机
- 第 9 章：上下文压缩——压缩条目也可以挂进这棵树（Pi 的"分支摘要"就是这么做的），想想摘要该成为谁的孩子

## 毕业题（更新版）

把 6 关写出的代码和 Pi 的四个包对一下：callModel ≈ `pi-ai`，Agent Loop ≈ `pi-agent-core`，REPL ≈ `pi-tui`，session.jsonl ≈ 第 10 章的会话文件。然后打开 Pi 源码，找到它的树条目结构和你的 `{id, parentId, message}` 对比——**它多的每个字段，都是一个你还没踩到的坑的纪念碑**。
