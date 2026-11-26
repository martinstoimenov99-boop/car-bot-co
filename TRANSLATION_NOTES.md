# Macedonian translation: notes for review

`messages/mk.json` was written from `messages/en.json` following the glossary in the brief (formal **Вие**, short sentences, brand and platform names in Latin script). Please read the live pages at `/mk`, `/mk/partners`, `/mk/thanks?type=test` and the legal pages, and fix anything that does not sound natural. `pnpm i18n:check` makes sure no key or placeholder goes missing while you edit.

## Decisions applied everywhere

| Topic                    | Choice                                                                                            | Why                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Euro amounts             | `3.000 €`, `500 €`, `250 €`, `800 €` (dot thousands separator, symbol after the number)           | Normal Macedonian notation; `€3,000` can be read as three euros. Used in every MK string, the calculators (`lib/format.ts`) and the MK emails. |
| Formal address           | **Вие / Ваш / Ви** always capitalised                                                             | Polite business tone. Tell us if you prefer lowercase **вие**.                                                                                 |
| “Partner” vs “affiliate” | партнер, партнерска програма; “афилијат програма” only where the English says “affiliate program” | Glossary                                                                                                                                       |
| “Dealership”             | автокуќа (pl. автокуќи)                                                                           | Glossary                                                                                                                                       |
| “Ping”                   | известување, and “Вашиот WhatsApp ѕвони” for “your WhatsApp pings”                                | “Ѕвони” is livelier; check if it sounds right for a message (not a call).                                                                      |
| Headings font            | Archivo has no Cyrillic, so Macedonian headings use **Inter Tight** 700/800.                      | Technical, not a translation choice, but it changes the look of `/mk`.                                                                         |

## Strings I was unsure about

1. **Hero title** “Бидете првиот купувач од кој продавачот слуша.” is close to the English. Alternative: “Бидете првиот купувач што му пишува на продавачот.”
2. **Hero eyebrow** “Автоматизиран бот за купување за увозници на возила”: two “за” in a row. Alternative: “Автоматски бот за купување, за увозници на возила”.
3. **Stat** “Минути” / “од огласот до Вашата порака”: fine as a stat? Alternative: “Неколку минути”.
4. **“Alerts don’t buy cars. The first message does.”** → “Известувањата не купуваат возила. Првата порака купува.” The second sentence may sound odd. Alternative: “Возилото го купува тој што прв пишува.”
5. **“Skips the junk.”** → “Го прескокнува ѓубрето.” Maybe too strong. Alternative: “Ги прескокнува непотребните огласи.”
6. **“Negotiate the price”** → “Се пазарите за цената”. Alternative: “Преговарате за цената”.
7. **“cloud”** kept in Latin (“во нашиот cloud”). Alternative: “во нашиот облак” (sounds odd to most) or “на нашите онлајн сервери”.
8. **“AI brains”** → “AI мозоците”. Keep or rephrase to “AI моделите”?
9. **“Pay yearly: setup is free, 2 months on us”** → “2 месеци од нас”. Alternative: “2 месеци на наша сметка” / “2 месеци гратис”.
10. **“Safe, clean, and on us”** → “Безбедно, чисто и на наш трошок”.
11. **“Say stop on WhatsApp”** → “Напишете „стоп“ на WhatsApp”. Check the quote marks („ “) are the ones you want.
12. **Final CTA WhatsApp prefill** “Сакам свој Car Bot” (English: “I want my Car Bot bot”).
13. **Company number** in the privacy policy is written as **ЕМБС** (the Central Register number). Change if you mean ЕДБ (tax number).
14. **Legal pages**: translated from the English drafts. The lawyer should review the Macedonian version too, especially the GDPR / ЗЗЛП wording and the name of the Agency (“Агенција за заштита на личните податоци”).
15. **“Welcome package”** → “пакет добредојде”. Alternative: “почетен пакет”.
16. **“Partner dashboard”** → “партнерски панел”. Alternative: “партнерска контролна табла”.
17. **Phone bubble** in the hero: numbers are shown in MK format (“142.000 km · 9.900 €”). The German seller reply stays German on purpose.
18. **Ticker** (“Пример активност”): only “sent in” is translated; city names stay in their local spelling (München, Wien, Göteborg).
19. **404 text** “Оваа страница веќе замина.” is a car joke (“this page already drove off”). Replace if it does not land.
20. **Plural forms**: Macedonian uses `one` for 1, 21, 31… (“21 автокуќа”) and `other` for the rest. The calculators only show 1–6 and 12–72, so check “1 автокуќа”, “2 автокуќи”, “1 возило / месец”, “6 месеци”.

## Not translated on purpose

Car Bot, WhatsApp, Telegram, mobile.de, AutoScout24, Kleinanzeigen, Marktplaats, leboncoin, Subito, Facebook Marketplace, GDPR, AI, the German seller messages, the cookie names (`cb_ref`, `cb_consent`, `NEXT_LOCALE`) and the mobile.de URL placeholder.
