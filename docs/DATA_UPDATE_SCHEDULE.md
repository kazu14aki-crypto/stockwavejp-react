# Current GitHub data schedules (JST)

- fetch_edinet.yml: daily 20:30 JST (`30 11 * * *` UTC)
- fetch_edinet_holders.yml: Monday 06:00 JST (`0 21 * * 1` UTC, Sunday UTC)
- fetch_large_holdings.yml: Tuesday 20:30 JST (`30 11 * * 2` UTC)

The Institutional Intelligence page should display the `updated_at` value from saved JSON and analyse that snapshot. A search miss means 'not present in the latest saved snapshot', not necessarily 'no filing exists'.
