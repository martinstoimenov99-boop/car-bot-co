# Adding languages: plan

**Status:** English (default), German, Macedonian, Albanian and Serbian (Latin) exist. German, Albanian and Serbian are machine-drafted and still need a native read-through (see `TRANSLATION_NOTES.md`). Next up: Bulgarian, then Croatian/Bosnian and Slovenian, or Serbian Cyrillic.

The site has English (default), German, Macedonian, Albanian and Serbian. Everything visitors read lives in `messages/<locale>.json`, so a new language is one JSON file plus a few lines of config. Nothing else in the code has to change for the Latin-script languages below.

## Suggested order

| #   | Language           | Code       | Where it helps                                        | Script                    | Notes                                                                                                               |
| --- | ------------------ | ---------- | ----------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Albanian           | `sq`       | Albania, Kosovo, Albanian speakers in North Macedonia | Latin                     | Needs ë and ç: the fonts already include them.                                                                      |
| 2   | Serbian            | `sr`       | Serbia, parts of Bosnia and Montenegro                | Latin (Cyrillic optional) | Pick Latin first: it is what most Serbian businesses use online. Cyrillic can be a second locale later (`sr-Cyrl`). |
| 3   | Bulgarian          | `bg`       | Bulgaria                                              | Cyrillic                  | Same heading-font switch as Macedonian (see below).                                                                 |
| 4   | Croatian / Bosnian | `hr`, `bs` | Croatia, Bosnia                                       | Latin                     | Close to Serbian but with different everyday words. Start with one and see whether the other reads fine.            |
| 5   | Slovenian          | `sl`       | Slovenia                                              | Latin                     | Smallest market.                                                                                                    |

Order by where your partners and importers actually are. If your first partners are in Kosovo or Albania, do `sq` first.

## Steps for one language (about half a day, mostly review)

1. **Draft.** Copy `messages/en.json` to `messages/<code>.json` and translate every value. Keep the keys, the `{placeholders}`, the `<b>` tags and the `{{LEGAL_TOKENS}}`. I can draft it the same way I did Macedonian and list every uncertain phrase in a notes file.
2. **Register.** In `i18n/config.ts` add the code to `LOCALES` and a label to `LOCALE_LABELS` (short code for the toggle, long name, `htmlLang`, and the Open Graph locale such as `sq_AL`).
3. **Check.** `pnpm i18n:check` must pass: it fails on any missing key, array length change or lost placeholder. `pnpm test:e2e` runs the smoke tests.
4. **Native review.** A native speaker reads the live preview (`/<code>`, `/<code>/partners`, `/<code>/thanks?type=test`), mainly the homepage hero, the pricing and the partner payout lines. Fix anything that sounds like a translation.
5. **Legal pages.** Translate them only after the lawyer has signed off the English and Macedonian text, then have the lawyer or a legal translator look at the new language.
6. **Ship.** Merge to `main`. The sitemap, `hreflang` links, social share images and the confirmation emails pick up the new language automatically.

## Things that depend on the language

- **Euro format** (`lib/format.ts`): English shows `€3,000`, Macedonian `3.000 €`. Add the new language's convention and a test. Albanian, Serbian, Croatian, Bosnian and Slovenian normally use `3.000 €`. Bulgarian uses a space (`3 000 €`).
- **Cyrillic headings** (`app/globals.css`, the `html[lang="mk"]` rule): Archivo has no Cyrillic, so Cyrillic languages (`bg`, `sr-Cyrl`) need their code added to that rule. Latin languages need nothing; Latin Extended letters (č, ć, š, ž, đ, ë, ç) are already available.
- **Language menu** (`components/layout/LanguageSwitcher.tsx`): the header shows the current code and opens a list of every language, so it scales to many languages and fits on a phone. The footer lists the codes as links. Nothing to change when you add a language.
- **Which language a visitor lands on:** `/` sends people to their browser language when we have it, otherwise English.
- **Plural forms** in the counters: English, Macedonian and Albanian need `one` / `other`. Serbian, Croatian and Bosnian also need `few` (2–4), already done in `sr.json`; copy that pattern (`{count, plural, one {…} few {…} other {…}}`) for hr/bs. Slovenian also has a dual. The e2e tests check the Serbian forms.
- **Emails** to leads and partners go out in the language of the page they used. If the language file is missing, they fall back to English.
- **German needs an Impressum** (provider name and address) if you promote the site in Germany or Austria. See `TRANSLATION_NOTES.md`.
- **Do not translate:** Car Bot, WhatsApp, Telegram, mobile.de, AutoScout24, Kleinanzeigen, Marktplaats, leboncoin, Subito, Facebook Marketplace, GDPR, AI, and the German seller messages.

## Keeping them in sync

When English copy changes, change the other files in the same pull request, or the CI check fails. A one-line English tweak means one line per language. This is why it is worth adding languages only once the English copy is stable.
