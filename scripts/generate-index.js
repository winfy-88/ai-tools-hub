#!/usr/bin/env node
/**
 * generate-index.js
 *
 * 从 tools.json 生成完整的 index.html
 *
 * 用法:
 *   node scripts/generate-index.js          # 输出到 stdout
 *   node scripts/generate-index.js -o index.html   # 输出到文件
 *   node scripts/generate-index.js --watch         # 监听 tools.json 变化自动生成
 */

const fs = require('fs');
const path = require('path');

const TOOLS_JSON = path.resolve(__dirname, '..', 'tools.json');
const OUTPUT_HTML = path.resolve(__dirname, '..', 'index.html');
const CSS_STYLE = `/* ══ Reset & Base ══ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:       #0f0f1a;
  --card:     #1a1a2e;
  --card2:    #16162a;
  --accent:   #6c5ce7;
  --accent2:  #a29bfe;
  --green:    #00cec9;
  --orange:   #fd79a8;
  --yellow:   #ffeaa7;
  --text:     #e8e8f0;
  --muted:    #8888a8;
  --border:   #2a2a45;
  --radius:   14px;
  --shadow:   0 4px 24px rgba(0,0,0,.4);
  --transition: .25s cubic-bezier(.4,0,.2,1);
}
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* ══ Header ══ */
header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(15,15,26,.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
}
.header-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; gap: 20px;
  height: 64px;
}
.logo {
  font-size: 1.35rem; font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--green));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  white-space: nowrap;
}
.search-box { flex: 1; max-width: 420px; position: relative; }
.search-box input {
  width: 100%; padding: 9px 16px 9px 38px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 50px; color: var(--text);
  font-size: .9rem; outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.search-box input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(108,92,231,.25);
}
.search-icon {
  position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
  color: var(--muted); font-size: .95rem; pointer-events: none;
}
.header-right { margin-left: auto; display: flex; gap: 12px; align-items: center; }
.badge-live {
  font-size: .75rem; padding: 4px 12px;
  background: rgba(0,206,201,.12); color: var(--green);
  border: 1px solid rgba(0,206,201,.3);
  border-radius: 50px; font-weight: 600;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.6; } }

/* ══ Hero ══ */
.hero {
  text-align: center; padding: 72px 24px 56px;
  background: radial-gradient(ellipse at 50% 0%, rgba(108,92,231,.18) 0%, transparent 65%);
}
.hero h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800; line-height: 1.2;
  margin-bottom: 16px;
}
.hero h1 span {
  background: linear-gradient(135deg, var(--accent), var(--green), var(--orange));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero p {
  color: var(--muted); font-size: 1.1rem;
  max-width: 560px; margin: 0 auto 32px;
}
.stats-row { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-num { font-size: 2rem; font-weight: 800; color: var(--accent2); }
.stat-label { font-size: .8rem; color: var(--muted); margin-top: 2px; }

/* ══ Main ══ */
main { max-width: 1280px; margin: 0 auto; padding: 0 24px 80px; }

/* ══ Category Nav ══ */
.cat-nav {
  display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
  margin-bottom: 48px; position: sticky; top: 64px; z-index: 90;
  background: var(--bg); padding: 16px 0;
}
.cat-btn {
  padding: 7px 18px; border-radius: 50px;
  background: var(--card); border: 1px solid var(--border);
  color: var(--muted); font-size: .88rem; cursor: pointer;
  transition: all var(--transition);
}
.cat-btn:hover, .cat-btn.active {
  background: var(--accent); color: #fff; border-color: var(--accent);
}

/* ══ Section ══ */
.section { margin-bottom: 56px; }
.section-title {
  font-size: 1.3rem; font-weight: 700; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.section-title::before {
  content: ''; display: block; width: 4px; height: 22px;
  background: linear-gradient(180deg, var(--accent), var(--green));
  border-radius: 4px;
}
.section-desc {
  color: var(--muted); font-size: .88rem; margin-bottom: 20px; margin-left: 14px;
}

/* ══ Tool Grid ══ */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.tool-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  cursor: pointer;
  display: flex; flex-direction: column; gap: 12px;
  position: relative; overflow: hidden;
}
.tool-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--green));
  opacity: 0; transition: opacity var(--transition);
}
.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
  border-color: rgba(108,92,231,.4);
}
.tool-card:hover::before { opacity: 1; }
.card-top { display: flex; align-items: flex-start; gap: 14px; }
.tool-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; flex-shrink: 0;
}
.card-info { flex: 1; min-width: 0; }
.tool-name { font-weight: 700; font-size: 1.05rem; margin-bottom: 3px; }
.tool-tagline {
  font-size: .82rem; color: var(--muted);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.tag { padding: 2px 9px; border-radius: 50px; font-size: .72rem; font-weight: 600; }
.tag-free  { background: rgba(0,206,201,.12); color: var(--green); border: 1px solid rgba(0,206,201,.25); }
.tag-paid  { background: rgba(253,121,168,.12); color: var(--orange); border: 1px solid rgba(253,121,168,.25); }
.tag-freemium { background: rgba(255,234,167,.12); color: var(--yellow); border: 1px solid rgba(255,234,167,.25); }
.tag-hot   { background: rgba(108,92,231,.15); color: var(--accent2); border: 1px solid rgba(108,92,231,.3); }
.card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid var(--border); margin-top: 4px;
}
.pricing { font-size: .85rem; font-weight: 600; }
.pricing.free { color: var(--green); }
.pricing.paid { color: var(--orange); }
.pricing.freemium { color: var(--yellow); }
.visit-btn {
  font-size: .78rem; padding: 5px 14px;
  background: var(--accent); color: #fff;
  border-radius: 50px; font-weight: 600;
  transition: background var(--transition);
}
.visit-btn:hover { background: var(--accent2); }

.new-banner {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: .65rem; padding: 2px 7px;
  background: rgba(255,234,167,.12); color: var(--yellow);
  border-radius: 50px; font-weight: 700;
  margin-left: 6px;
}

/* ══ Featured ══ */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.featured-card {
  background: linear-gradient(135deg, var(--card), var(--card2));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 26px;
  transition: all var(--transition);
}
.featured-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.featured-rank { font-size: .75rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px; }
.featured-name { font-size: 1.15rem; font-weight: 800; margin-bottom: 6px; }
.featured-desc { font-size: .85rem; color: var(--muted); margin-bottom: 14px; }
.featured-link { font-size: .85rem; color: var(--accent2); font-weight: 600; }

/* ══ Skills Section ══ */
.skill-card {
  background: linear-gradient(135deg, rgba(108,92,231,.1), rgba(0,206,201,.05));
  border: 1px solid rgba(108,92,231,.3);
}
.skill-card .card-top { align-items: center; }
.skill-source {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: .7rem; padding: 2px 8px;
  background: rgba(108,92,231,.15); color: var(--accent2);
  border-radius: 4px; font-weight: 600;
  margin-top: 4px;
}

/* ══ Footer ══ */
footer {
  text-align: center; padding: 36px 24px;
  border-top: 1px solid var(--border);
  color: var(--muted); font-size: .85rem;
}
footer a { color: var(--accent2); }

/* ══ Toast ══ */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 999;
  background: var(--card); border: 1px solid var(--accent);
  border-radius: 12px; padding: 14px 20px;
  box-shadow: var(--shadow);
  transform: translateY(80px); opacity: 0;
  transition: all .35s cubic-bezier(.4,0,.2,1);
  max-width: 300px;
}
.toast.show { transform: translateY(0); opacity: 1; }

/* ══ Responsive ══ */
@media (max-width: 640px) {
  .tool-grid, .featured-grid { grid-template-columns: 1fr; }
  .stats-row { gap: 24px; }
  .header-inner { height: 56px; }
  .hero { padding: 48px 16px 36px; }
}`;

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildToolCard(tool) {
  const newBadge = tool.new ? `<span class="new-banner">🆕 NEW</span>` : '';
  const tags = tool.tags.map(t => {
    const cls = t === '免费' || t === '开源' ? 'tag-free' : t === '付费' ? 'tag-paid' : t === '热门' || t === 'Hot' ? 'tag-hot' : 'tag-freemium';
    return `<span class="tag ${cls}">${escapeHtml(t)}</span>`;
  }).join('');

  return `      <div class="tool-card${tool.cat === 'skill' ? ' skill-card' : ''}" data-cat="${escapeHtml(tool.cat)}" data-name="${escapeHtml(tool.id)}">
        <div class="card-top">
          <div class="tool-icon" style="background:${escapeHtml(tool.gradient)}">${escapeHtml(tool.emoji)}</div>
          <div class="card-info">
            <div class="tool-name">${escapeHtml(tool.name)}${newBadge}</div>
            <div class="tool-tagline">${escapeHtml(tool.tagline)}</div>
          </div>
        </div>
        <div class="card-tags">${tags}</div>
        <div class="card-footer">
          <span class="pricing ${escapeHtml(tool.pricing)}">${escapeHtml(tool.pricingLabel)}</span>
          <a href="${escapeHtml(tool.url)}" target="_blank" class="visit-btn">立即使用 →</a>
        </div>
      </div>`;
}

