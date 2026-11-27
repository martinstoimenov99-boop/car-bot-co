# Car Bot website (getcarbot.co)

Marketing site for **Car Bot**, the managed buying bot for used-car importers and dealers in the Balkans. It sells the service, collects free-test and plan requests, and recruits partners.

- **Stack:** Next.js 16 (App Router) + TypeScript, Tailwind CSS 4, next-intl (EN + MK), Resend, zod, Vercel Analytics + Speed Insights (cookieless)
- **Design source of truth:** `design/Main.dc.html`, `design/Partners.dc.html`, `design/Thanks.dc.html` (open them in a browser)
- **Brief:** `design/CLAUDE_CODE_PROMPT.md`

## Quick start

```bash
pnpm install
cp .env.example .env.local   # everything is optional for local dev
pnpm dev                     # http://localhost:3000 → redirects to /en or /mk
```

| Command                                        | What it does                                                                                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Dev server                                                                                                                                                        |
| `pnpm build && pnpm start`                     | Production build and server                                                                                                                                       |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | TypeScript, ESLint, Prettier                                                                                                                                      |
| `pnpm test`                                    | Vitest unit tests (`tests/unit`: calculators, validation, ref cookie, lead delivery, email templates)                                                             |
| `pnpm i18n:check`                              | Fails if any `messages/*.json` misses a key, array item or placeholder from `en.json`                                                                             |
| `pnpm test:e2e`                                | Playwright smoke tests against `pnpm start` (run `pnpm build` first). `E2E_BASE_URL=https://<preview>.vercel.app pnpm test:e2e` tests a deployed preview instead. |

CI (`.github/workflows/ci.yml`) runs install → typecheck → lint → format → unit tests → i18n check → build → Playwright.

## Project map

```
app/[locale]/            pages: / , /partners, /thanks, /privacy, /terms, /cookies, 404, OG images
app/api/lead|partner/    POST endpoints
app/sitemap.ts robots.ts sitemap with hreflang, robots
components/home|partners|forms|layout|legal|ui
i18n/                    locales, routing, request config
messages/en.json mk.json all copy (no hard-coded copy in components)
lib/calc.ts              ROI + partner commission maths (tested)
lib/validation.ts        client-safe checks; lib/schemas.ts = server zod schemas
lib/leads.ts             where submissions go (sinks), lib/email.ts + lib/emails/templates.ts
lib/affiliate/           partner-tracking provider adapter
lib/ref.ts ref-client.ts ?ref= capture and cb_ref cookie
proxy.ts                 locale redirect + ref cookie (Next 16's name for middleware)
public/images/           the 6 photos (see below)
```

## Photos

Drop these into `public/images/` (JPG, ideally 2400px wide for the two full-width ones, 1600px for the rest). Until a file exists, a dark grey block of the same size is rendered, so nothing shifts when it lands. `next/image` serves AVIF/WebP with proper `sizes`; only the hero is preloaded.

| File                    | Where                                |
| ----------------------- | ------------------------------------ |
| `hero-night-passat.jpg` | Hero background                      |
| `busy-dealer.jpg`       | “What you’re missing”                |
| `nightstand-phone.jpg`  | “What your bot does every day”       |
| `handshake.jpg`         | “The bot opens the door”             |
| `dealer-on-call.jpg`    | “We build it, run it and pay for it” |
| `transporter-dawn.jpg`  | Final call to action                 |

Photos are checked at build time, so redeploy after adding them.

## Environment variables

All listed in `.env.example`. Set them in **Vercel → Project → Settings → Environment Variables** (Production and Preview). Never commit real values.

| Variable                                                         | Needed for                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`                                                 | Sending email. **Without it the site runs in log-only mode** (emails printed to the server log).       |
| `RESEND_FROM`                                                    | Sender, e.g. `Car Bot <hello@getcarbot.co>` (domain must be verified in Resend)                        |
| `LEAD_NOTIFY_EMAIL`                                              | Where new leads go. Also the reply-to of confirmation emails.                                          |
| `PARTNER_NOTIFY_EMAIL`                                           | Where partner applications go (falls back to `LEAD_NOTIFY_EMAIL`)                                      |
| `RESEND_AUDIENCE_ID`, `RESEND_PARTNER_AUDIENCE_ID`               | Resend segment (formerly audience) to add contacts to. Optional.                                       |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`, `PARTNER_WEBHOOK_URL` | Optional POST of the full submission JSON, header `x-webhook-secret`                                   |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`             | Shared rate limit (5 / hour / IP / form). Without them an in-memory limit per server instance is used. |
| `NEXT_PUBLIC_WA_NUMBER`                                          | `38978662817`                                                                                          |
| `NEXT_PUBLIC_SITE_URL`                                           | `https://getcarbot.co` (canonical URLs, sitemap, OG)                                                   |
| `AFFILIATE_PROVIDER`                                             | `none` (default), `dub`, `tolt`, `firstpromoter`, `rewardful`                                          |
| `PARTNER_PORTAL_URL`                                             | Shows “Partner login” in header and footer when set (https only)                                       |
| `LEGAL_*`                                                        | Fill the `{{PLACEHOLDERS}}` on the legal pages without touching code                                   |

