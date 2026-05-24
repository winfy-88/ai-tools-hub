---
name: movie-finder
description: >
  Search and download the latest movies (WEB-DL / BluRay / 4K). Use when the user
  needs to find, locate, or download a movie by title, year, or keywords.
  Supports Chinese and English titles, covers major free movie sources, and
  verifies download links before presenting them.
  Triggers: "电影", "movie", "下载电影", "找电影", "最新电影", "movie download",
  "find a movie", "电影资源", "磁力链接", "bt下载"
---

# Movie Finder

Search free movie sources (torrents / direct links), verify sources, and present the best options.

## Workflow

1. **Identify the target** — movie title, year, resolution (1080p / 4K / WEB-DL).
   If the user only has a vague idea, ask for title or at least the genre first.
2. **Search multiple sources in parallel** — use `web_search` + `web_fetch`
   against the sources below. Do not rely on a single source.
3. **Verify the link** — `web_fetch` the result page to confirm the page is
   accessible and the movie details match what the user asked for.
4. **Rank results** — by: (a) file quality (4K > 1080p > 720p), (b) codec
   (HEVC > H264 > x264), (c) source reputation, (d) file size sanity.
5. **Present top 3 results** with: title, year, resolution, file size, source,
   and download / magnet link. Warn if the source requires a CAPTCHA.

## Search Sources

### Priority order

| # | Source | URL | Notes |
|---|--------|-----|-------|
| 1 | YTS / YTS MX | `yts.mx` / `yts.mx.mx` | Best for quality movies, clean UI, magnet links |
| 2 | 1337x | `1337x.to` | Huge collection, good for latest releases |
| 3 | The Pirate Bay | `thepiratebay.org` | Largest tracker, reliable magnet links |
| 4 | TorrentGalaxy | `torrentgalaxy.to` | Fast mirrors, active community |
| 5 | 电影天堂 | `dytt8.com` | Chinese users' favorite, Chinese subs |
| 6 | Zooqle | `zooqle.com` | Good metadata, verified uploaders |
| 7 | RARBG mirror list | various | High-quality releases, verify mirror first |
| 8 | BT4G | `bt4g.org` | Magnet search engine, no registration |

### Source notes

- **YTS** is the safest starting point — curated, consistent naming, easy to filter by resolution.
- **1337x** has the most fresh content but double-check uploader reputation.
- **电影天堂** (dytt8) is best for Chinese dubbed/subbed content.
- Always verify the magnet link is live before presenting it to the user.

## Search Queries

Build effective queries for each source:

```
# English movies (general)
"{title}" {year} 1080p WEB-DL
"{title}" {year} 4K HDR HEVC
"{title}" {year} BluRay x265

# Chinese movies
"{中文片名}" {年份} 1080p
"{中文片名}" 高清
"{中文片名}" 中文字幕

# Latest releases (combine with date filter if available)
site:yts.mx "{title}" {year}
```

## Verification

Before presenting a link:

- `web_fetch` the result page to confirm the page is accessible and movie details match.
- If the page requires a CAPTCHA, note it and skip — do not attempt to solve.
- If `web_fetch` returns 403/404, discard the result.
- For magnet links, verify the link format is a valid `magnet:?xt=urn:btih:...` URI.
- Warn the user if a direct HTTP download (not torrent) is from an unknown domain.

## Download

When the user asks to download:

1. **Torrent / Magnet**: Present the magnet link directly. The user can open
   it with qBittorrent / Transmission / µTorrent.
   - To copy magnet to clipboard: `echo "magnet:?..." | clip`
2. **Direct download** (if available): Use `exec` with `curl` or `Invoke-WebRequest`.
3. Save to `C:\Users\Administrator\Downloads\` unless the user specifies otherwise.
4. Confirm the file size after download and report any discrepancy.

### Download command templates

```powershell
# Direct download
Invoke-WebRequest -Uri "{url}" -OutFile "C:\Users\Administrator\Downloads\{filename}.mkv"

# Copy magnet link to clipboard
Set-Clipboard -Value "magnet:?xt=urn:btih:{hash}"

# Using curl
curl -L -o "C:\Users\Administrator\Downloads\{filename}.mkv" "{url}"
```

## Handling Edge Cases

- **No results found**: Try alternate title translations, abbreviated titles,
  or search by year only. Check at least 3 different sources before giving up.
- **Multiple editions / releases**: Present options clearly with resolution and
  codec info (HEVC/H264, WEB-DL/BluRay, etc.).
- **4K vs 1080p**: Ask the user's preference if both are available and the
  file size difference is significant.
- **Subtitle availability**: Note if the release includes Chinese subtitles
  (中字 / 简中 / 繁中) — especially important on Chinese sources.
- **Large files (>10 GB)**: Warn the user before downloading.
- **TV series vs Movie**: Confirm whether the user wants a single movie or
  an entire season/series before searching.

## Quality Glossary

| Label | Meaning |
|-------|---------|
| WEB-DL | Rip from streaming service (Netflix/Disney+/Amazon), excellent quality |
| WEBRip | Same as WEB-DL, re-encoded |
| BluRay | Rip from Blu-ray disc, near original quality |
| HDRip | Rip from HD source, slightly compressed |
| HEVC / H.265 | Modern codec, ~50% smaller than H264 at same quality |
| H264 / x264 | Standard codec, most compatible |
| 4K / UHD | 3840×2160 resolution |
| 1080p | 1920×1080 resolution |
| 720p | 1280×720 resolution |

## Safety

- **Legal note**: Inform the user that downloading copyrighted content may
  violate local laws. This skill only helps find publicly indexed resources;
  the user is responsible for complying with applicable laws.
- **Malware**: Warn users to scan downloaded files before opening them.
- **Adult content**: Refuse to search for adult/pornographic material.
