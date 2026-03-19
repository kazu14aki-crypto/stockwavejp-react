/**
 * RefreshIndicator — バックグラウンド更新中の表示
 * ページ上部に小さく表示し、ユーザーに更新中であることを伝える
 */
export default function RefreshIndicator({ refreshing, lastUpdate, onRefresh }) {
  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '11px', color: 'var(--text3)',
    }}>
      {refreshing ? (
        <>
          {/* 回転アニメーション */}
          <svg width="12" height="12" viewBox="0 0 12 12"
            style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
            <circle cx="6" cy="6" r="4.5" fill="none"
              stroke="var(--accent)" strokeWidth="1.5"
              strokeDasharray="14 7" />
          </svg>
          <span style={{ color: 'var(--accent)' }}>更新中...</span>
        </>
      ) : (
        <>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--green)', display: 'inline-block', flexShrink: 0,
          }} />
          {timeStr && <span>{timeStr} 時点</span>}
          {onRefresh && (
            <button onClick={onRefresh} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontSize: '11px', padding: '0 4px',
              fontFamily: 'var(--font)', textDecoration: 'underline',
            }}>
              再取得
            </button>
          )}
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
