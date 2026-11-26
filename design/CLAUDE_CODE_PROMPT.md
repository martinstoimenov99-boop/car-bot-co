# TASK: Build the Car Bot website (getcarbot.co)

You are building the production website for **Car Bot**, a managed automation service for used-car importers and dealers in the Balkans. Read this whole file before writing code. Work in small steps, commit after each step, and run the app and its tests before moving on.

## 0. Inputs in this repo
- `design/Main.dc.html`, `design/Partners.dc.html`, `design/Thanks.dc.html`: the approved design prototypes. They are plain HTML with inline styles and a small `<script type="text/x-dc">` logic class. **They are the source of truth for layout, copy, spacing, colours and interaction.** Open them in a browser (or read them) and reproduce them faithfully as React components. Ignore the `{{ }}`, `<sc-if>`, `<sc-for>` and `<helmet>` syntax: it is just the prototype's templating. Convert it to React.
- `public/images/`: Martin will drop in 6 photos. Expected names and where they go:
  - `hero-night-passat.jpg`: hero background (dark gradient over it)
  - `busy-dealer.jpg`: "What you're missing" section
  - `nightstand-phone.jpg`: "What your bot does every day"
  - `handshake.jpg`: "The bot opens the door"
  - `dealer-on-call.jpg`: "We build it, run it and pay for it"
  - `transporter-dawn.jpg`: final CTA background
  Until they exist, render a dark grey placeholder with the same dimensions. Use `next/image`, WebP/AVIF, correct `sizes`, `priority` only on the hero.
- Contact: WhatsApp **+389 78 662 817** → links use `https://wa.me/38978662817`. Domain: **getcarbot.co** (already on Vercel). Business is based in Skopje, North Macedonia.

## 1. What the product is (so copy decisions stay right)
Car Bot is a managed service. A bot scouts 20+ European car marketplaces 24/7, and when a good car appears it sends the seller the first message in the seller's own language (German is the main example; Dutch, French, Italian, Swedish and other EU languages also work), in the client's name. When the seller replies, the client gets a WhatsApp ping and takes over (price, negotiation, transport). We install, teach, maintain and pay for all tools. The website sells this to car importers/dealers and recruits partners (affiliates) who bring dealerships.

Pricing (EUR):
- Monthly plan: **€500 setup + €250/month**. Cancel any month.
- Yearly plan: **€3,000/year**, setup free ("2 months on us"). Monthly route costs €3,500 in year one.
- Free test: up to 3 **mobile.de** search links, free, no card. We run it on our side and contact sellers from our own account, in our own words, on the lead's behalf. Paid bots send in the client's name.
- Payments: Stripe, bank transfer or invoice. Handled by Martin manually for now. The website never takes card details.

Partner program:
- Partner earns **€150** setup share (30% of €500) + **€50/month** for up to 12 months (20% of €250) + **€50 bonus** if the dealership is still a paying client at month 6 = **€800 per dealership in year one**.
- Yearly-plan dealerships: partner earns a **flat €800, paid once we receive the dealership's payment**.
- Dealership gets **10% off** setup and monthly with the partner's code. The discount never reduces the partner's commission.
- Monthly payout timing is NOT decided yet. Keep the existing wording ("details in your welcome package"). Do not invent a schedule.

## 2. Stack (decided, do not swap without asking)
- **Next.js (latest stable, App Router) + TypeScript**, deployed on **Vercel**.
- **Tailwind CSS**. Fonts via `next/font/google`: **Archivo** (700/800, headings), **Inter** (400/600, body).
- **next-intl** for i18n (locales: `en` default, `mk`). Structure so `sr` and `sq` can be added later by dropping in a JSON file.
- **Resend** for email (SDK `resend`), **zod** for validation, **react-hook-form** optional.
- **Vercel Analytics** + **Vercel Speed Insights**. No third-party trackers.
- Package manager: pnpm. Lint: ESLint + Prettier. Tests: Vitest (unit) and Playwright (smoke).
- No database in v1. Leads go to email + Resend Audience + an optional webhook (section 7). Keep a small `lib/leads.ts` interface so Supabase can be added later.

