# Googleログイン表示を「StockWaveJP」に変更する手順

現在表示される:
mhrfecweuvueoxkoderc.supabase.co に移動する

目標:
StockWaveJP に移動する
または認証先を auth.stockwavejp.com と表示する

## 重要

Googleの認証画面に表示される名称・ドメインは、React側の文言ではありません。
次の2段階が必要です。

### A. Google OAuthのアプリ名をStockWaveJPにする

Google Cloud Console
→ Google Auth Platform
→ Branding

設定:
- App name: StockWaveJP
- User support email: 運営用メール
- App logo: StockWaveJPロゴ
- App home page: https://stockwavejp.com
- Privacy policy: https://stockwavejp.com/privacy
- Terms of service: https://stockwavejp.com/terms
- Authorized domains: stockwavejp.com

保存後、必要に応じてBrand verificationを申請します。

### B. Supabaseの認証先ドメインを変更する

SupabaseのCustom Domainは有料プラン向け有料アドオンです。
推奨ドメイン:
auth.stockwavejp.com

Supabase Dashboard
→ Project Settings
→ General
→ Custom Domains

Supabaseが指定するCNAME/TXTレコードをドメイン管理画面へ追加し、
auth.stockwavejp.comを有効化します。

Google Cloud Console
→ Google Auth Platform
→ Clients
→ StockWaveJPのOAuth Client

Authorized redirect URIsに追加:
https://auth.stockwavejp.com/auth/v1/callback

既存URLは移行確認が終わるまで削除しない:
https://mhrfecweuvueoxkoderc.supabase.co/auth/v1/callback

Supabase
→ Authentication
→ URL Configuration

Site URL:
https://stockwavejp.com

Redirect URLs:
https://stockwavejp.com/**
http://localhost:5173/**

### C. StockWaveJPコードの切替

frontend/vite.config.js の次の値を変更:

変更前:
VITE_SUPABASE_AUTH_URL = https://mhrfecweuvueoxkoderc.supabase.co

変更後:
VITE_SUPABASE_AUTH_URL = https://auth.stockwavejp.com

本ZIPでは supabase.js が VITE_SUPABASE_AUTH_URL を優先するよう修正済みです。

## 費用をかけない場合

Custom Domainを契約しない場合でもGoogle Auth PlatformのBrandingで
アプリ名をStockWaveJPへ変更できます。ただしGoogle画面の一部には
Supabaseのプロジェクトドメインが残る可能性があります。

完全にランダムなSupabaseドメインを消すにはCustom Domainが必要です。
