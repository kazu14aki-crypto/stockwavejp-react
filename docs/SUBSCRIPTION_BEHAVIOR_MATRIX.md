# サブスクリプション挙動確認

## 実装上の期待挙動

| 状態 | 操作 | 挙動 |
|---|---|---|
| 未契約 | Standard/Pro申込み | 法的文書・定期課金条件への同意後、Stripe Checkoutを1件作成 |
| 有効契約中・同一プラン | 現在のプランを表示 | 新しいCheckoutや二重契約を作らない |
| 有効契約中・別プラン | 変更 | Stripe Customer Portalへ移動 |
| 期間末解約予約中・同一プラン | 再契約 | `cancel_at_period_end=false`に戻し、既存契約を継続。新規契約・即時請求なし |
| 期間末解約予約中・別プラン | 変更 | Customer Portalで変更。新しいCheckoutは作らない |
| 契約期間終了後 | 再申込み | 新しいCheckoutと新しいSubscriptionを作成 |
| 支払失敗・past_due | 再申込み | 二重契約を防ぎ、Customer Portalで支払方法を修正 |
| Checkoutを途中離脱 | 再度申込み | 完了済みSubscriptionがない限り新しいCheckoutを作成可能 |
| Webhookの重複配信 | 同一イベント再処理 | `subscriptions`のupsertで同一ユーザーの状態を更新 |

## 本番前にStripeテストモードで確認する項目

1. 正常加入とWebhook反映
2. 期間末解約予約後も有効期限までPro/Standardが維持されること
3. 解約予約の取消しで同じSubscription IDが維持されること
4. 解約予約取消し時に即時請求・二重請求が発生しないこと
5. プラン変更時の日割り・請求タイミングがCustomer Portal設定と一致すること
6. カード決済失敗、Smart Retry、past_due、unpaidの権限制御
7. Webhook遅延・順序逆転・重複配信
8. 返金・チャージバック・アカウント削除

※ 静的コード監査は実施済みですが、Stripeのテストクロックを用いたE2E決済テストは別途必要です。
