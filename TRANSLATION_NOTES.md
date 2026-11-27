# Translation notes for review

Four sections: **Macedonian (mk)**, **Albanian (sq)**, **Serbian (sr)** and **German (de)**. `sq`, `sr` and `de` were drafted the same way as Macedonian and have **not been read by a native speaker yet**. Please have one go through the live pages before you promote those languages.

---

# Macedonian translation (mk)

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
13. _(removed: the privacy policy no longer mentions a company number or street address.)_
14. **Legal pages**: translated from the English drafts. The lawyer should review the Macedonian version too, especially the GDPR / ЗЗЛП wording and the name of the Agency (“Агенција за заштита на личните податоци”).
15. **“Welcome package”** → “пакет добредојде”. Alternative: “почетен пакет”.
16. **“Partner dashboard”** → “партнерски панел”. Alternative: “партнерска контролна табла”.
17. **Phone bubble** in the hero: numbers are shown in MK format (“142.000 km · 9.900 €”). The German seller reply stays German on purpose.
18. **Ticker** (“Пример активност”): only “sent in” is translated; city names stay in their local spelling (München, Wien, Göteborg).
19. **404 text** “Оваа страница веќе замина.” is a car joke (“this page already drove off”). Replace if it does not land.
20. **Plural forms**: Macedonian uses `one` for 1, 21, 31… (“21 автокуќа”) and `other` for the rest. The calculators only show 1–6 and 12–72, so check “1 автокуќа”, “2 автокуќи”, “1 возило / месец”, “6 месеци”.

## Added with the payout rules (please check these too)

21. **Payout lines** in `partners.earn` (cards 1 and 2 and the note below them) and the “How do I get paid?” FAQ. Key phrases: “во рок од 7 дена откако ќе ја примиме уплатата”, “на 1-ви во следниот месец”, “како еден збир за претходниот месец”.
22. **“Dashboard” wording replaced** because there is no partner dashboard. New titles and lines: “📊 Јасно следење”, “Ги следиме сите автокуќи што ќе ги донесете…”, “Ви праќаме свој линк за следење и код за 10% попуст”.
23. **Bonus timing:** “Се исплаќа со месечната исплата.” (earn card) and “Бонусот за лојалност од 50 € се исплаќа со првата месечна исплата откако автокуќата ќе стигне до 6-тиот месец.” (FAQ).
24. **Privacy policy:** the sentence about processors no longer names an affiliate tool.

## Cookie banner removed

25. The **Cookies** page and the cookie / retention lines in the **Privacy** policy were rewritten (no banner, one language cookie, partner code in tab storage). Please read “Единственото колаче што го користиме”, “Партнерски код (не е колаче)” and “Вашиот избор”.

## Not translated on purpose

Car Bot, WhatsApp, Telegram, mobile.de, AutoScout24, Kleinanzeigen, Marktplaats, leboncoin, Subito, Facebook Marketplace, GDPR, AI, the German seller messages, the cookie name (`NEXT_LOCALE`) and the mobile.de URL placeholder.

---

# Albanian translation (sq)

`messages/sq.json`. Polite plural address (**ju / juaj**, lowercase), short sentences, no jargon. Prices as `3.000 €`. Read `/sq`, `/sq/partners`, `/sq/thanks?type=test`, the legal pages, and the confirmation email text under `emails.*`.

## Strings I was unsure about

1. **“autosallon”** for _dealership_ (used in Albania and Kosovo). Alternative: “shitës makinash”.
2. **“tregtar”** for _dealer/importer_, with “importues” where the English says importer. Alternative: “shitës makinash”.
3. **Hero title** “Bëhuni blerësi i parë që dëgjon çdo shitës.” Alternative: “Bëhuni blerësi i parë të cilin e dëgjon çdo shitës.”
4. **“konfigurim”** for _setup_ (“konfigurimi”, “e konfigurojmë”). Alternatives: “vendosje”, “instalim”. Please pick one and I will apply it everywhere.
5. **“njoftim”** for both _alert_ and _ping_, and “WhatsApp-i juaj bie” (_your WhatsApp rings_). Check it sounds right for a message, not a call.
6. **“Njoftimet nuk blejnë makina. Mesazhi i parë blen.”** (_Alerts don’t buy cars. The first message does._)
7. **“program afilimi”** for _affiliate program_. Alternative: “program partneriteti”.
8. **“Cookie-t”** and “Politika e cookie-ve”. Alternative: “Skedarët cookie”.
9. **“E sjellim në shtëpi / E sillni në shtëpi”** (_Bring it home_) and “Negocioni çmimin”.
10. **Ticker** “u dërgua për 41 s”. Alternative: “u dërgua brenda 41 s”.
11. **Hyphenated forms** like “WhatsApp-i”, “Car Bot-i”, “cloud-in”: check the style you prefer.
12. **Legal pages:** “Agjencia për Mbrojtjen e të Dhënave Personale e Maqedonisë së Veriut”. Albania and Kosovo have their own authorities; the text only says “the authority in your country”. A lawyer should check the wording for Albania and Kosovo too.

