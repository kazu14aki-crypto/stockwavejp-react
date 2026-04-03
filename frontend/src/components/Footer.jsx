import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
      padding: '20px 24px',
      marginTop: '40px',
      fontSize: '11px',
      color: 'var(--text3)',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'flex-start',
        gap: '16px',
      }}>
        {/* ロゴ・説明 */}
        <div style={{ maxWidth: '320px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>
            <span style={{ color: '#e63030' }}>Stock</span>WaveJP
          </div>
          <div style={{ lineHeight: 1.7 }}>
            日本株テーマ別投資情報サービス。掲載情報は情報提供を目的とし、
            投資助言・推奨を行うものではありません。
          </div>
        </div>

        {/* リンク */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text2)', marginBottom: '8px', fontSize: '11px' }}>法的情報</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a href="/#/disclaimer" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: '免責事項' })) }}
                style={{ color: 'var(--text3)', textDecoration: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                免責事項
              </a>
              <a href="/#/privacy" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'プライバシーポリシー' })) }}
                style={{ color: 'var(--text3)', textDecoration: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                プライバシーポリシー
              </a>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text2)', marginBottom: '8px', fontSize: '11px' }}>メニュー</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a href="/#/" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'ホーム' })) }}
                style={{ color: 'var(--text3)', textDecoration: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                ホーム
              </a>
              <a href="/#/themes" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'テーマ一覧' })) }}
                style={{ color: 'var(--text3)', textDecoration: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                テーマ一覧
              </a>
              <a href="/column.html"
                style={{ color: 'var(--text3)', textDecoration: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                コラム
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* コピーライト */}
      <div style={{
        maxWidth: '1280px', margin: '16px auto 0',
        paddingTop: '12px', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <span>© 2025 StockWaveJP. All rights reserved.</span>
        <span style={{ color: 'var(--text3)' }}>
          ※ 本サービスの情報は投資助言ではありません。投資は自己責任で行ってください。
        </span>
      </div>
    </footer>
  )
}
