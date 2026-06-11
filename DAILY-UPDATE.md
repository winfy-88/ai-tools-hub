# AI Tools Hub — 每日更新清单

## 📋 每日任务 (Daily Update Checklist)

### 1. 抓取新工具 (fetch-new-tools)
- [ ] 运行 `node scripts/fetch-new-tools.js` 扫描 Product Hunt / GitHub / Hacker News 新工具
- [ ] 审查新工具，过滤低质量/重复
- [ ] 写入 tools.json
- [ ] 生成新 index.html

### 2. Agent 插件板块专项
- [ ] 搜索本周新发布/新火的 Agent 框架/插件（Product Hunt AI 分类、Hacker News、GitHub Trending）
- [ ] 检查现有 10 个 Agent 工具是否需要更新描述/链接/价格
- [ ] 新增 1-3 个新 Agent 工具卡片到 `data-section="agent"`
- [ ] 更新 Featured 区（如有更好的 Agent 新秀）

### 3. Skill 专区专项
- [ ] 检查自研 Skill（Ebook Finder / Movie Finder / Music Finder）是否需要更新
- [ ] 搜索新开源 Skill / MCP Server，新增到 Skill 专区
- [ ] 更新技能卡片描述

### 4. 全站维护
- [ ] 检查外链是否失效（每月一次）
- [ ] 更新 Featured 本周热门
- [ ] 更新工具描述文案，确保准确

## 🔄 执行方式

### GitHub Actions (自动)
- 仓库已配置 `.github/workflows/daily-update.yml`
- 每天 UTC 08:00（北京时间 16:00）自动运行

### 本地手动执行
```bash
cd C:\Users\Administrator\.openclaw\workspace\ai-tools-hub
node scripts/fetch-new-tools.js --json new-tools.json   # 扫描新工具
# 审查 new-tools.json 后
node scripts/fetch-new-tools.js --apply                 # 写入 tools.json
node scripts/generate-index.js -o index.html            # 重新生成页面
```

## 📊 当前数据

| 分类 | 数量 | 最后更新 |
|------|------|---------|
| 💬 AI 聊天 | 11 | 2026-05-20 |
| ✍️ AI 写作 | 8 | 2026-05-20 |
| 🎨 AI 画图 | 10 | 2026-05-20 |
| 💻 AI 编程 | 9 | 2026-05-20 |
| 🎬 AI 视频 | 8 | 2026-05-20 |
| 🎵 AI 音频 | 6 | 2026-05-20 |
| 📊 AI 数据 | 6 | 2026-05-20 |
| 📁 AI 办公 | 11 | 2026-05-20 |
| 🔍 AI 搜索 | 6 | 2026-05-20 |
| 🧩 Agent 插件 | 10 | 2026-06-11 ✨新增 |
| 🧠 Skill 专区 | 2+ | 2026-05-20 |

## 📁 文件结构

```
ai-tools-hub/
├── index.html          # 主站（自动生成，勿手动编辑）
├── tools.json          # 工具数据源（核心）
├── CHANGELOG.md        # 更新日志
├── AFFILIATE-PLAN.md   # 联盟计划
├── screenshot.png      # 站点截图
├── README.md           # GitHub 说明
├── LICENSE             # MIT
├── scripts/
│   ├── generate-index.js    # 生成 index.html
│   └── fetch-new-tools.js   # 抓取新工具
└── .github/
    └── workflows/
        └── daily-update.yml # GitHub Actions 自动更新
```

## 🎯 本周目标 (2026-06-11 ~ 06-17)

- [x] 新增 Agent 插件板块（10 个精选工具）
- [ ] 补充 Skill 专区（Music Finder 等自研技能）
- [ ] 调研 AI Agent 新趋势，更新 Agent 板块至 15 个
- [ ] 完善 SEO（sitemap.xml + meta tags）
