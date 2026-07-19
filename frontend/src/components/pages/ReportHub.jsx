import { useEffect, useState } from 'react'
import WeeklyReport from './WeeklyReport'

function PeriodArchive({ type, title, description }) {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetch(`/data/${type}_reports/index.json?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : []))
      .then(setItems)
      .catch(() => setItems([]))
  }, [type])

  const openReport = (item) => {
    setSelected(item.id)
    setReport(null)
    fetch(`/data/${type}_reports/${item.file}?t=${Date.now()}`)
      .then((response) => (response.ok ? response.json() : null))
      .then(setReport)
      .catch(() => setReport(null))
  }

  return <div style={{ padding: '20px 24px 80px', maxWidth: '960px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{title}</h1>
    <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.7, marginBottom: '18px' }}>{description}</p>
    {!items.length ? <div style={{ padding: '44px 20px', textAlign: 'center', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text3)', fontSize: '13px' }}>データは準備中です。過去分を順次追加予定です。</div> : <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
        {items.map((item) => <button type="button" key={item.id || item.period} onClick={() => openReport(item)} style={{ textAlign: 'left', fontFamily: 'var(--font)', cursor: 'pointer', background: 'var(--bg2)', border: selected === item.id ? '1px solid var(--accent)' : '1px solid var(--border)', borderRadius: '10px', padding: '16px', color: 'inherit' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '5px' }}>{item.period}</div>
        </button>)}
      </div>
      {selected && !report && <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text3)' }}>レポートを読み込んでいます…</div>}
      {report && <article style={{ marginTop: '20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--text)', margin: '0 0 4px' }}>{report.title}</h2>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '16px' }}>{report.period} ・ 作成日: {report.generated_at}</div>
        {report.metrics?.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '8px', marginBottom: '18px' }}>{report.metrics.map((metric) => <div key={metric.label} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}><div style={{ fontSize: '11px', color: 'var(--text3)' }}>{metric.label}</div><div style={{ fontWeight: 700, color: 'var(--text)', marginTop: '3px' }}>{metric.value}</div></div>)}</div>}
        {report.sections?.map((section) => <section key={section.heading} style={{ marginTop: '16px' }}><h3 style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 6px' }}>{section.heading}</h3><p style={{ whiteSpace: 'pre-line', fontSize: '13px', lineHeight: 1.8, color: 'var(--text2)', margin: 0 }}>{section.body}</p></section>)}
        {report.sources?.length > 0 && <section style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}><h3 style={{ fontSize: '12px', color: 'var(--text3)', margin: '0 0 6px' }}>出典</h3>{report.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '12px', color: 'var(--accent)', lineHeight: 1.7 }}>{source.label}</a>)}</section>}
        <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.7, margin: '18px 0 0' }}>{report.disclaimer}</p>
      </article>}
    </>}
  </div>
}

export default function ReportHub({ onNavigate }) {
  const [tab, setTab] = useState('weekly')
  const tabs = [['weekly', '週次レポート'], ['monthly', '月次レポート'], ['quarterly', '四半期レポート']]

  return <div>
    <div className="page-header-sticky" style={{ gap: '8px', flexWrap: 'wrap' }}><h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginRight: '8px' }}>📰 レポート</h1>{tabs.map(([key, label]) => <button key={key} onClick={() => setTab(key)} style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', border: tab === key ? '1px solid var(--accent)' : '1px solid var(--border)', background: tab === key ? 'rgba(74,158,255,0.12)' : 'var(--bg2)', color: tab === key ? 'var(--accent)' : 'var(--text3)' }}>{label}</button>)}</div>
    {tab === 'weekly' && <WeeklyReport onNavigate={onNavigate} />}
    {tab === 'monthly' && <PeriodArchive type="monthly" title="📅 月次レポート" description="月間の市場動向とテーマ循環を振り返ります。" />}
    {tab === 'quarterly' && <PeriodArchive type="quarterly" title="📈 四半期レポート" description="1〜3月、4〜6月、7〜9月、10〜12月の区分で中期トレンドを検証します。" />}
  </div>
}