## 3. Routes
All under a locale prefix (`/en/...`, `/mk/...`), with `/` redirecting to the visitor's locale (default `en`).
- `/` Landing page (from `Main.dc.html`)
- `/partners` Become a partner (from `Partners.dc.html`)
- `/thanks` Thank-you page (from `Thanks.dc.html`). Accepts `?type=test|monthly|yearly|partner` and shows matching wording.
- `/privacy`, `/terms`, `/cookies`: legal pages (section 11)
- `/api/lead` and `/api/partner`: POST endpoints (section 7)
- `sitemap.xml`, `robots.txt`, OG images (`opengraph-image.tsx`), `hreflang` alternates, `404` page.

## 4. Design tokens
- Backgrounds: `#111418` (page), `#1B1F25` (raised dark), `#1A140E` (warm dark, free-test band), `#0B141A` (chat/phone), `#F3EEE6` (cream sections)
- Text: `#F2EEE7`, muted `#B9B3A8`, `#D9D3C8`, `#8FA3AD`; on cream `#1D2026`, muted `#4F4A42`
- Accent orange `#F08A3C` (hover `#FFB27A`), darker orange text on cream `#A34E12`, WhatsApp green `#25D366`, chat bubble `#1F2C34`, outgoing bubble `#005C4B`
- Radius: cards 22px, pills 999px, phone 44px. Container max 1200px, side padding 24px (20px on mobile).
- Type: h1 `clamp(38px, 10.4vw, 68px)`, h2 `clamp(30px, 7.4vw, 50px)`, lead 20px (17px on mobile).
- The look must NOT feel like generic SaaS: real photos, warm dark, WhatsApp-style chats. Keep it.
- Mobile first. Test at 360, 390, 768, 1280. On mobile: header shows only logo + WhatsApp button; hero photo overlay is a flat 86% dark layer so text stays readable; full-width CTA buttons; section padding 56px.

## 5. Page sections (order matters). Copy lives in the design files; move it into the message files.
**Landing (`/`)**: header (logo, How it works, Free test, Partners, Pricing, FAQ, WhatsApp pill with pulse) → hero (photo bg, h1 "Be the first buyer every seller hears from.", lead, CTAs "Try it free on 3 cars" + "See how it works", stats 20+ / 24/7 / Minutes, animated phone) → **Example activity ticker** → "What you're missing" → "One morning with your bot" (4 timestamped cards 07:02 / 07:03 / 07:26 / 07:27) → **Free test box** (section 6.3) → "What your bot does every day" → "The bot opens the door. You close the deal." → "From first call to first message in 48 hours" (4 steps) → "No tech on your side" → "What you pay for" (6 cards) → **ROI calculator** (6.4) → Pricing (monthly pair, monthly CTA, yearly card with CTA) → Safety block → FAQ (all questions in the design) → final CTA with transporter photo → footer (getcarbot.co, Partners link, privacy/terms/cookies).

**Partners (`/partners`)**: hero → "What you earn" (4 cards) → "You bring the introduction. We carry the weight." (your part / our part) → "How it works" (4 steps) → **Partner calculator** (6.5) → "Everything you need to sell it" (6 cards + honesty line) → **Application form** (7.2) → Partner FAQ → footer.

**Thanks (`/thanks`)**: confirmation, WhatsApp + home buttons, 3 next steps, partner promo.

## 6. Interactive components (exact behaviour)

