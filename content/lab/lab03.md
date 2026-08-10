---
step: 3
title: 流式事件：看见 Agent 的呼吸
subtitle: 把请求改成 stream: true，亲手解析 SSE 事件流——文字逐字吐出、工具调用实时出现，终端 UI 的秘密就在这里。
tags: [streaming, SSE, 事件]
---

## 这一关做什么

前两关里，模型思考多久，你的终端就"死"多久。这一关把响应改成**流式**：文字一个一个蹦出来，工具调用一冒头就能看到。你会亲手解析 SSE（Server-Sent Events）数据流，理解"增量事件"这个模型——它是第 6 章事件驱动架构的物理基础。

## 动手前

接着用第 2 关的 playground。流式输出在 OpenAI 兼容协议里的变化只有三处：

1. 请求体加 `stream: true`
2. 响应不再是完整 JSON，而是 `data: {...}` 一行一行的文本流
3. 增量里的字段叫 `delta` 而不是 `message`，工具调用参数会**分片**到达，需要自己拼接

## 完整代码

新建 `lab03/stream.mjs`（在第 2 关基础上改，工具部分原样保留）：

```js
// lab03/stream.mjs —— 流式版 Agent Loop
import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = process.env.OPENAI_COMPATIBLE_BASE_URL;
const API_KEY = process.env.OPENAI_COMPATIBLE_API_KEY;
const MODEL = process.env.MODEL ?? "deepseek-chat";

const WORKDIR = path.resolve("playground");
const toolImpls = {
  list_files: () => readdirSync(WORKDIR).join("\n"),
  read_file: ({ filename }) => readFile(path.join(WORKDIR, filename), "utf8"),
  write_file: async ({ filename, content }) => {
    await writeFile(path.join(WORKDIR, filename), content, "utf8");
    return `已写入 ${filename}`;
  },
};
const tools = [/* …与第 2 关完全相同，此处省略… */];

// ---- 流式调用：返回组装好的完整 message，过程中实时打印 ----
async function callModelStreaming(messages) {
  const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, tools, stream: true }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

  // 流式响应是一行行 "data: {json}"，最后一行是 "data: [DONE]"
  let content = "";
  const toolCalls = []; // 按 index 归位：工具调用参数是分片流过来的

  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // 最后一行可能不完整，留到下一轮

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") continue;

      const event = JSON.parse(payload);
      const delta = event.choices?.[0]?.delta;
      if (!delta) continue;

      // 文本增量：直接吐到终端，就是"打字机"效果
      if (delta.content) {
        content += delta.content;
        process.stdout.write(delta.content);
      }

      // 工具调用增量：按 index 归位，参数逐段拼接
      for (const tc of delta.tool_calls ?? []) {
        const slot = (toolCalls[tc.index] ??= {
          id: tc.id,
          type: "function",
          function: { name: tc.function?.name ?? "", arguments: "" },
        });
        if (tc.function?.name) slot.function.name = tc.function.name;
        if (tc.function?.arguments) slot.function.arguments += tc.function.arguments;
        if (tc.function?.arguments) {
          // 参数每拼一段提示一次，肉眼可见"模型正在组织参数"
          process.stdout.write(`\x1b[2m.\x1b[0m`);
        }
      }
    }
  }
  if (content) process.stdout.write("\n");

  const message = { role: "assistant", content: content || null };
  if (toolCalls.length) message.tool_calls = toolCalls;
  return message;
}

// ---- Agent Loop：和第 2 关一样，只是换成流式调用 ----
const messages = [
  { role: "system", content: "你是一个文件助手，通过工具帮用户管理文件。" },
  { role: "user", content: process.argv[2] ?? "看看目录里有什么文件" },
];

for (let turn = 1; turn <= 10; turn++) {
  console.log(`\n—— 第 ${turn} 轮 ——`);
  const msg = await callModelStreaming(messages);
  messages.push(msg);

  if (!msg.tool_calls?.length) break;

  for (const call of msg.tool_calls) {
    const args = JSON.parse(call.function.arguments);
    console.log(`⚡ 工具 ${call.function.name}(${JSON.stringify(args)})`);
    const result = await toolImpls[call.function.name](args);
    messages.push({ role: "tool", tool_call_id: call.id, content: String(result) });
  }
}
```

跑起来：

```bash
node lab03/stream.mjs "读出所有文件内容，写一份带标题的汇总到 report.txt"
```

## 逐段拆解

**1. SSE 协议很朴素。** 响应体就是文本流：`data: {一小段JSON}\n\n` 不断到来，最后以 `data: [DONE]` 收尾。没有魔法，不需要库。

**2. delta 而不是 message。** 非流式时你拿到完整的 `message`；流式时每一片只带**变化量** `delta`。这正对应第 6 章里 `message_start / message_update / message_end` 的事件序列——Pi 把每个 delta 翻译成事件，TUI 订阅事件刷新界面。

**3. 工具参数是分片的。** `arguments` 这个 JSON 字符串会切成好几段陆续到达（比如先 `{"filena`，再 `me": "hel`，再 `lo.txt"}`）。必须按 `index` 归位逐段拼接，等流结束后才能 `JSON.parse`。这是流式工具调用最容易踩的坑。

**4. 拼回完整 message。** 循环记账需要完整消息，所以流式处理完后我们要把 content 和 tool_calls 重新组装成第 2 关那种完整 message。生产级实现（如 pi-ai）内部维护一个"增量聚合器"，干的就是这件事。

## 常见坑

- **跨 chunk 的半行**：一行 JSON 可能被 TCP 切成两半，所以要有 `buffer` 暂存末尾不完整行
- **提前 JSON.parse**：arguments 没拼完就解析必挂，要等整轮流结束
- **content 为 null**：本轮只调工具时 content 可能是 null，组装 message 时别写成空字符串（部分供应商对 `""` 和 `null` 的处理不同）

## 闯关自测

- [ ] 能画出 SSE 流里一轮对话的事件顺序
- [ ] 能解释为什么 tool_calls 要带 index 归位
- [ ] 能说出 delta 模型与第 6 章事件类型的对应关系

## 对应理论章节

- 第 5 章：消息系统——partial message 如何长成完整消息
- 第 6 章：事件驱动——message_update 事件就是 delta 的封装
