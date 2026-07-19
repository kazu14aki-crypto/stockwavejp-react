import React from 'react'

function ErrorScreen({ error, onReset, pageName }) {
  const code = `SWJP-${Date.now().toString(36).slice(-6).toUpperCase()}`
  const copy = async () => {
    const text = [
      `エラーコード: ${code}`,
      `ページ: ${pageName || '不明'}`,
      `URL: ${window.location.href}`,
      `内容: ${error?.message || '不明なエラー'}`,
    ].join('\n')
    try { await navigator.clipboard.writeText(text); alert('エラー情報をコピーしました') }
    catch { window.prompt('以下をコピーしてください', text) }
  }
  return (
    <div role="alert" style={{ minHeight:'55vh', display:'grid', placeItems:'center', padding:'28px 16px' }}>
      <div style={{ width:'min(620px,100%)', background:'var(--bg2)', border:'1px solid rgba(255,100,100,.35)', borderRadius:'14px', padding:'28px', textAlign:'center' }}>
        <div style={{ fontSize:'38px', marginBottom:'10px' }}>⚠️</div>
        <h2 style={{ color:'var(--text)', fontSize:'20px', margin:'0 0 10px' }}>ページを正常に表示できませんでした</h2>
        <p style={{ color:'var(--text2)', fontSize:'13px', lineHeight:1.8, margin:'0 0 18px' }}>
          一時的な通信障害、古いキャッシュ、または画面処理のエラーが発生しました。<br/>
          入力内容は保存されていない場合があります。
        </p>
        <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={onReset} style={btn('var(--accent)','#fff')}>再読み込み</button>
          <button onClick={() => { window.location.hash=''; window.location.reload() }} style={btn('var(--bg3)','var(--text2)')}>ホームへ戻る</button>
          <button onClick={copy} style={btn('transparent','var(--text2)')}>エラー情報をコピー</button>
        </div>
        <div style={{ marginTop:'16px', color:'var(--text3)', fontSize:'10px' }}>エラーコード：{code}</div>
      </div>
    </div>
  )
}

const btn = (background,color) => ({ padding:'9px 14px', borderRadius:'7px', border:'1px solid var(--border)', background, color, cursor:'pointer', fontWeight:700, fontFamily:'var(--font)' })

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(error) { return { hasError:true, error } }
  componentDidCatch(error, info) {
    console.error('[StockWaveJP ErrorBoundary]', error, info)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) this.setState({ hasError:false, error:null })
  }
  render() {
    if (this.state.hasError) return <ErrorScreen error={this.state.error} pageName={this.props.pageName} onReset={() => window.location.reload()} />
    return this.props.children
  }
}
