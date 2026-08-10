---
step: 4
title: 上下文压缩：对话太长怎么办
subtitle: 给 Agent 装上"记忆压缩术"：估算 token、超限就总结前段历史、替换成摘要消息——第 9 章算法的最小可行版。
tags: [压缩, 上下文工程, token]
---

## 这一关做什么

Agent 干活越久，messages 越长。每个工具结果（比如读了一个大文件）都在疯狂吃 token，迟早撞上下文上限——或者先撞你的账单。这一关实现一个**最小压缩器**：盯住 token 估算值，超限就把"旧历史"交给模型总结成一段摘要，用一条摘要消息替换掉那几十条原始消息。

这就是第 8、9 章的核心机制。做完你会理解 Pi 为什么敢让用户挂着 agent 跑一整天。

## 动手前

不用新准备什么。建议先把 playground 里塞一个大一点的文件（比如把某章正文复制进去），让压缩真的被触发。

## 完整代码

新建 `lab04/compact.mjs`（Agent Loop 与工具部分同第 2 关，只展示新增和改动）：

```js
// lab04/compact.mjs —— 带压缩的 Agent Loop（增量部分）

// ---- 1. 粗糙但够用的 token 估算：英文约 4 字符/token，中文约 1.5 字/token，取保守值 ----
function estimateTokens(messages) {
  let chars = 0;
  for (const m of messages) {
    chars += (m.content ?? "").length;
    for (const tc of m.tool_calls ?? []) chars += tc.function.arguments.length;
  }
  return Math.ceil(chars / 2);
}

const CONTEXT_LIMIT = 6000;      // 教学用小阈值，方便触发
const KEEP_RECENT = 4;           // 最近 4 条消息原样保留，不参与压缩

// ---- 2. 压缩器：把旧消息总结成一条摘要消息 ----
async function compact(messages) {
  const splitAt = messages.length - KEEP_RECENT;
  if (splitAt <= 1) return messages; // 除了 system 没多少可压的

  const oldPart = messages.slice(1, splitAt);   // 不动 system，从第 1 条之后切
  const recent = messages.slice(splitAt);

  console.log(`\n🗜 触发压缩：${oldPart.length} 条旧消息（约 ${estimateTokens(oldPart)} tokens）`);

  // 让模型自己写摘要——压缩也是一次普通的模型调用
  const summary = await callModel([
    { role: "system", content: "你是上下文压缩器。把给定的对话历史压缩成一段保留关键事实、决定和文件状态的摘要，200 字以内。" },
    { role: "user", content: oldPart.map((m) => `[${m.role}] ${m.content ?? JSON.stringify(m.tool_calls)}`).join("\n") },
  ]);

  // 用一条"摘要消息"替换全部旧历史
  return [
    messages[0], // system 永远在第一位
    { role: "user", content: `【前情摘要】${summary.content}` },
    ...recent,
  ];
}

// ---- 3. 主循环里加一道检查 ----
for (let turn = 1; turn <= 15; turn++) {
  // 每轮开始前先看要不要压缩（放在模型调用之前，省一次超限请求）
  if (estimateTokens(messages) > CONTEXT_LIMIT) {
    const compacted = await compact(messages);
    messages.length = 0;
    messages.push(...compacted);
  }

  const msg = await callModel(messages);
  messages.push(msg);
  if (!msg.tool_calls?.length) {
    console.log(`\n助手:`, msg.content);
    break;
  }
  for (const call of msg.tool_calls) {
    // …与第 2 关相同…
  }
}
```

跑起来（故意给一个会产生大量工具结果的任务）：

```bash
node lab04/compact.mjs "逐个读出所有文件，分析每个文件的写作风格，最后写一份总评"
```

## 逐段拆解

**1. 估算是粗糙的，这是刻意的。** 生产实现用真实 tokenizer；教学版用字符数除以 2 已经足够演示机制。第 9 章讲过：压缩是"有损的防御动作"，触发早一点点没有代价。

**2. system 和最近几条不参与压缩。** 切割点要保证 `tool_call` 和它的 `tool` 结果不被切断（面试 30 题第 9 章原题！）。教学版简单保留最近 4 条；Pi 的切割算法会向前找到安全的 assistant 边界——去读第 9 章对照。

**3. 压缩本身也是一次模型调用。** 用同一个模型、换一个"压缩器人格"的 system prompt。注意这次调用是**独立的 messages**——别顺手把主对话传进去。

**4. 摘要顶替原位。** 压缩后的数组仍以 system 开头，摘要放在第二条，语义上是"用户提供的背景资料"。这样模型继续工作时自然把摘要当事实用。

## 常见坑

- **切断工具调用对**：切割点落在 tool_calls 和 tool 结果之间，下一轮请求直接 400——这是最经典的 bug
- **把摘要记成 assistant**：摘要是你伪造的上下文，放 user 角色更诚实，模型行为也更稳
- **压太狠**：KEEP_RECENT 太小会把"正在做的事"也压没，agent 会突然失忆般重读文件

## 闯关自测

- [ ] 能解释切割点为什么不能落在 toolResult 上
- [ ] 能说出压缩调用为什么不复用主对话的 messages
- [ ] 把 CONTEXT_LIMIT 调到 1500，观察压缩提前触发后 agent 的行为差异

## 对应理论章节

- 第 8 章：上下文工程——上下文里到底该留什么
- 第 9 章：压缩算法——生产级切割点选择、摘要质量与分支摘要