---

# Serbian translation (sr, Latin script)

`messages/sr.json`. **Latin script, ekavian**, polite address with capital **Vi / Vaš** (same style as the Macedonian file). Prices as `3.000 €`. Serbian has three plural forms (1 / 2–4 / 5+), written into the counters (“1 autokuća”, “2 autokuće”, “5 autokuća”). Cyrillic would be a separate language later (see `docs/LANGUAGES.md`).

## Strings I was unsure about

1. **“vozilo” vs “auto / automobil”.** I used “vozilo” (like _car/vehicle_ in English). In everyday Serbian “auto” is more natural, “vozilo” more formal. If you prefer “auto”, tell me and I will change it everywhere, including the grammar (“dobro vozilo” → “dobar auto”).
2. **“autokuća”** for _dealership_. Alternative: “auto-plac” or “salon automobila”.
3. **“trgovac”** for _dealer_. Alternative: “prodavac automobila”.
4. **“mušterija”** (_customer_) in the “What you’re missing” text. Alternative: “kupac / klijent”.
5. **“Pogađate se oko cene”** (_negotiate_). Alternative: “Pregovarate o ceni”.
6. **“e-pošta”** vs “imejl”.
7. **“Preskače sve nepotrebno”** for _skips the junk_.
8. **“o našem trošku” / “na naš račun”** used for _at our cost_. Both are used; check one is not odd in context.
9. **Dates in payouts:** “prvog dana sledećeg meseca” (_on the 1st of the next month_) and “u roku od 7 dana”.
10. **“Vi ste prvi na redu … Vaš red 👇”** in the phone chat.
11. **Hero title** “Budite prvi kupac koga svaki prodavac čuje.”
12. **Legal pages:** the data-protection authority sentence says “Agencija za zaštitu ličnih podataka Severne Makedonije (ili nadležnom organu u Vašoj državi)”. Serbia has the “Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti”. A lawyer should check the wording for Serbia.
13. **“Kolačići”** (_cookies_) and the cookie page wording.

---

# German translation (de)

`messages/de.json`. Formal **Sie / Ihr** (capitalised), warm and direct, standard German with **ß** (Swiss readers would write “ss”). Prices as `3.000 €`. The German seller message and its quote stay German. Please read `/de`, `/de/partners`, `/de/thanks?type=test`, the legal pages and the email text.

## Strings I was unsure about

1. **“Autohaus”** (pl. “Autohäuser”) for _dealership_, and “Händler” for _dealer_. Alternative for partners: “Autohändler”.
2. **“Seien Sie der erste Käufer, von dem jeder Verkäufer hört.”** Alternative: “Seien Sie der Erste, bei dem sich jeder Verkäufer meldet.”
3. **Generic masculine** (“der Verkäufer”, “der Käufer”, “er”) follows the English source (“he”). Say if you want gender-neutral forms.
4. **“Ihr WhatsApp meldet sich”** for _your WhatsApp pings_. Many Germans say “Ihre WhatsApp” for the message and “Ihr WhatsApp” for the app; I used the app sense. Check it reads right.
5. **“Benachrichtigungen kaufen keine Autos. Die erste Nachricht schon.”** (_Alerts don’t buy cars. The first message does._)
6. **“Sortiert den Ausschuss aus.”** for _skips the junk_. Alternative: “Lässt Unbrauchbares links liegen.”
7. **“auf unsere Kosten”** for _at our cost_, **“Einrichtung”** for _setup_, **“Einrichtungsgespräch”** for _setup call_.
8. **“DSGVO”** is used instead of “GDPR” (the German name). The brief lists GDPR as untranslated; tell me if you want “GDPR” back.
9. **Tracking** is kept in English: “Tracking-Link”, “Klares Tracking”. Alternative: “Verfolgung”.
10. **“Affiliate-Programm”** and “Partnerprogramm” are both used, like in English. Check it is not confusing.
11. **Plattformen vs. Börsen.** I used “Plattformen” throughout (not “Fahrzeugbörsen”).
12. **Legal text**, especially: “Agentur für den Schutz personenbezogener Daten Nordmazedoniens (oder bei der zuständigen Aufsichtsbehörde in Ihrem Land)” and “Standardvertragsklauseln”. A lawyer should check it.

### Important for the German version: Impressum

A commercial website aimed at Germany or Austria normally needs an **Impressum** (legal notice) with the provider’s name, postal address and contact details (§ 5 DDG in Germany, § 5 ECG in Austria). There is none on the site, because you chose not to show an address. This is a question for the lawyer before you promote the German page in Germany or Austria.

## Not translated (all languages)

Car Bot, WhatsApp, Telegram, mobile.de, AutoScout24, Kleinanzeigen, Marktplaats, leboncoin, Subito, Facebook Marketplace, GDPR, AI, the German seller messages, the cookie name `NEXT_LOCALE`.
