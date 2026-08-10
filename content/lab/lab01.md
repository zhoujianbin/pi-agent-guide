---
step: 1
title: 一次调用：看懂 messages 数组
subtitle: 不写任何框架，用一次裸 fetch 调用大模型，看清"对话"的唯一真相——一个不断增长的 messages 数组。
tags: [热身, messages, 零依赖]
---

## 这一关做什么

用 **30 行纯 JavaScript** 完成一次大模型调用。不接任何 SDK、不装任何依赖，只要 Node 20+ 和一个 OpenAI 兼容的 API Key（DeepSeek、通义、智谱、月之暗面都行）。

这一关要建立的直觉只有一个：**所谓"对话"，就是一个 messages 数组**。模型本身没有记忆，每次请求你都要把完整对话历史重新发一遍。后面所有关卡——工具、压缩、会话树——都是在这个数组上做文章。

## 动手前

```bash
node --version   # 需要 20 以上，自带全局 fetch

# 任选一个 OpenAI 兼容的供应商，以 DeepSeek 为例
# 约定：BASE_URL 以 /v1 结尾，代码里统一拼 /chat/completions
export OPENAI_COMPATIBLE_BASE_URL="https://api.deepseek.com/v1"
export OPENAI_COMPATIBLE_API_KEY="你的 key"
export MODEL="deepseek-chat"
```

> 📦 配套代码已开源：[github.com/zhoujianbin/pi-mini-agent](https://github.com/zhoujianbin/pi-mini-agent)，克隆下来 `npm run lab01` 即可直接跑本关（已用真实 API 实测通过）。

## 完整代码

新建 `lab01/chat.mjs`：

```js
// lab01/chat.mjs —— 最小的一次模型调用
const BASE_URL = process.env.OPENAI_COMPATIBLE_BASE_URL; // 形如 https://api.deepseek.com/v1
const API_KEY = process.env.OPENAI_COMPATIBLE_API_KEY;
const MODEL = process.env.MODEL ?? "deepseek-chat";

if (!BASE_URL || !API_KEY) {
  console.error("请先设置 OPENAI_COMPATIBLE_BASE_URL 和 OPENAI_COMPATIBLE_API_KEY");
  process.exit(1);
}

// 对话的全部状态，就这一个数组
const messages = [
  { role: "system", content: "你是一个简洁的助手，回答不超过三句话。" },
  { role: "user", content: "用一句话解释什么是 AI Agent。" },
];

const res = await fetch(`${BASE_URL}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({ model: MODEL, messages }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}:`, await res.text());
  process.exit(1);
}

const data = await res.json();
const reply = data.choices[0].message;

// 把模型的回复也追加进数组，下一轮请求就能"记住"它说过什么
messages.push(reply);

console.log("助手:", reply.content);
console.log("\n--- messages 数组现在的样子 ---");
console.log(JSON.stringify(messages, null, 2));
console.log("\n本次用量:", data.usage);
```

## 逐段拆解

**1. messages 是唯一状态。** 注意我们没有创建任何"会话对象"。system 设定人格，user 是你说的话，assistant 是模型的回复——三种角色构成全部上下文。

**2. 请求是无状态的。** 每次 POST 都带上完整 messages。你觉得模型"记得"你上句话，是因为你把上句话又发了一遍。这就是为什么长对话越来越贵、也越来越慢。

**3. 把回复 push 回数组。** 这一行是多轮对话的关键。第二轮提问时，模型能看到自己第一轮的回复，对话就"续"上了。

**4. usage 字段。** 返回里的 `prompt_tokens` 和 `completion_tokens` 是第 9 章压缩算法的触发依据——Pi 就是盯着这个数决定何时压缩的。

## 跑起来看看

```bash
node lab01/chat.mjs
```

预期输出：一句关于 AI Agent 的解释，然后是完整 messages 数组的 JSON 打印，最后是 token 用量。

## 常见坑

- **401 / 404 Unauthorized**：key 没设置，或 BASE_URL 少了 `/v1`——本教程约定 BASE_URL 以 `/v1` 结尾、代码里拼 `/chat/completions`，两头只能有一处 `/v1`
- **把回复当字符串用**：`choices[0].message` 是对象，下一轮 push 的也必须是这个对象，不能图省事只存 `.content`
- **以为模型记得上次运行**：每次 `node chat.mjs` 都是全新对话，进程结束状态就没了——会话持久化是第 5 关的事

## 闯关自测

- [ ] 能说出 messages 数组里三种 role 各自的含义
- [ ] 能解释为什么"模型没有记忆，是你在重复发送历史"
- [ ] 能在返回 JSON 里找到本轮的 token 用量

## 对应理论章节

- 第 1 章：三层架构总览——我们这一关在徒手实现 `pi-ai` 层的最小功能
- 第 5 章：消息系统——AgentMessage 与 LLM Message 的转换，第一站就是这里
