# PI agent 学习指南

一个清新风格的个人学习站点：基于开源项目 **[Pi](https://github.com/earendil-works/pi)**（生产级 AI Agent 运行时底座）的源码拆解，把 Agent Loop、工具管道、消息系统、事件驱动、上下文工程、压缩算法与会话树等核心机制整理成十章可读、可验证的中文指南。

## 致谢

**本站内容改编自冬瓜（buchidonggua）的开源教程 [dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes)**。原教程以 [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可发布，正是这份扎实、逐行对源码负责的拆解，让本站的内容有了可靠的地基。按照相同许可（ShareAlike）的要求，本站全部章节内容同样以 CC-BY-SA-4.0 共享。衷心感谢原作者的开放与严谨。

同时感谢 **Pi 项目官方团队 [earendil-works](https://github.com/earendil-works/pi)**（MIT 许可）——Pi 本身"做减法"的工程哲学，是这一切讨论得以存在的前提。

## 功能亮点

- **十章指南**：从三层架构到 Agent Loop、模型调用、工具系统、消息系统、事件驱动、上下文工程、压缩算法、会话管理，逐层拆透
- **每章 3 个面试问答气泡**：章首"带着问题读"，正文中对应段落右侧浮动"面试题 N"问答气泡，读完即可自测
- **28 张架构配图**：米白底 SVG 图解，嵌在章节正文对应位置
- **清新响应式设计**：薄荷绿 × 天空蓝浅色主题，移动端单列自适应

## 技术栈

- React 19 + TypeScript + Vite 7
- Tailwind CSS 3 + shadcn/ui 组件
- markdown-it（章节 Markdown 渲染）+ 自写轻量 YAML frontmatter 解析器
- react-router（章节路由，支持浏览器前进后退）

## 快速开始

```bash
npm install
npm run dev      # 本地开发（默认 http://localhost:3000）
npm run build    # 生产构建（tsc + vite build，输出 dist/）
```

## 目录结构

```
├── content/chapters/      # 10 个章节 Markdown（YAML frontmatter + 正文）
│                          #   frontmatter: chapter / title / subtitle / tags / interview(q,a)
│                          #   正文用 [[qa:1]] [[qa:2]] [[qa:3]] 标记面试气泡插入位置
├── public/diagrams/       # 28 张章节配图（SVG）
├── public/qrcode-*.png    # 站点运营者个人二维码物料（见许可说明）
├── src/
│   ├── lib/chapters.ts    # 章节加载 + frontmatter 解析（单一数据源）
│   ├── lib/markdown.ts    # markdown-it 实例
│   ├── pages/             # Home / ChapterPage
│   ├── sections/          # 首页各区块（Hero / WhyPi / LearningPath / ChapterGrid / AboutPi / FollowMe）
│   └── components/        # Navbar / Footer / QaBubble / AgentLoopDiagram 等
└── index.html
```

## 内容源与许可

- **章节内容（`content/chapters/`）**：改编自 [dg-ai-notes](https://github.com/buchidonggua/dg-ai-notes)（CC-BY-SA-4.0），本站内容以相同许可 **[CC-BY-SA-4.0](LICENSE)** 共享。转载或二次创作请注明出处并保持同许可。
- **站点代码（`src/` 等工程文件）**：以 **MIT** 许可授权，可自由复用、修改、再发布（保留版权声明即可）。
- **Pi 项目本身**：MIT 许可，归 [earendil-works](https://github.com/earendil-works/pi) 所有；本站与 Pi 官方无隶属关系。
- **二维码图片（`public/qrcode-wechat.png`、`public/qrcode-channels.png`）**：属站点运营者个人物料，**不随本项目授权**， fork 或再发布时请替换或删除。
