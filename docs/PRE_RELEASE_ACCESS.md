# Pre-release access restriction

Do not use a React password modal as security. Static JavaScript and data remain downloadable.

Recommended:
1. Put stockwavejp.com and stockwavejp-en.com behind Cloudflare.
2. Cloudflare Zero Trust > Access > Applications > Add self-hosted application.
3. Add both domains.
4. Create an Allow policy restricted to the owner's Google account email.
5. Add a Block policy for everyone else.
6. Keep API and Supabase callback paths outside Access only when technically required.
7. Remove the Access application when launching publicly.

While private, disable advertising and analytics consent banners that expect public traffic.
