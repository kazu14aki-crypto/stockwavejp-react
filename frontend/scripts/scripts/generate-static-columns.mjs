/**
 * generate-static-columns.mjs
 * コラム記事のSEO用静的HTMLを生成する
 * 
 * 実行タイミング:
 *   npm run prebuild → public/column/ に生成（Viteビルドで dist/ にコピーされる）
 *   npm run postbuild → dist/sitemap.xml, dist/robots.txt を生成
 * 
 * 生成ファイル:
 *   public/column/<id>/index.html  → Viteビルドでdistにコピー
 *   dist/sitemap.xml               → postbuildで生成
 *   dist/robots.txt                → postbuildで生成
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR  = join(__dirname, '..')
const PUBLIC_DIR = join(ROOT_DIR, 'public')
const DIST_DIR  = join(ROOT_DIR, 'dist')
const BASE_URL  = 'https://stockwavejp.com'

const rawData = readFileSync(
  join(ROOT_DIR, 'src', 'components', 'pages', 'columnData.js'), 'utf8'
)

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function extractArticles(src) {
  const articles = []
  const idMatches = [...src.matchAll(/id:\s*'([^']+)'/g)]
  idMatches.forEach((m, i) => {
    const pos = m.index
    const nextPos = i+1 < idMatches.length ? idMatches[i+1].index : src.length
    const chunk = src.slice(pos, nextPos)
    const g = (pat) => { const r = chunk.match(pat); return r ? r[1] : '' }
    const bodyStart = chunk.indexOf('body: `')
    const bodyEnd   = bodyStart >= 0 ? chunk.indexOf('`', bodyStart+7) : -1
    const body = bodyStart >= 0 && bodyEnd >= 0 ? chunk.slice(bodyStart+7, bodyEnd).trim() : ''
    articles.push({
      id:       m[1],
      title:    g(/title:\s*'([^']+)'/),
      summary:  g(/summary:\s*'([^']+)'/),
      category: g(/category:\s*'([^']+)'/),
      date:     g(/date:\s*'([^']+)'/),
      icon:     g(/icon:\s*'([^']+)'/),
      body,
    })
  })
  return articles
}

function bodyToHtml(body) {
  let html = '', inUl = false
  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('H2: ')) {
      if (inUl) { html += '</ul>\n'; inUl = false }
      html += `<h2>${esc(line.slice(4))}</h2>\n`
    } else if (line.startsWith('H3: ')) {
      if (inUl) { html += '</ul>\n'; inUl = false }
      html += `<h3>${esc(line.slice(4))}</h3>\n`
    } else if (line.startsWith('- ')) {
      if (!inUl) { html += '<ul>\n'; inUl = true }
      html += `<li>${esc(line.slice(2))}</li>\n`
    } else {
      if (inUl) { html += '</ul>\n'; inUl = false }
      html += `<p>${esc(line)}</p>\n`
    }
  }
  if (inUl) html += '</ul>\n'
  return html
}

function buildArticleHtml(a) {
  const bodyHtml = bodyToHtml(a.body)
  const schema = JSON.stringify({
    "@context":"https://schema.org","@type":"Article",
    "headline":a.title,"description":a.summary,"datePublished":a.date,
    "publisher":{"@type":"Organization","name":"StockWaveJP","url":BASE_URL}
  })
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(a.title)} | StockWaveJP</title>
  <meta name="description" content="${esc(a.summary)}">
  <meta property="og:title" content="${esc(a.title)}">
  <meta property="og:description" content="${esc(a.summary)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${BASE_URL}/column/${a.id}/">
  <meta property="og:site_name" content="StockWaveJP">
  <meta name="twitter:card" content="summary">
  <link rel="canonical" href="${BASE_URL}/column/${a.id}/">
  <script type="application/ld+json">${schema}</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3390301710035197" crossorigin="anonymous"></script>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:820px;margin:0 auto;padding:20px 16px;color:#1a1a1a;line-height:1.8}
    h1{font-size:1.5rem;color:#1a1a2e;border-bottom:2px solid #4a9eff;padding-bottom:10px;margin-bottom:8px}
    h2{font-size:1.15rem;color:#1a3a6e;margin-top:2rem;border-left:4px solid #4a9eff;padding-left:10px}
    h3{font-size:1rem;color:#4a9eff}
    nav{font-size:0.85rem;margin-bottom:20px;color:#666}
    nav a{color:#4a9eff;text-decoration:none}
    .meta{color:#888;font-size:0.85rem;margin-bottom:12px}
    .summary{background:#f0f7ff;border-left:4px solid #4a9eff;padding:12px 16px;margin:16px 0;border-radius:0 6px 6px 0;font-size:0.95rem}
    .cta{display:inline-block;background:#4a9eff;color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;margin:12px 0;font-weight:600}
    .disclaimer{background:#fff8e1;border:1px solid #ffd54f;padding:12px 16px;border-radius:6px;font-size:0.85rem;margin-top:2rem;color:#555}
    ul{padding-left:1.5rem;margin:8px 0}
    li{margin-bottom:6px}
    footer{border-top:1px solid #eee;margin-top:2rem;padding-top:1rem;font-size:0.85rem;color:#888}
    footer a{color:#4a9eff;text-decoration:none;margin-right:12px}
  </style>
  <script>
    if(typeof window!=='undefined'&&window.location.pathname.startsWith('/column/')){
      window.location.replace('${BASE_URL}/#column/${a.id}');
    }
  </script>
</head>
<body>
  <nav>
    <a href="${BASE_URL}/">&#127968; StockWaveJP</a> &rsaquo;
    <a href="${BASE_URL}/#column/">&#128218; コラム一覧</a> &rsaquo;
    ${esc(a.category)}
  </nav>
  <article itemscope itemtype="https://schema.org/Article">
    <p class="meta">&#128194; ${esc(a.category)}&ensp;|&ensp;&#128197; ${esc(a.date)}</p>
    <h1 itemprop="headline">${esc(a.icon)} ${esc(a.title)}</h1>
    <div class="summary" itemprop="description">${esc(a.summary)}</div>
    <a href="${BASE_URL}/#column/${a.id}" class="cta">&#128202; StockWaveJPで読む（データ・チャート付き）</a>
    <section itemprop="articleBody">
      ${bodyHtml}
    </section>
    <div class="disclaimer">
      &#9888; 本コラムは情報提供を目的としており、特定の銘柄・投資方法を推奨するものではありません。
      投資に関する最終的な判断はご自身の責任において行ってください。
    </div>
  </article>
  <footer>
    <a href="${BASE_URL}/">トップ</a>
    <a href="${BASE_URL}/#column/">コラム一覧</a>
    <a href="${BASE_URL}/#terms">利用規約</a>
    <a href="${BASE_URL}/#privacy">プライバシーポリシー</a>
    <span style="float:right">&copy; 2026 StockWaveJP</span>
  </footer>
</body>
</html>`
}

function buildSitemap(articles) {
  const staticPages = [
    [BASE_URL+'/',         '1.0','daily'],
    [BASE_URL+'/#column/', '0.9','weekly'],
    [BASE_URL+'/#terms',   '0.3','monthly'],
    [BASE_URL+'/#privacy', '0.3','monthly'],
  ]
  const urls = staticPages.map(([u,p,cf]) =>
    `  <url><loc>${u}</loc><changefreq>${cf}</changefreq><priority>${p}</priority></url>`
  )
  articles.forEach(a => {
    urls.push(`  <url>\n    <loc>${BASE_URL}/column/${a.id}/</loc>\n    <lastmod>${a.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`)
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
}

// ── 実行モードを判定 ──
const mode = process.argv[2] || 'prebuild'

const articles = extractArticles(rawData)
console.log(`[generate-static-columns] mode=${mode}, articles=${articles.length}`)

if (mode === 'prebuild') {
  // public/column/ に静的HTMLを生成（Viteビルドでdistにコピーされる）
  const colDir = join(PUBLIC_DIR, 'column')
  let count = 0
  for (const a of articles) {
    if (!a.id || !a.title) continue
    const dir = join(colDir, a.id)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), buildArticleHtml(a), 'utf8')
    count++
  }
  // sitemap.xml と robots.txt も public/ に置く（常時利用可能）
  writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(articles), 'utf8')
  writeFileSync(join(PUBLIC_DIR, 'robots.txt'),
    `User-agent: *\nAllow: /\nAllow: /column/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`, 'utf8')
  console.log(`[prebuild] 生成完了: column HTML x${count}, sitemap.xml, robots.txt`)

} else if (mode === 'postbuild') {
  // dist/ への追加確認（Viteコピーが完了しているはず）
  const count = articles.filter(a => existsSync(join(DIST_DIR,'column',a.id,'index.html'))).length
  console.log(`[postbuild] dist/column/ 確認: ${count}/${articles.length}ファイル`)
  if (count < articles.length) {
    // 不足分を直接dist/に書き込む
    for (const a of articles) {
      if (!a.id || !a.title) continue
      const p = join(DIST_DIR, 'column', a.id, 'index.html')
      if (!existsSync(p)) {
        mkdirSync(dirname(p), { recursive: true })
        writeFileSync(p, buildArticleHtml(a), 'utf8')
      }
    }
    console.log('[postbuild] 不足分を dist/ に直接生成しました')
  }
}
