# 🤖 AI Tools Hub

[![GitHub stars](https://img.shields.io/github/stars/winfy-88/ai-tools-hub?style=social)](https://github.com/winfy-88/ai-tools-hub)
[![GitHub forks](https://img.shields.io/github/forks/winfy-88/ai-tools-hub?style=social)](https://github.com/winfy-88/ai-tools-hub)
[![Daily Update](https://img.shields.io/badge/每日更新-blue?style=flat-square)](https://github.com/winfy-88/ai-tools-hub/actions)
[![License: MIT](https://github.com/winfy-88/ai-tools-hub/blob/main/LICENSE?style=flat-square)](LICENSE)

> 精心 curated 的 AI 工具导航站，**每日自动更新**。

🌐 **在线地址：** [https://winfy-88.github.io/ai-tools-hub/](https://winfy-88.github.io/ai-tools-hub/)

---

## ✨ 特色

- 🔥 **71+ 精选 AI 工具**，覆盖 10 大分类
- 🎯 **人工精筛 + 每日自动更新**，拒绝低质量工具
- 🆓 **标注价格类型**，一眼看出免费 / Freemium / 付费
- 🔍 **搜索 + 分类筛选**，秒找你需要的工具
- 🧠 **技能专区** — 收录自研 OpenClaw AI Agent 技能
- 🌙 **深色主题**，沉浸式浏览体验
- 📱 **移动端友好**，随时随地发现好工具

---

## 📊 分类一览

| 分类 | 数量 | 热门工具 |
|------|------|---------|
| 💬 AI 聊天 | 11 | ChatGPT · Claude · DeepSeek · Gemini |
| ✍️ AI 写作 | 8 | Copy.ai · Jasper · Notion AI · QuillBot |
| 🎨 AI 画图 | 10 | Midjourney · Flux · DALL·E · Ideogram |
| 💻 AI 编程 | 9 | GitHub Copilot · Cursor · Aider · Bolt |
| 🎬 AI 视频 | 10 | Runway ML · Sora · Pika · HeyGen |
| 🎵 AI 音频 | 7 | ElevenLabs · Suno AI · Murf AI |
| 📊 AI 数据 | 7 | Julius AI · ChatCSV · Rows · Hex |
| 📁 AI 办公 | 11 | Copilot · Gamma · Granola · Fireflies |
| 🔍 AI 搜索 | 7 | Perplexity · You.com · Consensus · Phind |
| 🧠 技能专区 | 1+ | Ebook Finder · (持续更新中) |

---

## 🚀 快速开始

### 在线使用
直接访问 **[https://winfy-88.github.io/ai-tools-hub/](https://winfy-88.github.io/ai-tools-hub/)** 即可使用。

### 本地部署
```bash
# 克隆仓库
git clone https://github.com/winfy-88/ai-tools-hub.git
cd ai-tools-hub

# 用浏览器打开 index.html 即可（纯静态页面）
start index.html
```

---

## 🔧 开发

### 架构

本仓库采用 **数据驱动架构**：

```
tools.json          ← 单一数据源（所有工具数据）
    │
    ├── scripts/generate-index.js   ← 生成 index.html
    ├── scripts/fetch-new-tools.js  ← 自动抓取新工具
    └── index.html                  ← 主站（自动生成，勿手动编辑）
```

### 添加新工具

只需修改 `tools.json`，然后重新生成 HTML：

```bash
# 1. 在 tools.json 中添加新工具条目
# 2. 生成 HTML
node scripts/generate-index.js -o index.html

# 3. 测试后 commit
git add tools.json index.html
git commit -m "add: 新工具名称"
git push
```

### 自动抓取新工具

```bash
# 查看今日新工具推荐
node scripts/fetch-new-tools.js

# 保存到文件
node scripts/fetch-new-tools.js --json new-tools.json

# 直接写入 tools.json（需先审查 new-tools.json）
node scripts/fetch-new-tools.js --apply
```

### GitHub Actions

仓库已配置 `daily-update.yml`，每天 UTC 08:00（北京时间 16:00）自动：
1. 抓取 Product Hunt / GitHub / Hacker News 新工具
2. 与现有 tools.json 去重对比
3. 生成新 index.html
4. 更新 CHANGELOG.md
5. 自动部署到 GitHub Pages

### 自研技能专区

收录我们自己开发的 OpenClaw AI Agent 技能。每个技能一个目录：

```
skills/
├── README.md
└── {skill-name}/
    ├── SKILL.md          ← 技能主文件
    └── references/       ← 参考资料
```

当前收录：
- **Ebook Finder** — AI 电子书搜索技能，7+ 书源并行搜索 ([SKILL.md](ebook-finder/SKILL.md))

---

## 🛠️ 添加新工具

直接在 `tools.json` 中添加新条目，参考现有格式：

```json
{
  "id": "tool-unique-id",
  "name": "工具名称",
  "cat": "chat",           // 分类: chat/write/image/code/video/audio/data/productivity/search/skill
  "tagline": "一句话介绍",
  "pricing": "freemium",   // free / freemium / paid
  "pricingLabel": "免费版可用",
  "url": "https://example.com",
  "emoji": "🤖",
  "gradient": "linear-gradient(135deg,#6c5ce7,#a29bfe)",
  "tags": ["热门", "Freemium"],
  "featured": null,        // 或 { "rank": 1, "title": "本周热门" }
  "new": false,
  "addedDate": "2025-01-01"
}
```

---

## 📈 数据统计

- 收录工具：**71+**
- 工具分类：**10**
- 完全免费：~40%
- Freemium：~45%
- 纯付费：~15%

---

## 🤝 贡献

欢迎提交 Issue 或 PR 推荐新工具！

1. Fork 本仓库
2. 在 `tools.json` 中添加工具条目
3. 运行 `node scripts/generate-index.js -o index.html`
4. 提交 PR

---

## 📄 许可证

MIT License — 自由使用，自由分享。

---

## 💬 联系方式

- 🌐 网站：[https://winfy-88.github.io/ai-tools-hub/](https://winfy-88.github.io/ai-tools-hub/)
- 🐙 GitHub：[https://github.com/winfy-88/ai-tools-hub](https://github.com/winfy-88/ai-tools-hub)

⭐ 如果这个项目对你有帮助，请给个 **Star** 支持一下！