### 6.1 Hero phone: looping chat (pure CSS, no JS)
18-second loop. Bubbles appear in this order with fade/slide-in, all fade out at the end and restart:
1. Bot: "New car found · VW Passat B8 2.0 TDI, 2017 · 142,000 km · €9,900 · listed 1 min ago" (07:02), visible 5%→94%
2. Typing bubble "Car Bot is writing in German…" with 3 animated dots, 12%→20%
3. Bot: "Message sent to the seller in German, in your name ✓" (07:03), 21%→94%
4. Typing bubble "Seller is typing…", 30%→44%
5. Seller reply: "**Seller replied:** “Ja, der Wagen ist noch da. Rufen Sie gerne an.”" (07:26), 45%→94%
6. Bot: "You're first in line. Seller's number and listing below. Your turn 👇", 56%→94%
7. User (right, green): "Calling him now 🔥" (07:27 ✓✓), 68%→94%
Respect `prefers-reduced-motion`: show all bubbles static, hide typing bubbles. The phone floats gently (6s ease-in-out).

### 6.2 Example-activity ticker
Full-width marquee strip under the hero with a fixed "EXAMPLE ACTIVITY" label on the left. Items loop endlessly (duplicate the list, translateX 0 → -50%, 46s linear). Items: VW Passat B8 · München · message sent in 41 s ✓ / Audi A4 Avant · Wien · sent in 38 s ✓ / Škoda Octavia · Amsterdam · sent in 49 s ✓ (Nederlands) / Peugeot 3008 · Lyon · sent in 44 s ✓ (Français) / Fiat 500X · Milano · sent in 36 s ✓ (Italiano) / Volvo V60 · Göteborg · sent in 52 s ✓ (Svenska) / BMW 320d · Köln · sent in 40 s ✓. **It is illustrative, so the "Example activity" label must always stay visible.** Never present it as live data.

### 6.3 Free-test lead flow
Chat-style card: bot bubble "Drop your mobile.de searches here. One link per row, up to 3. Only mobile.de for this free test.", a textarea, live counter "N of 3 searches", button "Find my first cars".
- Validate: 1–3 non-empty lines, each must match `^https?://([a-z0-9-]+\.)*mobile\.de/`. Messages: "Paste at least one mobile.de search link." / "Up to 3 searches for the free test. Remove a row." / "Only mobile.de links for now. One link per row."
- On success open a modal: name, surname, email, WhatsApp number (with country code), consent checkbox ("I agree that Car Bot uses my details and links to run this test and contact me about it."). Fields required; consent required. Validate email and phone (≥7 digits).
- Submit → `POST /api/lead` with `type: "test"`. On success show confirmation modal with "Continue →" to `/thanks?type=test`. On network failure show the error and a WhatsApp fallback link prefilled with the details.
- Small print under the card (keep): "For the free test we contact sellers from our own account, in our own words, on your behalf. In your paid bot, every message goes out in your name."

### 6.4 Plan picker (pricing)
Buttons "Choose monthly: €500 + €250 / month" and "Choose yearly" open the same modal with copy for the plan ("Almost there. Who are we setting up?", plan summary, "Confirm my plan"). Submit → `POST /api/lead` with `type: "monthly" | "yearly"`. Confirmation text: "Got it. We'll message you on WhatsApp with the payment link (card, bank transfer or invoice) and a time for your setup call." No payment is taken on the site.

### 6.5 Calculators
**ROI calculator (landing)**: sliders `extra` 0–6 step 1 (default 1) "Extra cars you win per month", `margin` 1000–2500 step 100 (default 1500) "Your profit per car", toggle plan yearly/monthly. 
```
gain = extra * margin * 12
cost = plan === "yearly" ? 3000 : 3500
net = gain - cost
cars = ceil(cost / margin)          // "Your whole first year is covered by N extra car(s) at €X profit each."
monthsCovered = floor(margin / 250) // "One extra car pays about N months of the monthly fee."
```
Show gain, cost, two bars scaled to max(gain, cost), and net (green if ≥ 0, orange with "−" if negative). Disclaimer stays: "An example, not a promise. Real results depend on the cars you buy, the prices you negotiate and how fast you close."

