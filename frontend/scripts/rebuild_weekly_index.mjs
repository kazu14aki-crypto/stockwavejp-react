/**
 * rebuild_weekly_index.mjs
 * 週次レポートの index.json を、個別レポートファイル（2026-W##.json）から
 * 毎回スキャンして完全に再構築する。
 *
 * 目的：
 *   index.json は「一覧表示用の要約リスト」に過ぎず、正データは
 *   個別ファイル（frontend/public/data/weekly_reports/2026-W##.json）である。
 *   index.json を手編集して壊す・上書きしてしまうと過去レポートが
 *   「消えたように」見えるが、個別ファイル自体は無事なことがほとんど。
 *   このスクリプトは個別ファイルをすべて読み直して index.json を
 *   ゼロから再構築するため、index.json がどれだけ壊れていても、
 *   個別ファイルさえ残っていれば必ず正しい一覧に復元できる。
 *
 * 実行タイミング:
 *   npm run prebuild で自動実行（ビルドのたびに index.json を自動修復）
 *   npm run rebuild:weekly で単独実行も可能
 *   .github/workflows/weekly_report.yml でもレポート生成後に自動実行
 *
 * 安全設計:
 *   - 個別レポートファイルは一切書き換えない・削除しない（読み取り専用）
 *   - JSON構文が壊れているファイルが1つあっても、そのファイルだけ
 *     警告付きでスキップし、他のファイルは正しく取り込む
 *   - 実行結果（件数・週リスト）を必ずコンソールに出力する
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '..')
const REPORTS_DIR = join(ROOT_DIR, 'public', 'data', 'weekly_reports')
const INDEX_PATH = join(REPORTS_DIR, 'index.json')

function brief(w, filename) {
  // index.json 用の要約エントリを個別レポートから抽出する
  if (!w || typeof w !== 'object') return null
  if (!w.week || !w.date || !w.title) {
    console.warn(`[rebuild_weekly_index] ⚠ ${filename}: week/date/title が欠落。スキップします。`)
    return null
  }
  return {
    week: w.week,
    date: w.date,
    title: w.title,
    generated_at: w.generated_at || w.date,
    avg_pct_1w: w.summary?.avg_pct_1w ?? null,
    top5_themes: w.summary?.top5_themes ?? [],
  }
}

function main() {
  if (!existsSync(REPORTS_DIR)) {
    console.error(`[rebuild_weekly_index] ❌ ディレクトリが見つかりません: ${REPORTS_DIR}`)
    process.exit(1)
  }

  const files = readdirSync(REPORTS_DIR).filter(
    (f) => f.endsWith('.json') && f !== 'index.json'
  )

  if (files.length === 0) {
    console.warn('[rebuild_weekly_index] ⚠ 個別レポートファイルが1件も見つかりません。index.json は変更しません（誤って空にしないための安全策）。')
    return
  }

  const entries = []
  for (const filename of files) {
    const filepath = join(REPORTS_DIR, filename)
    let parsed
    try {
      parsed = JSON.parse(readFileSync(filepath, 'utf8'))
    } catch (e) {
      console.warn(`[rebuild_weekly_index] ⚠ ${filename}: JSON解析に失敗しました。このファイルはスキップします（他のファイルには影響しません）。詳細: ${e.message}`)
      continue
    }
    const entry = brief(parsed, filename)
    if (entry) entries.push(entry)
  }

  if (entries.length === 0) {
    console.error('[rebuild_weekly_index] ❌ 有効なレポートが1件も抽出できませんでした。index.json は変更しません。')
    process.exit(1)
  }

  // week（例: "2026-W28"）の文字列降順 = 新しい週が先頭。同一年内は正しく並ぶ。
  // 年をまたぐ場合（例 2025-W52 と 2026-W01）は date（ISO日付）で最終補正する。
  entries.sort((a, b) => {
    if (a.week !== b.week) return a.week < b.week ? 1 : -1
    return a.date < b.date ? 1 : -1
  })
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  const before = existsSync(INDEX_PATH)
    ? (() => {
        try {
          return JSON.parse(readFileSync(INDEX_PATH, 'utf8')).length
        } catch {
          return '不明（壊れていました）'
        }
      })()
    : 0

  writeFileSync(INDEX_PATH, JSON.stringify(entries, null, 2) + '\n', 'utf8')

  console.log(`[rebuild_weekly_index] ✅ index.json を再構築しました。`)
  console.log(`[rebuild_weekly_index]    再構築前: ${before}件 → 再構築後: ${entries.length}件`)
  console.log(`[rebuild_weekly_index]    週一覧: ${entries.map((e) => e.week).join(', ')}`)
}

main()
