# 🧠 技能专区

收录我们自己开发的 **OpenClaw AI Agent** 技能。每个技能都是经过实战检验的自动化能力，你也可以在自己的 OpenClaw 中使用它们。

---

## 当前收录

### 📚 Ebook Finder

**AI 驱动的电子书搜索技能**

- 自动搜索 7+ 个主流免费书库（Z-Library / LibGen / 安娜的档案等）
- 支持 PDF / EPUB / MOBI 格式
- 自动验证下载链接，过滤死链和 CAPTCHA
- 支持中英文书名 + ISBN 精确查找

📖 [查看技能详情 →](ebook-finder/SKILL.md)

---

## 如何贡献

如果你有自研的 OpenClaw 技能想收录到这里：

1. Fork 本仓库
2. 在 `skills/` 下创建技能目录，包含 `SKILL.md`
3. 在 `tools.json` 中添加技能条目（分类 `skill`）
4. 运行 `node scripts/generate-index.js -o index.html`
5. 提交 PR