### What happens on a form submit

`POST /api/lead` (free test, monthly, yearly) and `POST /api/partner`:

1. Body over 16 KB → 413. Honeypot field `website` filled → `200 {ok:true}`, nothing happens.
2. Rate limit (5 per hour per IP and route) → 429.
3. Server-side zod validation (trimmed, length-capped, mobile.de-only searches) → 400 with a generic message.
4. Partner ref from the body, otherwise from the `cb_ref` cookie.
5. In parallel: notification email to you (table of all fields, clickable searches, ref, locale, time, `wa.me` link), localized confirmation email to the lead, Resend contact, webhook, affiliate provider.
6. `{ok:true}` when **at least one** of notification email or webhook succeeded; otherwise 502 and the browser shows the error plus a prefilled WhatsApp button. Details are only logged server-side.

### Testing forms locally

- Leave `RESEND_API_KEY` empty: emails are printed in the `pnpm dev` terminal.
- To send real mail, set a key and use Resend’s test inboxes as the recipient (`delivered@resend.dev`), or your own address once the domain is verified.
- Quick API test:

```bash
curl -X POST http://localhost:3000/api/lead -H 'Content-Type: application/json' -d '{"type":"test","firstName":"Test","lastName":"Lead","email":"delivered@resend.dev","phone":"+389 70 000 000","searches":["https://suchen.mobile.de/fahrzeuge/search.html?ms=25200"],"consent":true,"locale":"en"}'
```

## Languages

Copy lives in `messages/<locale>.json`, one namespace per area (`common`, `forms`, `home`, `faq`, `partners`, `thanks`, `legal`, `emails`). Macedonian review notes are in `TRANSLATION_NOTES.md`.

**Add a language (e.g. Serbian):**

1. `cp messages/en.json messages/sr.json` and translate the values (keep keys, `{placeholders}`, `<b>` tags and `{{LEGAL}}` tokens).
2. Add `"sr"` to `LOCALES` and a label to `LOCALE_LABELS` in `i18n/config.ts`.
3. `pnpm i18n:check`. The switcher, routes (`/sr/...`), hreflang, sitemap and emails pick it up automatically.
4. Albanian (`sq`) uses the Latin script, so Archivo works. Serbian Cyrillic would need the same heading-font switch as Macedonian (see `app/globals.css`, `html[lang="mk"]`).

**Prices:** English shows `€3,000`; Macedonian shows `3.000 €` everywhere (copy and `lib/format.ts`).

## Partner (affiliate) tracking

1. **Capture:** `?ref=CODE` or `?partner=CODE` (`^[A-Za-z0-9_-]{2,32}$`). Before cookie consent the code is kept for the browser tab only (sessionStorage). After “Accept”, it is stored in the `cb_ref` cookie (90 days, SameSite=Lax, Secure) and in localStorage. **First click wins**, unless the stored click is older than 30 days. Once consent exists, `proxy.ts` sets the cookie server-side too.
2. **Attribute:** the ref goes into the lead email, the Resend contact properties, the webhook payload and the affiliate provider call.
3. **Discount:** the plan modal has an optional code field, prefilled from the ref, and shows “10% off setup and monthly” when filled. No prices are computed on the site; apply the discount when invoicing (or with a Stripe coupon).
4. **Provider:** `lib/affiliate/index.ts` picks an implementation by `AFFILIATE_PROVIDER`. `none` is complete. `dub`, `tolt`, `firstpromoter` and `rewardful` are stubs with TODOs and links to their APIs. Implement `trackLead` (and `trackSale` for manual sales) in `lib/affiliate/providers.ts`.

### Which tool?

Some clients will pay by bank transfer or invoice, so the tool must let you **record a sale manually or via API**, not only through Stripe. The commission rules are also unusual: a one-off €150, 20% recurring capped at 12 months, a €50 bonus at month 6, and a flat €800 for yearly plans.

