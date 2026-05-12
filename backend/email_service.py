"""
email_service.py — Resend を使用した自動返信メール
pip install resend
Render.com環境変数: RESEND_API_KEY=re_xxxx
"""
import os
import resend
from datetime import datetime

resend.api_key = os.environ.get("RESEND_API_KEY", "")
FROM_ADDRESS   = "StockWaveJP <noreply@stockwavejp.com>"
SITE_URL       = "https://stockwavejp.com"
CONTACT_URL    = f"{SITE_URL}/#contact"
ABOUT_URL      = f"{SITE_URL}/#about"


# ─── 共通HTMLラッパー ─────────────────────────────────────────────
def _wrap(content_html: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<style>
  body {{ font-family: -apple-system, 'Helvetica Neue', sans-serif;
          background:#0d1117; color:#c9d1d9; margin:0; padding:0; }}
  .container {{ max-width:600px; margin:30px auto; background:#161b22;
                border:1px solid #30363d; border-radius:12px; overflow:hidden; }}
  .header {{ background:linear-gradient(135deg,#1a2236,#0d1117);
             padding:28px 32px; border-bottom:1px solid #30363d; }}
  .logo {{ font-size:20px; font-weight:800; color:#e8f0ff; }}
  .logo span {{ color:#ff5370; }}
  .body {{ padding:28px 32px; }}
  .section-title {{ font-size:13px; font-weight:700; color:#8b949e;
                    text-transform:uppercase; letter-spacing:0.08em;
                    margin:20px 0 8px; padding-bottom:6px;
                    border-bottom:1px solid #30363d; }}
  .info-table {{ width:100%; border-collapse:collapse; margin-bottom:16px; }}
  .info-table td {{ padding:7px 0; font-size:13px; vertical-align:top; }}
  .info-table td:first-child {{ color:#8b949e; width:140px; font-weight:600; }}
  .info-table td:last-child {{ color:#e8f0ff; }}
  .badge {{ display:inline-block; padding:3px 10px; border-radius:20px;
             font-size:11px; font-weight:700; background:rgba(74,158,255,0.15);
             color:#4a9eff; }}
  .btn {{ display:inline-block; padding:11px 24px; background:#4a9eff;
           color:#fff; text-decoration:none; border-radius:8px;
           font-size:13px; font-weight:700; margin:8px 0; }}
  .note {{ font-size:11px; color:#8b949e; line-height:1.7; margin-top:16px;
            padding:12px 14px; background:rgba(255,255,255,0.03);
            border-radius:6px; border-left:3px solid #30363d; }}
  .footer {{ padding:18px 32px; background:#0d1117; font-size:11px;
              color:#8b949e; text-align:center; border-top:1px solid #30363d; }}
  a {{ color:#4a9eff; }}
</style>
</head>
<body><div class="container">
  <div class="header">
    <div class="logo">Stock<span>Wave</span>JP</div>
    <div style="font-size:11px;color:#8b949e;margin-top:4px;">Japan Stock Theme Tracker</div>
  </div>
  <div class="body">{content_html}</div>
  <div class="footer">
    StockWaveJP &nbsp;|&nbsp; <a href="{SITE_URL}">{SITE_URL}</a><br>
    &copy; 2025 StockWaveJP. All Rights Reserved.
  </div>
</div></body></html>"""


# ─── ① 有料プラン加入確認メール ─────────────────────────────────
def send_subscription_email(
    user_email: str,
    user_name:  str,
    plan:       str,   # "スタンダード" or "プロ"
    billing:    str,   # "monthly" or "yearly"
    start_date: str,   # "2025-05-10"
    end_date:   str,   # "2025-06-10"
) -> bool:

    PLANS = {
        "スタンダード": {"monthly": (1180, 1073, 107), "yearly": (11800, 10727, 1073)},
        "プロ":         {"monthly": (1980, 1800, 180), "yearly": (19800, 18000, 1800)},
    }
    prices   = PLANS.get(plan, PLANS["スタンダード"])
    total, base, tax = prices.get(billing, prices["monthly"])
    billing_label = "月払い（毎月自動更新）" if billing == "monthly" else "年払い（毎年自動更新）"

    body = f"""
<p style="font-size:14px;color:#e8f0ff;margin-bottom:20px;">
  <strong>{user_name}</strong> 様<br><br>
  この度はStockWaveJPの有料プランにご加入いただき、<br>
  誠にありがとうございます。
</p>

<div class="section-title">📋 ご契約内容</div>
<table class="info-table">
  <tr><td>氏名</td><td>{user_name}</td></tr>
  <tr><td>メールアドレス</td><td>{user_email}</td></tr>
  <tr><td>契約プラン</td><td><span class="badge">{plan}プラン</span></td></tr>
  <tr><td>契約期間</td><td>{start_date} 〜 {end_date}</td></tr>
  <tr><td>お支払い方法</td><td>{billing_label}</td></tr>
</table>

<div class="section-title">💰 お支払い金額</div>
<table class="info-table">
  <tr><td>プラン料金（税抜）</td><td>¥{base:,}</td></tr>
  <tr><td>消費税（10%）</td><td>¥{tax:,}</td></tr>
  <tr><td style="font-weight:700;color:#e8f0ff;">合計（税込）</td><td style="font-weight:800;color:#4a9eff;font-size:16px;">¥{total:,}</td></tr>
</table>

<div class="section-title">🔄 自動更新について</div>
<p style="font-size:13px;color:#c9d1d9;line-height:1.8;margin-bottom:8px;">
  本プランは<strong>自動更新制</strong>です。契約期間終了日の翌日に自動的に同一プランが更新されます。<br>
  解約をご希望の場合は、契約期間終了日の<strong>前日まで</strong>に設定ページよりお手続きください。<br>
  <strong>契約期間中に解約された場合も、契約終了日まですべての機能を引き続きご利用いただけます。</strong>
</p>

<div style="text-align:center;margin:24px 0;">
  <a href="{ABOUT_URL}" class="btn">📊 料金・機能一覧を確認する</a>
</div>

<div class="note">
  📬 このメールに心当たりがない場合、または送信先のメールアドレスが間違っている可能性がある場合は、
  <a href="mailto:info@stockwavejp.com">info@stockwavejp.com</a> にご連絡の上、このメールを削除してください。
  第三者が誤って受信した場合、内容の転用・共有はお控えください。
</div>

<div style="margin-top:20px;font-size:13px;color:#8b949e;">
  ご不明な点は <a href="{CONTACT_URL}">お問い合わせページ</a> または
  <a href="mailto:info@stockwavejp.com">info@stockwavejp.com</a> までご連絡ください。
</div>
"""

    try:
        resend.Emails.send({
            "from":    FROM_ADDRESS,
            "to":      user_email,
            "subject": f"【StockWaveJP】ご加入ありがとうございます - {plan}プランのご確認",
            "html":    _wrap(body),
        })
        return True
    except Exception as e:
        print(f"[email] subscription mail error: {e}")
        return False


# ─── ② お問い合わせ自動返信メール ───────────────────────────────
def send_contact_autoresponse(
    user_email:   str,
    user_name:    str,
    inquiry_type: str,  # "機能について" | "料金について" | "不具合報告" | "その他"
    content:      str,
) -> bool:
    now = datetime.now().strftime("%Y年%m月%d日 %H:%M")
    content_escaped = content.replace('<', '&lt;').replace('>', '&gt;').replace('\n', '<br>')

    body = f"""
<p style="font-size:14px;color:#e8f0ff;margin-bottom:20px;">
  <strong>{user_name}</strong> 様<br><br>
  この度はStockWaveJPへお問い合わせいただき、<br>
  誠にありがとうございます。
</p>

<div class="section-title">📝 受付内容</div>
<table class="info-table">
  <tr><td>お名前</td><td>{user_name}</td></tr>
  <tr><td>メールアドレス</td><td>{user_email}</td></tr>
  <tr><td>お問い合わせ種別</td><td><span class="badge">{inquiry_type}</span></td></tr>
  <tr><td>受付日時</td><td>{now} JST</td></tr>
</table>

<div class="section-title">💬 お問い合わせ内容</div>
<div style="background:rgba(255,255,255,0.03);border-left:3px solid #4a9eff;
            padding:12px 16px;border-radius:0 6px 6px 0;
            font-size:13px;color:#c9d1d9;line-height:1.8;margin-bottom:20px;">
  {content_escaped}
</div>

<div class="section-title">📮 返信について</div>
<p style="font-size:13px;color:#c9d1d9;line-height:1.8;">
  内容を確認の上、<strong>通常3営業日以内</strong>にご返信いたします。<br>
  お問い合わせの内容や混雑状況によっては、お時間をいただく場合がございます。<br>
  あらかじめご了承ください。
</p>
<p style="font-size:12px;color:#8b949e;line-height:1.8;">
  ※ このメールは自動送信です。このメールへの返信はお受けできません。<br>
  追加のご連絡は <a href="{CONTACT_URL}">お問い合わせページ</a> よりお願いいたします。
</p>

<div style="text-align:center;margin:24px 0;">
  <a href="{SITE_URL}" class="btn">StockWaveJP を開く</a>
</div>

<div class="note">
  📬 このメールに心当たりがない場合は、お手数ですが
  <a href="mailto:info@stockwavejp.com">info@stockwavejp.com</a>
  までご連絡の上、このメールを削除してください。
</div>
"""

    try:
        resend.Emails.send({
            "from":    FROM_ADDRESS,
            "to":      user_email,
            "subject": "【StockWaveJP】お問い合わせを受け付けました（自動返信）",
            "html":    _wrap(body),
        })
        # 管理者にも通知
        resend.Emails.send({
            "from":    FROM_ADDRESS,
            "to":      "info@stockwavejp.com",
            "subject": f"[お問い合わせ] {inquiry_type} — {user_name}",
            "html":    _wrap(f"<p>差出人: {user_name} &lt;{user_email}&gt;</p><p>種別: {inquiry_type}</p><hr><p>{content_escaped}</p>"),
        })
        return True
    except Exception as e:
        print(f"[email] contact autoresponse error: {e}")
        return False