**Partner calculator**: slider `clients` 1–6 per month (default 2). Per "1 client/month" cohort over a 12-month window:
```
perClient = sum for m=1..12 of ( 150 + 50*(13-m) + ((13-m) >= 6 ? 50 : 0) )   // = 6050
yearTotal = perClient * clients
totalClients = clients * 12
monthlyAt12 = clients * 12 * 50
```
Show yearTotal, monthlyAt12, total dealerships, and "Per dealership, first 12 months: €800". Keep the disclaimer ("An example, not a promise…"). Put this math in `lib/calc.ts` with Vitest tests (clients=2 → yearTotal 12,100; monthlyAt12 1,200).

## 7. Forms, email and API

### 7.1 `POST /api/lead`
Body (zod): `{ type: "test"|"monthly"|"yearly", firstName, lastName, email, phone, searches?: string[] (1–3 mobile.de URLs, required when type==="test"), consent: true, locale, ref?: string, website?: string /*honeypot*/ }`
Behaviour:
1. Reject if honeypot filled (return 200, do nothing). Rate limit by IP (e.g. 5/hour; Upstash Ratelimit if `UPSTASH_REDIS_REST_URL` is set, otherwise an in-memory fallback) and return 429.
2. Re-validate everything server-side. Never trust the client. Trim and cap lengths (names 80, email 254, phone 20, URLs 2,000).
3. Resolve the affiliate ref (section 8): from body, else from the `cb_ref` cookie.
4. Send **two emails via Resend**: 
   - To `LEAD_NOTIFY_EMAIL`: subject `New Car Bot lead: {type} · {firstName} {lastName}`; a clean table of all fields, the searches as clickable links, the ref code, locale, timestamp, and a WhatsApp deep link to the lead (`https://wa.me/{digits}`).
   - To the lead (confirmation, in their locale): plain, short, human. Test: "We got your searches and we're on it. When a seller answers you'll get a WhatsApp from us." Plans: "We'll message you on WhatsApp with the payment link and a time for your setup call." Include WhatsApp contact. Reply-to = `LEAD_NOTIFY_EMAIL`.
5. Add the contact to the Resend Audience `RESEND_AUDIENCE_ID` (if set) with first/last name and email.
6. If `LEAD_WEBHOOK_URL` is set, POST the full lead JSON to it with header `x-webhook-secret: LEAD_WEBHOOK_SECRET`. Martin will connect his own automation here, which runs the searches. Failure of the webhook must not fail the request; log it.
7. Return `{ ok: true }`. Return a generic error message on failure and log the details server-side. Never leak stack traces or keys.

### 7.2 `POST /api/partner`
Body: `{ firstName, lastName, email, phone, country, how: "calls"|"social"|"community"|"network"|"other", consent: true, locale, website? }`. Same protections as above. Emails: notify Martin (`PARTNER_NOTIFY_EMAIL`, falls back to `LEAD_NOTIFY_EMAIL`) and send the applicant a welcome email: "Welcome aboard. We'll message you on WhatsApp with your link, your code and your welcome package." Add to a separate Resend audience `RESEND_PARTNER_AUDIENCE_ID` if set. Optional `PARTNER_WEBHOOK_URL`.

### 7.3 Env vars (create `.env.example`, never commit real values)
`RESEND_API_KEY`, `RESEND_FROM` (e.g. `Car Bot <hello@getcarbot.co>`), `LEAD_NOTIFY_EMAIL`, `PARTNER_NOTIFY_EMAIL`, `RESEND_AUDIENCE_ID`, `RESEND_PARTNER_AUDIENCE_ID`, `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`, `PARTNER_WEBHOOK_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_WA_NUMBER=38978662817`, `NEXT_PUBLIC_SITE_URL=https://getcarbot.co`, `AFFILIATE_PROVIDER` (`none|dub|tolt|firstpromoter|rewardful`), plus whatever the chosen provider needs.
Resend domain: verify `getcarbot.co` (or a `mail.` subdomain) with SPF, DKIM and DMARC. Give Martin the exact DNS records to add in Vercel, and a checklist.

