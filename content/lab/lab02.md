---
step: 2
title: 工具调用：Agent Loop 的最小闭环
subtitle: 给模型三个文件工具，写一个 while 循环处理它的工具调用——你就徒手实现了一个能读文件的 Agent。
tags: [Agent Loop, tool calling, 核心关卡]
---

## 这一关做什么

在第 1 关的基础上加两个东西：**工具定义** 和 **一个 while 循环**。做完这一关，你就拥有了一个真正的 Agent：你说"看看当前目录有什么文件，把清单写进 files.txt"，它会自己调 `list_files`，再调 `write_file`，最后向你汇报。

这个 while 循环就是第 2 章讲的 **Agent Loop** 的全部本质。Pi 的 `pi-agent-core` 包里几千行代码，核心骨架和这一关一模一样。

## 动手前

环境变量同第 1 关。新建一个测试目录，丢几个文件进去，后面让 agent 在里面干活：

```bash
mkdir -p lab02/playground && cd lab02/playground
echo "你好，Agent" > hello.txt
echo "Agent 的第一次读写实验" > notes.md
cd ..
```

## 完整代码

> 📦 配套代码：[github.com/zhoujianbin/pi-mini-agent](https://github.com/zhoujianbin/pi-mini-agent)，`npm run lab02` 直接跑（已实测：模型甚至会并行调用多个工具）。

新建 `lab02/agent.mjs`：

```js
// lab02/agent.mjs —— 最小 Agent Loop
import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.OPENAI_COMPATIBLE_BASE_URL;
const API_KEY = process.env.OPENAI_COMPATIBLE_API_KEY;
const MODEL = process.env.MODEL ?? "deepseek-chat";

// ---- 1. 工具的真实实现（运行在你这边，不在模型那边）----
const WORKDIR = path.resolve("playground");

const toolImpls = {
  list_files: () => readdirSync(WORKDIR).join("\n"),
  read_file: ({ filename }) => readFile(path.join(WORKDIR, filename), "utf8"),
  write_file: async ({ filename, content }) => {
    await writeFile(path.join(WORKDIR, filename), content, "utf8");
    return `已写入 ${filename}（${content.length} 字符）`;
  },
};

// ---- 2. 给模型看的工具说明书（JSON Schema）----
const tools = [
  {
    type: "function",
    function: {
      name: "list_files",
      description: "列出工作目录下的所有文件",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "读取工作目录中指定文件的内容",
      parameters: {
        type: "object",
        properties: { filename: { type: "string", description: "文件名" } },
        required: ["filename"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "在工作目录中创建或覆盖一个文件",
      parameters: {
        type: "object",
        properties: {
          filename: { type: "string", description: "文件名" },
          content: { type: "string", description: "要写入的完整内容" },
        },
        required: ["filename", "content"],
      },
    },
  },
];

// ---- 3. 一次模型调用 ----
async function callModel(messages) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, tools }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0].message;
}

// ---- 4. Agent Loop：核心就这十几行 ----
const messages = [
  { role: "system", content: "你是一个文件助手，通过工具帮用户管理文件。" },
  { role: "user", content: process.argv[2] ?? "看看目录里有什么文件" },
];

const MAX_TURNS = 10; // 护栏：防止模型陷入无限工具调用
for (let turn = 1; turn <= MAX_TURNS; turn++) {
  const msg = await callModel(messages);
  messages.push(msg); // 无论有没有工具调用，都先记账

  // 停止条件：模型不再调用工具 = 它认为任务完成了
  if (!msg.tool_calls?.length) {
    console.log(`\n[第 ${turn} 轮] 助手最终回复:`, msg.content);
    break;
  }

  // 执行这轮的所有工具调用，把结果塞回 messages
  for (const call of msg.tool_calls) {
    const args = JSON.parse(call.function.arguments);
    console.log(`[第 ${turn} 轮] 调用工具 ${call.function.name}(${JSON.stringify(args)})`);
    const result = await toolImpls[call.function.name](args);
    messages.push({
      role: "tool",
      tool_call_id: call.id, // 必须带上，模型靠它对号入座
      content: String(result),
    });
  }
}
```

跑起来：

```bash
node lab02/agent.mjs "看看 playground 里有什么文件，把每个文件的内容读出来，汇总写到 summary.txt"
```

## 逐段拆解

**1. 工具有两半。** `tools` 数组是给模型看的"说明书"（叫什么名字、干什么用、参数长什么样）；`toolImpls` 是真正干活的函数。模型只输出"我想调 read_file、参数是这个 JSON"——**执行永远发生在你这边**。这就是第 4 章"工具管道"的核心事实。

**2. 循环的停止条件。** `while` 什么时候停？不是"任务完成"——模型没说这个词——而是**它这一轮没再请求工具**。这个判据写进了几乎所有生产级 Agent 的源码里，也是面试 30 题里第 2 章的原题。

**3. tool_call_id 对号入座。** 一轮里模型可能同时请求多个工具。每个结果消息必须带 `tool_call_id`，模型才知道哪份结果对应哪个请求。漏掉它，有的供应商会直接报错。

**4. MAX_TURNS 护栏。** 模型可能死循环：读了写、写了读，停不下来。生产级实现一定有轮次上限或预算上限。Pi 的做法更精细（按 token 预算 + 用户可随时 Esc 打断），思想一致。

**5. 记账顺序不能乱。** 模型的每条回复（哪怕只含 tool_calls、content 为空）都必须先 push 进 messages，再 push 工具结果。顺序错了，下一轮请求就是一段"上下文谎言"。

## 常见坑

- **arguments 是字符串**：`call.function.arguments` 是 JSON **字符串**，必须 `JSON.parse`，这是新手最常见的报错来源
- **工具结果必须是字符串**：`content` 字段不接受对象，`String(result)` 兜底
- **路径穿越**：教学代码没校验 `filename`，模型（或被注入的文本）可以写 `../` 逃逸出工作目录——第 6 关以后我们谈安全时再说，Pi 的做法见第 4 章
- **死循环烧钱**：先把 MAX_TURNS 调小到 5 再放开玩

## 闯关自测

- [ ] 能用一句话说清 Agent Loop 的停止条件
- [ ] 能指出代码里"说明书"和"实现"分别在哪个变量
- [ ] 能解释 tool_call_id 的作用
- [ ] 把 MAX_TURNS 改成 2，观察并解释 agent 的行为变化

## 对应理论章节

- 第 2 章：Agent Loop——这一关的 while 循环就是它的最小实现
- 第 4 章：工具系统——工具定义、参数 Schema、结果回包的完整链路
