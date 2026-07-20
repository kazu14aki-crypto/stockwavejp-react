# Stripe サブスクリプション管理設定

StockWaveJPでは、新規加入だけをStripe Checkoutで作成し、既存契約のプラン変更・解約はCustomer Portalで行います。
これにより、スタンダード契約中にプロのCheckoutを新規作成して二重契約になることを防ぎます。

## Stripe Dashboardで必要な設定

Stripe Dashboard → Billing → Customer portal → Features

1. Payment methods: ON
2. Invoice history: ON
3. Switch plan: ON
4. Standard（月額980円）とPro（月額1,980円）のProduct/Priceを選択
5. Prorate subscription updates: ON
   - プラン変更は即時反映
   - 残期間はStripeが日割り請求・クレジット処理
6. Cancel subscription: ON
7. Cancellation mode: At end of billing period
   - 契約期間終了までは有料機能を利用可能
   - 終了後にFreeへ移行
8. Default redirect link: https://stockwavejp.com

## 動作確認

Stripeのテストモードで次を確認します。

- Free → Standard: Checkoutが1件作成される
- Free/体験 → Pro: Checkoutが1件作成される
- Standard → Pro: 新規CheckoutではなくCustomer Portalが開く
- Pro → Standard: 新規CheckoutではなくCustomer Portalが開く
- 解約: cancel_at_period_end=trueになり、Webhookでsubscriptions.statusがcancelingになる
- 契約終了: customer.subscription.deletedでstatusがcanceledになる
- 既存契約中にcreate-checkoutを直接呼ぶ: HTTP 409で拒否される
- 別ユーザーIDをbodyへ入れる: HTTP 403で拒否される

## Webhook

最低限、次のイベントを登録します。

- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
- invoice.paid

Customer Portalのプラン変更機能は初期状態ではOFFです。コードを公開しただけでは変更できないため、Stripe Dashboard側の設定も必ず行ってください。