## 8. Affiliate (partner) tracking
Goal: every lead and signup can be traced to the partner who brought them, with a 10% dealer discount code.
1. **Capture**: middleware reads `?ref=CODE` (also `?partner=CODE`), validates `^[A-Za-z0-9_-]{2,32}$`, and sets a first-party cookie `cb_ref` (90 days, `SameSite=Lax`, `Secure`). First click wins unless a later one is newer than 30 days. Only set it after the visitor accepts the cookie banner (the ref cookie counts as functional but state it in `/cookies`). Also keep it in `localStorage` as a fallback.
2. **Attribute**: the lead API attaches `ref` to emails, Audience contact tag and webhook payload.
3. **Discount code**: a code field on the signup modal (optional, prefilled from the ref, e.g. `PARTNERNAME10`). Display "10% off setup and monthly" when a ref/code is present. Do not compute prices server-side. Martin applies the discount manually when invoicing (or via a Stripe coupon).
4. **Provider adapter**: create `lib/affiliate/index.ts` with an interface `AffiliateProvider { trackLead(lead): Promise<void>; trackSale?(...) }` and implementations: `none` (default: cookie + email only), and stubs with TODOs for `dub` (Dub Partners), `tolt`, `firstpromoter`, `rewardful`. Pick by `AFFILIATE_PROVIDER`. Do not hard-wire a vendor yet. In the README include a short comparison and recommendation. Constraint to mention: many tools track Stripe payments automatically, but some clients will pay by bank transfer or invoice, so the chosen tool needs a way to record a sale manually or via API.
5. The partner dashboard is provided by the affiliate tool. Link the "Partner login" button in the header/footer to `PARTNER_PORTAL_URL` if set, otherwise hide it.

## 9. i18n (English + Macedonian)
- Use `next-intl`; message files `messages/en.json` and `messages/mk.json`, namespaced per page (`common`, `home`, `partners`, `thanks`, `faq`, `legal`, `emails`). **No hard-coded copy in components.** First extract all English copy from the design files into `en.json`.
- Language switcher in the header (EN / МК), persisted in a cookie, `hreflang` alternates and localized metadata/OG per page.
- **Write `mk.json` yourself** (Macedonian, Cyrillic), then list every string you were unsure about in `TRANSLATION_NOTES.md` so Martin (a native speaker) can review. Rules:
  - Address the reader with formal **Вие**, warm and direct, short sentences, no corporate jargon, no calques from English.
  - Keep as Latin/untranslated: Car Bot, WhatsApp, Telegram, mobile.de, AutoScout24, Kleinanzeigen, Facebook Marketplace, GDPR, AI. Prices stay `€500`, `€250`, `€3,000`, `€800` (use `€` and normal thousands separators for MK: `3.000 €` is acceptable only if used consistently, so pick one and apply it everywhere).
  - Glossary: dealer/importer → дилер / увозник на возила; seller → продавач; listing → оглас; marketplace → платформа / огласник; bot → бот; setup → поставување; message → порака; first message → прва порака; ping → известување; partner → партнер; affiliate program → партнерска (афилијат) програма; dealership → автокуќа; used car → половно возило.
  - Seller-facing example messages in the design (e.g. the German message) stay in the seller's language and are not translated.