| Tool              | Non-Stripe sales                            | Fit                                                                                                                |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **FirstPromoter** | Manual commissions and a sales/tracking API | Flexible reward rules (one-off + recurring with a month cap), mature partner portal, payouts via PayPal/Wise/bank. |
| **Dub Partners**  | `track/sale` API for any payment            | Modern dashboard, strong link tracking, good if you also want branded short links.                                 |
| **Tolt**          | API conversions                             | Simple and affordable, Stripe/Paddle-first.                                                                        |
| **Rewardful**     | Limited (Stripe-native)                     | Great if everything goes through Stripe; weak fit for invoices.                                                    |

**Recommendation:** FirstPromoter, because it handles manual sales and the capped-recurring + bonus rules without workarounds. Dub Partners is the runner-up. Check current pricing and features before signing up; this table reflects the tools as of late 2026. The partner dashboard itself is the tool’s portal: put its URL in `PARTNER_PORTAL_URL`.

## Deploy (Vercel)

Current setup: Vercel project **`car-bot-co`** (team “Martin’s projects”), production branch **`main`** (Vercel → Project → Settings → Environments → Production → Branch Tracking), domains `getcarbot.co` and `www.getcarbot.co`. Every other branch gets a preview deployment; production changes only by merging into `main`.

1. Import the GitHub repo in Vercel (framework: Next.js, install `pnpm install`, build `pnpm build`).
2. Add the environment variables for **Production** and **Preview**.
3. Domains: attach `getcarbot.co` to the project and redirect `www.getcarbot.co` → `getcarbot.co`.
4. Every PR gets a preview URL. Run the smoke tests against it: `E2E_BASE_URL=https://<preview-url> pnpm test:e2e`. Previews behind Vercel Authentication need a logged-in browser state: open a share link (Vercel → Deployment → Share) in Playwright, save it with `context.storageState({ path })`, and pass `E2E_STORAGE_STATE=<path>`.
5. Merge to `main` → production.
6. After the first production deploy: submit `https://getcarbot.co/sitemap.xml` in Google Search Console, and send one real free-test and one partner form to check emails, the Resend contact and the webhook.

## Resend domain checklist

1. Resend → **Domains → Add domain**. Use `getcarbot.co` (or `mail.getcarbot.co` to keep the root domain’s reputation separate). Pick the EU region.
2. Resend shows the exact records. Add them in **Vercel → Domains → getcarbot.co → DNS Records**. They look like this (copy the real values from Resend, especially the DKIM key):

| Type | Name                | Value                                                 | Notes                                                             |
| ---- | ------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| MX   | `send`              | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) | Bounce handling                                                   |
| TXT  | `send`              | `v=spf1 include:amazonses.com ~all`                   | SPF                                                               |
| TXT  | `resend._domainkey` | `p=MIGfMA0GCSq…` (from Resend)                        | DKIM                                                              |
| TXT  | `_dmarc`            | `v=DMARC1; p=none; rua=mailto:dmarc@getcarbot.co`     | Start with `p=none`, move to `quarantine` after a few clean weeks |

With a `mail.` subdomain the names become `send.mail`, `resend._domainkey.mail`, and so on. 3. Wait for **Verified** in Resend (minutes to a few hours). 4. Set `RESEND_FROM="Car Bot <hello@getcarbot.co>"` (the address must be on the verified domain) and redeploy. 5. Send a test lead to yourself and check the message lands in the inbox, not spam (Gmail → “Show original” → SPF, DKIM and DMARC all PASS). 6. Create segments in Resend for leads and partners and put their IDs in `RESEND_AUDIENCE_ID` / `RESEND_PARTNER_AUDIENCE_ID`. Optional: create contact properties `ref`, `lead_type`, `discount_code`, `locale`, `source` so the ref shows on each contact. If a property does not exist, the contact is still added without it.

## Security and privacy

- Security headers in `next.config.ts`: CSP (self + Vercel analytics only; fonts are self-hosted), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, HSTS in production. Scripts need `'unsafe-inline'` because Next.js’ bootstrap is inline and nonces would make every page dynamic.
- The site never takes card details. Payments are arranged on WhatsApp.
- Cookies: essential only by default (`NEXT_LOCALE`, `cb_consent`); `cb_ref` only after “Accept”. Analytics are cookieless.
- Legal pages are **drafts** with `{{PLACEHOLDERS}}`. Have a lawyer review them (EN and MK) before launch.

## Content guardrails

No “100% legal”, “guaranteed” or “risk-free”. Earnings are always examples with the disclaimer. The ticker keeps its “Example activity” label and is never presented as live. No tool or vendor names behind the bot. The “20+ marketplaces” claim has `TODO(Martin)` comments next to it: keep it true.
