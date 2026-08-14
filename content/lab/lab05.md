---
step: 5
title: 组装：一个能日常用的 mini agent
subtitle: 交互式 REPL、系统提示词、工具异常回包、成本统计、轮次护栏——把前四关拼成一个真正能陪你看代码的小助手。
tags: [总装, REPL, 系统工程]
---

## 这一关做什么

前四关都是"跑一条命令就退出"的玩具。这一关组装成**可交互的 mini agent**：启动后进入 REPL，你可以连续下指令，它带着记忆干活，报工具错误时会自我修正，每次回复后显示花费，输入 `/exit` 退出。

大约 100 行，就是你能日常用起来的最小完整形态。

## 完整代码

> 📦 配套代码：[github.com/zhoujianbin/pi-mini-agent](https://github.com/zhoujianbin/pi-mini-agent)，`npm run lab05` 直接跑（已实测：连续多轮对话、读不存在文件后错误自愈均正常）。

新建 `lab05/mini.mjs`：

```js
// lab05/mini.mjs —— 可交互的 mini agent
import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";

const BASE_URL = process.env.OPENAI_COMPATIBLE_BASE_URL;
const API_KEY = process.env.OPENAI_COMPATIBLE_API_KEY;
const MODEL = process.env.MODEL ?? "deepseek-chat";

// ---------- 工具 ----------
const WORKDIR = path.resolve("playground");
const toolImpls = {
  list_files: () => readdirSync(WORKDIR).join("\n") || "（空目录）",
  read_file: ({ filename }) => readFile(path.join(WORKDIR, filename), "utf8"),
  write_file: async ({ filename, content }) => {
    await writeFile(path.join(WORKDIR, filename), content, "utf8");
    return `已写入 ${filename}`;
  },
};
const tools = [
  { type: "function", function: { name: "list_files", description: "列出工作目录下的所有文件", parameters: { type: "object", properties: {} } } },
  { type: "function", function: { name: "read_file", description: "读取指定文件内容", parameters: { type: "object", properties: { filename: { type: "string" } }, required: ["filename"] } } },
  { type: "function", function: { name: "write_file", description: "创建或覆盖文件", parameters: { type: "object", properties: { filename: { type: "string" }, content: { type: "string" } }, required: ["filename", "content"] } } },
];

// ---------- 系统提示词：便宜但有效的行为规范 ----------
const SYSTEM_PROMPT = `你是 mini-agent，一个在终端里帮用户处理文件的助手。
规则：
1. 先想再动：修改文件前先读它。
2. 工具报错时，读错误信息，换参数重试一次；仍失败就向用户说明。
3. 完成任务后用一两句话汇报做了什么，不要复述全部内容。
4. 不确定文件名时先 list_files，不要猜。`;

// ---------- 模型调用 ----------
async function callModel(messages) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, tools }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { message: data.choices[0].message, usage: data.usage };
}

// ---------- 带护栏的 Agent Loop ----------
const MAX_TURNS = 8;
let totalTokens = 0;

async function runTask(messages, task) {
  messages.push({ role: "user", content: task });

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    const { message, usage } = await callModel(messages);
    if (usage) totalTokens += usage.prompt_tokens + usage.completion_tokens;
    messages.push(message);

    if (!message.tool_calls?.length) return message.content ?? "（空回复）";

    for (const call of message.tool_calls) {
      const args = JSON.parse(call.function.arguments);
      console.log(`  ⚡ ${call.function.name}(${JSON.stringify(args)})`);

      // 关键工程决策：工具异常不抛出，而是把错误文本回包给模型
      // 模型读到错误后大概率会自我修正——这就是 agent 的"韧性"来源
      let result;
      try {
        result = await toolImpls[call.function.name](args);
      } catch (err) {
        result = `工具执行失败: ${err.message}`;
      }
      messages.push({ role: "tool", tool_call_id: call.id, content: String(result) });
    }
  }
  return `（达到 ${MAX_TURNS} 轮上限，任务可能未完成，请把任务拆小一点再试）`;
}

// ---------- REPL ----------
const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: "\n你> " });
// 管道输入或 Ctrl+D 会让 stdin 提前关闭，之后再 prompt 会抛 ERR_USE_AFTER_CLOSE
// （这个 bug 也是我们实跑时真踩出来的）
let closed = false;
rl.on("close", () => (closed = true));
const safePrompt = () => { if (!closed) rl.prompt(); };

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

console.log(`mini-agent 已启动（模型 ${MODEL}，工作目录 ${WORKDIR}），输入 /exit 退出`);
safePrompt();

for await (const line of rl) {
  const input = line.trim();
  if (!input) { safePrompt(); continue; }
  if (input === "/exit") break;

  const reply = await runTask(messages, input);
  console.log(`agent> ${reply}`);
  console.log(`\x1b[2m（累计 ${totalTokens} tokens）\x1b[0m`);
  safePrompt();
}
rl.close();
```

跑起来：

```bash
node lab05/mini.mjs
```

## 逐段拆解

**1. system prompt 是行为契约。** 四条规则分别对应：先读后写（防盲改）、错误自愈、汇报节制、不猜文件名。你会惊讶于这么几行字对行为的约束力——第 4 章模型调用讲的就是这个。

**2. 工具异常回包，而不是炸掉进程。** 这是本关最重要的工程决策。`read_file` 一个不存在的文件，异常被 catch 后变成一条 `tool` 消息喂回给模型——模型读到"文件不存在"，通常下一步就是 `list_files` 自查。生产级 agent 的"聪明"，一多半是这种朴素的容错给的。

**3. 会话记忆 = messages 活着。** REPL 每轮复用同一个 messages 数组，所以它能记住你三分钟前让它建过什么文件。代价是数组单调变长——真实产品里，第 4 关的压缩器就该挂在这里。

**4. 成本可见。** 每次调用累加 usage，打印总 token 数。Pi 在页脚显示实时花费是同一个思路：看不见成本的成本一定会失控。

## 继续改造的清单（自选）

- 接入第 3 关的流式输出，消灭等待焦虑
- 挂上第 4 关的压缩器，支持长会话
- 加一个 `bash` 工具（先想想第 5 章讲的注入风险，至少加个命令白名单）
- 把 messages 落盘成 JSONL，下次启动恢复——第 6 关已经替你做了，直接去
- 用 `pi-agent-core` 重写一遍，对照看看你手搓的版本少了什么（答案会告诉你第 3 章那些设计为什么存在）

## 闯关自测

- [ ] 能解释"工具异常回包"为什么比直接报错退出更聪明
- [ ] 能说出 system prompt 四条规则各自防的是什么
- [ ] 能让 agent 故意触发一次工具错误并观察它的自愈过程

## 对应理论章节

- 第 4 章：模型调用——system prompt 与多厂商协议
- 第 3 章：Agent Loop——轮次护栏与停止条件
- 第 10 章：会话管理——把 REPL 的 messages 落盘，你就站在会话树的门口了

## 下一站

你的 REPL 还只能往前长，说错话回不去。第 6 关给它装上时光机：会话落盘 + `/branch` 分叉——第 10 章的最小实现。
