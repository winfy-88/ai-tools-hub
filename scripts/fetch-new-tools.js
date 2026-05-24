#!/usr/bin/env node
/**
 * fetch-new-tools.js
 *
 * 从多个来源抓取新 AI 工具，生成 JSON diff 供审查。
 *
 * 用法:
 *   node scripts/fetch-new-tools.js              # 打印 diff JSON
 *   node scripts/fetch-new-tools.js --json new-tools.json   # 保存到文件
 *   node scripts/fetch-new-tools.js --apply               # 直接写入 tools.json（谨慎）
 *
 * 数据源:
 *   - Product Hunt GraphQL API
 *   - GitHub Search API (topic:ai-tools)
 *   - Hacker News Algolia API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOOLS_JSON = path.resolve(__dirname, '..', 'tools.json');

// ── helpers ──────────────────────────────────────────────────────────────────
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AI-Tools-Hub-Bot/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(new Error('Invalid JSON from ' + url)); } });
      res.on('error', reject);
    }).on('error', reject);
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, ''); }
function today() { return new Date().toISOString().slice(0, 10); }

// ── Source 1: Product Hunt ──────────────────────────────────────────────────
async function fetchProductHunt() {
  const results = [];
  try {
    // Use Product Hunt public RSS feed
    const feed = await httpsGet('https://www.producthunt.com/feed');
    // Parse RSS items (simplified)
    const items = feed.rss?.channel?.item || [];
    for (const item of items) {
      if (!item.title) continue;
      const name = item.title.replace(/^\[.*?\]\s*/, '');
      results.push({
        source: 'producthunt',
        name: name.trim(),
        url: item.link || `https://www.producthunt.com/search?q=${encodeURIComponent(name)}`,
        tagline: (item.description || '').replace(/<[^>]+>/g, '').trim(),
        votes: parseInt(item['ph:votes']) || 0
      });
    }
  } catch(e) { console.error('[ProductHunt] fetch error:', e.message); }
  return results;
}

// ── Source 2: GitHub Search ──────────────────────────────────────────────────
async function fetchGitHub() {
  const results = [];
  try {
    const queries = ['topic:ai-tools', 'topic:ai-tool', 'AI tools collection', 'awesome-ai'];
    for (const q of queries.slice(0, 1)) { // limit to 1 query to avoid rate limits
      const data = await httpsGet(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=5`);
      for (const item of data.items || []) {
        results.push({
          source: 'github',
          name: item.name,
          url: item.html_url,
          tagline: item.description || '',
          stars: item.stargazers_count
        });
      }
      await sleep(2000);
    }
  } catch(e) { console.error('[GitHub] fetch error:', e.message); }
  return results;
}

// ── Source 3: Hacker News ─────────────────────────────────────────────────────
async function fetchHackerNews() {
  const results = [];
  try {
    const data = await httpsGet('https://hn.algolia.com/api/v1/search?query=AI+tool&tags=story&hitsPerPage=10');
    for (const hit of data.hits || []) {
      if (!hit.title) continue;
      results.push({
        source: 'hackernews',
        name: hit.title.replace(/^\[.*?\]\s*/, ''),
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        tagline: ''
      });
    }
  } catch(e) { console.error('[HN] fetch error:', e.message); }
  return results;
}

// ── Deduplicate & Filter ─────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const saveTo = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
  const apply = args.includes('--apply');

  console.log('[1/4] Fetching Product Hunt...');
  const phTools = await fetchProductHunt();
  console.log(`  → ${phTools.length} items`);

  console.log('[2/4] Fetching GitHub...');
  const ghTools = await fetchGitHub();
  console.log(`  → ${ghTools.length} items`);

  console.log('[3/4] Fetching Hacker News...');
  const hnTools = await fetchHackerNews();
  console.log(`  → ${hnTools.length} items`);

  // Load existing tools
  const existing = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  const existingNames = new Set(existing.tools.map(t => t.name.toLowerCase()));
  const existingUrls = new Set(existing.tools.filter(t => t.url).map(t => t.url.toLowerCase()));

  // Deduplicate
  const allNew = [...phTools, ...ghTools, ...hnTools];
  const unique = new Map();
  for (const t of allNew) {
    const key = t.name.toLowerCase();
    if (existingNames.has(key) || (t.url && existingUrls.has(t.url.toLowerCase()))) continue;
    if (unique.has(key)) {
      const existing = unique.get(key);
      if ((t.stars || 0) > (existing.stars || 0)) unique.set(key, t);
    } else {
      unique.set(key, t);
    }
  }

  const newTools = Array.from(unique.values()).slice(0, 20); // top 20
  console.log(`[4/4] ${newTools.length} new unique tools found\n`);

  // Print summary
  for (const t of newTools) {
    console.log(`  📦 ${t.name} [${t.source}] ${t.url ? '→ ' + t.url.substring(0, 50) : ''}`);
  }

  if (newTools.length === 0) {
    console.log('\n✅ No new tools found today.');
    return;
  }

  // Generate diff JSON
  const diff = {
    date: today(),
    sources: ['producthunt', 'github', 'hackernews'],
    newTools: newTools.map(t => ({
      name: t.name,
      url: t.url,
      tagline: t.tagline,
      source: t.source,
      suggestedCat: guessCategory(t),
      addedDate: today(),
      new: true
    }))
  };

  if (saveTo) {
    fs.writeFileSync(saveTo, JSON.stringify(diff, null, 2), 'utf8');
    console.log(`\n💾 Saved to ${saveTo}`);
  } else {
    console.log('\n📋 New tools JSON:');
    console.log(JSON.stringify(diff, null, 2));
  }

  console.log('\n💡 建议: 检查上方列表后，将需要的工具手动添加到 tools.json');
  console.log('   然后运行: node scripts/generate-index.js -o index.html');
}

function guessCategory(tool) {
  const name = (tool.name + ' ' + tool.tagline).toLowerCase();
  if (name.includes('chat') || name.includes('对话') || name.includes('assistant')) return 'chat';
  if (name.includes('write') || name.includes('写作') || name.includes('copy')) return 'write';
  if (name.includes('image') || name.includes('画图') || name.includes('art') || name.includes('design')) return 'image';
  if (name.includes('code') || name.includes('编程') || name.includes('dev') || name.includes('github')) return 'code';
  if (name.includes('video') || name.includes('视频')) return 'video';
  if (name.includes('audio') || name.includes('voice') || name.includes('music')) return 'audio';
  if (name.includes('data') || name.includes('分析') || name.includes('excel')) return 'data';
  if (name.includes('productivity') || name.includes('效率') || name.includes('todo') || name.includes('calendar')) return 'productivity';
  if (name.includes('search') || name.includes('搜索')) return 'search';
  return 'all';
}

main().catch(e => { console.error(e); process.exit(1); });
