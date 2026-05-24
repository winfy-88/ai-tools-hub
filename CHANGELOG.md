# Changelog

All notable changes to AI Tools Hub are documented here.

## 2026-05-24 — v2.0 重构

### 🚀 重大更新
- 从纯静态 HTML 重构为数据驱动架构
- 新增 `tools.json` 作为单一数据源
- 新增 `generate-index.js` 从 JSON 生成完整 HTML
- 新增 `fetch-new-tools.js` 自动抓取新工具
- 新增 GitHub Actions 每日自动更新（`daily-update.yml`）
- 新增「技能专区」分类，收录 OpenClaw 自研技能

### 📦 新增工具
- **Ebook Finder** — AI 电子书搜索技能，7+ 书源并行搜索（开源）

### 🔧 技术变更
- `tools.json` — 71 个工具，10 个分类
- `scripts/generate-index.js` — 从 tools.json 生成 index.html
- `scripts/fetch-new-tools.js` — 抓取 Product Hunt / GitHub / HN 新工具
- `.github/workflows/daily-update.yml` — 每日 UTC 08:00 自动运行

---

## 2026-05-20 — v1.0 初始发布

- 首次发布 AI Tools Hub
- 78 个 AI 工具，9 大分类
- 支持搜索 + 分类筛选
- 深色主题，移动端友好
- GitHub 开源：https://github.com/winfy-88/ai-tools-hub