- Email templates are localized too (lead's `locale`).
- Add a `scripts/check-i18n.ts` that fails CI if `mk.json` is missing any key present in `en.json`.

## 10. Copy and compliance guardrails (non-negotiable)
- Do **not** write "100% legal", "guaranteed", "risk-free" or claim any marketplace's approval. Safety copy stays as in the design: built to follow marketplace rules and EU data protection (GDPR); the bot stops when a platform asks for a check; the client stays in control; if something goes wrong we answer and start fixing within 24 hours at our cost.
- Earnings are always shown as examples with the disclaimer. No fake testimonials, fake logos, fake counts or fake "live" data. The ticker keeps its "Example activity" label.
- Do not state the pilot/manual onboarding of first clients on the page. The free test is the only trial offer.
- Do not name the underlying tools (LLM vendors, automation tools). "Bot" and "AI helpers" only.
- Marketplace claims ("20+ marketplaces") stay as written but are Martin's responsibility to keep true. Add a TODO comment next to it.
- Partners must be told to be honest with dealers and not invent earnings claims (already in the design). Keep it.

## 11. Legal, privacy and cookies
Create `/privacy`, `/terms`, `/cookies` as MDX or TSX pages, localized, with clearly marked **placeholders** for the legal entity name, address, company number and data-protection contact (`{{LEGAL_ENTITY}}` etc.) and a banner comment "Draft: have a lawyer review before launch". Privacy must cover: what we collect (name, email, phone, searches, ref code), why (run the test, contact the lead, partner program), processors (Resend, Vercel, affiliate tool), retention, rights (access, deletion), contact email. Cookie banner: essential only by default; analytics (Vercel Analytics is cookieless, so state that); ref cookie requires accept. Keep the banner light, bottom-left on desktop, full width on mobile.

## 12. SEO, performance, accessibility
- Metadata per page and locale, canonical, OG/Twitter images, JSON-LD `Organization` and `FAQPage` (from the FAQ), `sitemap.xml` including both locales.
- Targets: Lighthouse mobile ≥ 90 performance, 100 accessibility/best-practices/SEO. LCP image preloaded; no layout shift; fonts with `display: swap`.
- Accessibility: semantic landmarks, visible focus rings (orange), labels on all inputs, `aria-live` for form errors, modals trap focus and close on Esc, buttons are real `<button>`, alt text on every photo (copy the alts from the design), contrast checked on the dark and cream sections, `prefers-reduced-motion` respected everywhere.
- `<details>` for FAQ is fine; keep it native.

## 13. Repo, deploy, quality
- Create the GitHub repo `car-bot-web` (private). Conventional commits. `main` is production; PRs get Vercel preview deployments.
- `README.md`: setup, env vars, how to add a locale, how to switch the affiliate provider, how to test forms locally (use Resend test address / log-only mode when `RESEND_API_KEY` is absent), deploy steps, DNS checklist for Resend.
- CI (GitHub Actions): install, typecheck, lint, unit tests, i18n check, build.
- Playwright smoke tests: landing loads in en and mk; free-test validation messages; submitting the test form with a mocked API shows the confirmation; plan picker opens with the right plan; both calculators produce the expected numbers (incl. 12,100 / 1,200 for 2 clients); partner form validation; `?ref=ABC` sets the cookie and appears in the lead payload; no horizontal scroll at 360px.
- Security headers via `next.config` (CSP that allows only self + Vercel analytics + Google Fonts if used, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Secrets only in Vercel env vars.

## 14. Work order (commit after each)
1. Scaffold (Next.js, Tailwind, fonts, next-intl, tokens, lint, CI).
2. Layout: header, footer, language switcher, WhatsApp links, cookie banner.
3. Landing page sections, static first, then the CSS loop chat and ticker.
4. Forms: free-test flow, plan picker, modals, `/api/lead`, Resend emails, rate limit, honeypot.
5. Calculators + `lib/calc.ts` tests.
6. Partners page + `/api/partner`.
7. Thanks page and routing from forms.
8. Affiliate capture, attribution, provider adapter.
9. Macedonian translation + `TRANSLATION_NOTES.md` + i18n check.
10. Legal pages, SEO, OG images, JSON-LD, sitemap.
11. Accessibility and performance pass, Playwright, README.
12. Deploy: connect repo to Vercel, add env vars, attach `getcarbot.co`, verify Resend domain, run the smoke tests against the preview, then production.

## 15. Definition of done
Everything in section 5 renders on mobile and desktop in EN and MK; both lead forms deliver emails and an Audience contact in a real test; the ref cookie flows into the lead email; calculators match the formulas; Lighthouse targets met; CI green; production live on getcarbot.co. At the end, give Martin a short list: what's done, what's placeholder (legal details, photos, affiliate vendor, payout timing), and anything you were unsure about. Ask before making any decision not covered here.