function buildFeaturedCard(tool) {
  if (!tool.featured) return '';
  return `      <div class="featured-card" data-cat="${escapeHtml(tool.cat)}">
        <div class="featured-rank">${escapeHtml(tool.featured.title)}</div>
        <div class="featured-name">${escapeHtml(tool.name)}</div>
        <div class="featured-desc">${escapeHtml(tool.tagline)}</div>
        <span class="featured-link">→ ${escapeHtml(tool.url)}</span>
      </div>`;
}

function buildHtml(data) {
  const { meta, categories, tools } = data;
  const now = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  // Group tools by category
  const byCat = {};
  for (const t of tools) {
    if (!byCat[t.cat]) byCat[t.cat] = [];
    byCat[t.cat].push(t);
  }

  // Count new tools this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newTools = tools.filter(t => {
    if (!t.new) return false;
    const d = new Date(t.addedDate);
    return d >= weekAgo;
  });

  // Build category nav buttons
  const catOrder = ['all', 'chat', 'write', 'image', 'code', 'video', 'audio', 'data', 'productivity', 'search', 'skill'];
  const catNav = catOrder.map(cat =>
    `<button class="cat-btn${cat === 'all' ? ' active' : ''}" data-cat="${escapeHtml(cat)}">${escapeHtml(categories[cat] || cat)}</button>`
  ).join('\n    ');

  // Build sections
  const sections = catOrder.filter(cat => cat !== 'all').map(cat => {
    const catTools = byCat[cat] || [];
    if (catTools.length === 0) return '';
    const cards = catTools.map(buildToolCard).join('\n');
    return `  <section class="section" data-section="${escapeHtml(cat)}">
    <div class="section-title">${escapeHtml(categories[cat] || cat)}</div>
    <p class="section-desc">${catTools.length} 个工具</p>
    <div class="tool-grid">
${cards}
    </div>
  </section>`;
  }).join('\n');

  // Featured tools
  const featuredTools = tools.filter(t => t.featured);
  const featuredCards = featuredTools.map(buildFeaturedCard).join('\n');

  // New tools count for hero
  const newBadge = newTools.length > 0
    ? `<span class="badge-live">🆕 今日 ${newTools.length} 个新工具</span>`
    : `<span class="badge-live">● 每日更新</span>`;

  // Update date
  const updateBadge = `<span class="badge-live">📅 ${now} 更新</span>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Tools Hub — 发现最好的 AI 工具</title>
  <meta name="description" content="精心 curated 的 AI 工具导航站，涵盖聊天、写作、画图、代码、视频等全品类，每日更新。" />
  <meta name="generator" content="AI Tools Hub v${escapeHtml(meta.version)} — generated from tools.json" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
  <style>${CSS_STYLE}</style>
</head>
<body>

<!-- ══ Header ══ -->
<header>
  <div class="header-inner">
    <div class="logo">🤖 AI Tools Hub</div>
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="searchInput" placeholder="搜索 AI 工具…" autocomplete="off" />
    </div>
    <div class="header-right">
      ${updateBadge}
    </div>
  </div>
</header>

<!-- ══ Hero ══ -->
<section class="hero">
  <h1>发现最适合你的<br><span>AI 工具箱</span></h1>
  <p>精心 curate 的 AI 工具导航站，覆盖写作、画图、代码、视频、数据分析等全品类，帮你省去筛选时间。</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-num" id="toolCount">${tools.length}</div><div class="stat-label">收录工具</div></div>
    <div class="stat"><div class="stat-num">${Object.keys(categories).length - 1}</div><div class="stat-label">工具分类</div></div>
    <div class="stat"><div class="stat-num">${Math.round(tools.filter(t => t.pricing === 'free').length / tools.length * 100)}%</div><div class="stat-label">完全免费</div></div>
  </div>
</section>

<!-- ══ Main ══ -->
<main>

  <!-- Category Nav -->
  <nav class="cat-nav" id="catNav">
    ${catNav}
  </nav>

  <!-- Featured -->
  <section class="section" id="featured">
    <div class="section-title">🏆 今日精选</div>
    <div class="featured-grid">
${featuredCards}
    </div>
  </section>

${sections}

</main>

<!-- ══ Footer ══ -->
<footer>
  <p>🤖 <strong>AI Tools Hub</strong> — 每天帮你发现最好的 AI 工具</p>
  <p style="margin-top:8px">本站内容每日自动更新 · <a href="https://github.com/winfy-88/ai-tools-hub" target="_blank">GitHub</a> · <a href="https://winfy-88.github.io/ai-tools-hub/">在线访问</a></p>
  <p style="margin-top:8px;opacity:.5">上次更新：${now} · Generated from tools.json v${escapeHtml(meta.version)}</p>
</footer>

<!-- ══ Script ══ -->
<script>
// ── Category filter ──
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.tool-card, .featured-card');
  const sections = document.querySelectorAll('.section[data-section]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;

      if (cat === 'all') {
        cards.forEach(c => c.style.display = '');
        sections.forEach(s => s.style.display = '');
      } else {
        cards.forEach(c => c.style.display = c.dataset.cat === cat ? '' : 'none');
        sections.forEach(s => s.style.display = s.dataset.section === cat ? '' : 'none');
      }
    });
  });

  // ── Search ──
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { cards.forEach(c => c.style.display = ''); return; }
    cards.forEach(c => {
      const name = (c.dataset.name || '').toLowerCase();
      const tagline = (c.querySelector('.tool-tagline')?.textContent || '').toLowerCase();
      c.style.display = (name.includes(q) || tagline.includes(q)) ? '' : 'none';
    });
  });

  // ── Tool count ──
  document.getElementById('toolCount').textContent = cards.length;
});
</script>
</body>
</html>`;
}

// ── CLI ──
function main() {
  const args = process.argv.slice(2);
  const outputFlag = args.indexOf('-o');
  const outputFile = outputFlag >= 0 ? args[outputFlag + 1] : null;
  const watchFlag = args.includes('--watch');

  function run() {
    if (!fs.existsSync(TOOLS_JSON)) {
      console.error('ERROR: tools.json not found at', TOOLS_JSON);
      process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
    const html = buildHtml(data);

    if (outputFile) {
      fs.writeFileSync(outputFile, html, 'utf8');
      console.log(`[OK] Generated ${outputFile} (${data.tools.length} tools, ${Object.keys(data.categories).length - 1} categories)`);
    } else {
      console.log(html);
    }
  }

  run();

  if (watchFlag) {
    console.log('[WATCH] Watching tools.json for changes...');
    fs.watchFile(TOOLS_JSON, { interval: 1000 }, () => {
      console.log('[WATCH] tools.json changed, regenerating...');
      run();
    });
  }
}

if (require.main === module) main();

module.exports = { buildHtml, buildToolCard, buildFeaturedCard, escapeHtml };
