import { expect, test, type Page, type Route } from "@playwright/test";

const LINK = "https://suchen.mobile.de/fahrzeuge/search.html?ms=25200&isSearchRequest=true";

async function fillContact(page: Page) {
  const dialog = page.getByTestId("lead-modal");
  await dialog.getByPlaceholder("Name", { exact: true }).fill("Marko");
  await dialog.getByPlaceholder("Surname").fill("Markovski");
  await dialog.getByPlaceholder("Email").fill("marko@example.com");
  await dialog.getByPlaceholder("WhatsApp number, with country code").fill("+389 70 123 456");
  return dialog;
}

test.describe("landing", () => {
  test("loads in English and Macedonian", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Be the first buyer every seller hears from.",
    );
    await expect(page.getByTestId("ticker")).toContainText("Example activity");
    await page.goto("/mk");
    await expect(page.locator("html")).toHaveAttribute("lang", "mk");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Бидете првиот купувач");
  });

  test("root redirects to a locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|mk)$/);
  });

  test("language menu keeps the page", async ({ page }) => {
    await page.goto("/en/partners");
    await page
      .getByRole("banner")
      .getByRole("button", { name: /Language/ })
      .click();
    await page
      .getByRole("banner")
      .getByRole("link", { name: /Македонски/ })
      .click();
    await expect(page).toHaveURL(/\/mk\/partners$/);
  });
});

test.describe("language menu", () => {
  for (const width of [360, 1280]) {
    test(`is in the header and switches language at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/en");
      const header = page.getByRole("banner");
      const button = header.getByRole("button", { name: /Language/ });
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(header.getByRole("link")).toContainText(["English", "Македонски", "Shqip", "Srpski"]);
      await page.keyboard.press("Escape");
      await expect(button).toHaveAttribute("aria-expanded", "false");

      await button.click();
      await header.getByRole("link", { name: /Shqip/ }).click();
      await expect(page).toHaveURL(/\/sq$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "sq");
      await header.getByRole("button", { name: /Gjuha/ }).click();
      await header.getByRole("link", { name: /Srpski/ }).click();
      await expect(page).toHaveURL(/\/sr$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
      await header.getByRole("button", { name: /Jezik/ }).click();
      await header.getByRole("link", { name: /English/ }).click();
      await expect(page).toHaveURL(/\/en$/);
    });
  }

  test("header stays on one row at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const path of ["/en", "/sq", "/sr"]) {
      await page.goto(path);
      const h = await page.evaluate(() => document.querySelector("header")!.getBoundingClientRect().height);
      expect(h).toBeLessThan(90);
    }
  });
});

test.describe("Albanian and Serbian", () => {
  test("Albanian home and partners", async ({ page }) => {
    await page.goto("/sq");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Bëhuni blerësi i parë që dëgjon çdo shitës.",
    );
    await page.goto("/sq/partners");
    await expect(page.getByTestId("partner-year-total")).toHaveText("12.100 €");
    await expect(page.locator("main")).toContainText("1 të muajit pasardhës");
  });

  test("Serbian home, partners and plural forms", async ({ page }) => {
    await page.goto("/sr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Budite prvi kupac koga svaki prodavac čuje.",
    );
    await page.goto("/sr/partners");
    await expect(page.getByTestId("partner-year-total")).toHaveText("12.100 €");
    // 2 per month → 24 in a year: "few" form
    await expect(page.getByTestId("partner-total-clients")).toContainText("24 autokuće");
    const slider = page.getByTestId("partner-clients");
    await slider.fill("1");
    await expect(page.getByTestId("partner-total-clients")).toContainText("12 autokuća");
    await expect(page.getByText("1 autokuća", { exact: true })).toBeVisible();
    await slider.fill("3");
    await expect(page.getByText("3 autokuće", { exact: true })).toBeVisible();
    await slider.fill("5");
    await expect(page.getByText("5 autokuća", { exact: true })).toBeVisible();
  });

  test("Serbian ROI calculator shows plural forms and special letters", async ({ page }) => {
    await page.goto("/sr");
    const payback = page.getByTestId("roi-payback");
    await expect(payback).toContainText("2 dodatna vozila");
    await page.getByTestId("roi-extra").fill("0");
    await page.getByTestId("roi-margin").fill("1000");
    await expect(page.getByTestId("roi-months")).toContainText("4 meseca");
    await expect(page.getByTestId("roi-net")).toHaveText("−3.000 €");
  });

  for (const [path, who] of [
    ["/sq/privacy", "Smartin Labs"],
    ["/sr/privacy", "Smartin Labs"],
    ["/sq/terms", "info@getcarbot.co"],
    ["/sr/cookies", "NEXT_LOCALE"],
  ] as const) {
    test(`${path} renders without placeholders`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main")).toContainText(who);
      await expect(page.locator("main")).not.toContainText("{{");
    });
  }

  for (const lang of ["sq", "sr"]) {
    test(`${lang}: free test and plan modal work`, async ({ page }) => {
      let payload: Record<string, unknown> | undefined;
      await page.route("**/api/lead", async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { ok: true } });
      });
      await page.goto(`/${lang}`);
      await page.getByTestId("choose-yearly").click();
      const dialog = page.getByTestId("lead-modal");
      await dialog.getByRole("textbox").nth(0).fill("Ana");
      await dialog.getByRole("textbox").nth(1).fill("Test");
      await dialog.getByRole("textbox").nth(2).fill("ana@example.com");
      await dialog.getByRole("textbox").nth(3).fill("+389 70 111 222");
      await dialog.getByRole("checkbox").check();
      await dialog.locator("button[type=submit]").click();
      await expect(page.getByTestId("lead-done")).toBeVisible();
      expect(payload).toMatchObject({ type: "yearly", locale: lang });
    });
  }

  test("each language has hreflang alternates for all four", async ({ page }) => {
    await page.goto("/sq");
    const langs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("hreflang")));
    expect(langs).toEqual(expect.arrayContaining(["en", "mk", "sq", "sr-Latn", "x-default"]));
  });
});

test.describe("free test", () => {
  test("shows validation messages", async ({ page }) => {
    await page.goto("/en");
    const box = page.getByTestId("free-test-links");
    const submit = page.getByRole("button", { name: "Find my first cars" });
    const error = page.getByTestId("free-test-error");

    await submit.click();
    await expect(error).toHaveText("Paste at least one mobile.de search link.");

    await box.fill([LINK, LINK, LINK, LINK].join("\n"));
    await expect(page.getByTestId("free-test-count")).toHaveText("4 of 3 searches");
    await submit.click();
    await expect(error).toHaveText("Up to 3 searches for the free test. Remove a row.");

    await box.fill("https://www.autoscout24.de/lst/vw");
    await submit.click();
    await expect(error).toHaveText("Only mobile.de links for now. One link per row.");
  });

  test("submits with a mocked API and shows the confirmation", async ({ page }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/lead", async (route: Route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/en");
    await page.getByTestId("free-test-links").fill(`${LINK}\n\n${LINK}`);
    await page.getByRole("button", { name: "Find my first cars" }).click();
    const dialog = page.getByTestId("lead-modal");
    await expect(dialog.getByRole("heading")).toHaveText("Where do we send the replies?");

    await fillContact(page);
    await dialog.getByRole("button", { name: "Start my free test" }).click();
    await expect(page.getByTestId("lead-error")).toHaveText("Please tick the box so we can contact you.");
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Start my free test" }).click();

    const done = page.getByTestId("lead-done");
    await expect(done).toContainText("Got your searches.");
    expect(payload).toMatchObject({
      type: "test",
      firstName: "Marko",
      consent: true,
      locale: "en",
      searches: [LINK, LINK],
    });
    await done.getByRole("link", { name: "Continue →" }).click();
    await expect(page).toHaveURL(/\/en\/thanks\?type=test$/);
    await expect(page.getByTestId("thanks-lead")).toContainText("We got your searches.");
  });

  test("network failure shows the WhatsApp fallback", async ({ page }) => {
    await page.route("**/api/lead", (route) => route.abort());
    await page.goto("/en");
    await page.getByTestId("free-test-links").fill(LINK);
    await page.getByRole("button", { name: "Find my first cars" }).click();
    const dialog = await fillContact(page);
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Start my free test" }).click();
    await expect(page.getByTestId("lead-error")).toContainText("Something went wrong");
    const wa = page.getByTestId("lead-wa-fallback");
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/38978662817\?text=.*Marko/);
  });

  test("modal closes on Escape and keeps focus inside", async ({ page }) => {
    await page.goto("/en");
    await page.getByTestId("choose-yearly").click();
    const dialog = page.getByTestId("lead-modal");
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("choose-yearly")).toBeFocused();
  });
});

test.describe("plan picker", () => {
  for (const [plan, text] of [
    ["monthly", "Plan: monthly, €500 setup then €250 a month."],
    ["yearly", "Plan: yearly, €3,000, setup free."],
  ] as const) {
    test(`opens with the ${plan} plan`, async ({ page }) => {
      let payload: Record<string, unknown> | undefined;
      await page.route("**/api/lead", async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { ok: true } });
      });
      await page.goto("/en");
      await page.getByTestId(`choose-${plan}`).click();
      const dialog = page.getByTestId("lead-modal");
      await expect(dialog.getByRole("heading")).toHaveText("Almost there. Who are we setting up?");
      await expect(page.getByTestId("lead-modal-sub")).toContainText(text);
      await fillContact(page);
      await dialog.getByRole("checkbox").check();
      await dialog.getByRole("button", { name: "Confirm my plan" }).click();
      await expect(page.getByTestId("lead-done")).toContainText("payment link");
      expect(payload).toMatchObject({ type: plan });
      expect(payload?.searches).toBeUndefined();
    });
  }
});

test.describe("calculators", () => {
  test("ROI calculator", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByTestId("roi-gain")).toHaveText("€18,000");
    await expect(page.getByTestId("roi-cost")).toHaveText("€3,000");
    await expect(page.getByTestId("roi-net")).toHaveText("+€15,000");
    await expect(page.getByTestId("roi-payback")).toHaveText(
      "Your whole first year is covered by 2 extra cars at €1,500 profit each.",
    );
    await expect(page.getByTestId("roi-months")).toHaveText(
      "One extra car pays about 6 months of the monthly fee.",
    );
    await page.getByTestId("roi-monthly").click();
    await expect(page.getByTestId("roi-cost")).toHaveText("€3,500");
    await page.getByTestId("roi-extra").fill("0");
    await expect(page.getByTestId("roi-net")).toHaveText("−€3,500");
    await page.getByTestId("roi-margin").fill("2500");
    await expect(page.getByTestId("roi-payback")).toContainText("2 extra cars at €2,500");
    await expect(page.getByTestId("roi-months")).toContainText("10 months");
  });

  test("partner calculator: 2 clients → €12,100 and €1,200", async ({ page }) => {
    await page.goto("/en/partners");
    await expect(page.getByTestId("partner-year-total")).toHaveText("€12,100");
    await expect(page.getByTestId("partner-monthly")).toHaveText("€1,200");
    await expect(page.getByTestId("partner-total-clients")).toContainText("24 dealerships");
    await page.getByTestId("partner-clients").fill("1");
    await expect(page.getByTestId("partner-year-total")).toHaveText("€6,050");
    await expect(page.getByTestId("partner-monthly")).toHaveText("€600");
  });

  test("partner page states the payout timing and promises no dashboard", async ({ page }) => {
    await page.goto("/en/partners");
    const body = page.locator("main");
    await expect(body).toContainText("within 7 days after we receive");
    await expect(body).toContainText("1st of the next month");
    await expect(body).toContainText("loyalty bonus is paid with the next monthly payout");
    await expect(body).not.toContainText(/dashboard/i);
  });

  test("Macedonian number format", async ({ page }) => {
    await page.goto("/mk/partners");
    await expect(page.getByTestId("partner-year-total")).toHaveText("12.100 €");
  });
});

test.describe("partner form", () => {
  test("validates and submits", async ({ page }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/partner", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/en/partners");
    const form = page.getByTestId("partner-form");
    const error = page.getByTestId("partner-error");
    const submit = form.getByRole("button", { name: "Become a partner" });

    await submit.click();
    await expect(error).toHaveText("Please add your name and surname.");
    await form.getByPlaceholder("Name", { exact: true }).fill("Ana");
    await form.getByPlaceholder("Surname").fill("Petrova");
    await form.getByPlaceholder("Email").fill("ana@");
    await submit.click();
    await expect(error).toHaveText("Please add a valid email.");
    await form.getByPlaceholder("Email").fill("ana@example.com");
    await form.getByPlaceholder("WhatsApp number, with country code").fill("123");
    await submit.click();
    await expect(error).toHaveText("Please add your WhatsApp number with country code.");
    await form.getByPlaceholder("WhatsApp number, with country code").fill("+389 71 222 333");
    await submit.click();
    await expect(error).toHaveText("Tell us how you plan to find dealers.");
    await form.getByRole("combobox").selectOption("social");
    await submit.click();
    await expect(error).toHaveText("Please tick the box so we can contact you.");
    await form.getByRole("checkbox").check();
    await submit.click();
    await expect(page.getByTestId("partner-done")).toContainText("Welcome aboard.");
    expect(payload).toMatchObject({ firstName: "Ana", how: "social", consent: true });
  });
});

test.describe("partner code and cookies", () => {
  test("?ref=ABC reaches the lead payload without any cookie", async ({ page, context }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/lead", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/en?ref=ABC");
    // moving around the site keeps the code for this visit
    await page.getByRole("link", { name: "Partners" }).first().click();
    await expect(page).toHaveURL(/\/en\/partners/);
    await page.goto("/en");
    await page.getByTestId("choose-monthly").click();
    const dialog = page.getByTestId("lead-modal");
    await expect(dialog.getByLabel("Partner or discount code (optional)")).toHaveValue("ABC");
    await expect(dialog).toContainText("10% off setup and monthly");
    await fillContact(page);
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Confirm my plan" }).click();
    await expect(page.getByTestId("lead-done")).toBeVisible();
    expect(payload).toMatchObject({ ref: "ABC", code: "ABC" });
    expect((await context.cookies()).map((c) => c.name).filter((n) => n !== "NEXT_LOCALE")).toEqual([]);
  });

  test("an invalid code is ignored", async ({ page }) => {
    await page.goto("/en?ref=<script>");
    await page.getByTestId("choose-monthly").click();
    await expect(
      page.getByTestId("lead-modal").getByLabel("Partner or discount code (optional)"),
    ).toHaveValue("");
  });

  test("there is no cookie banner", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("region", { name: /cookie/i })).toHaveCount(0);
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /cookie/i })).toHaveCount(0);
  });
});

test.describe("legal pages", () => {
  for (const [path, who] of [
    ["/en/privacy", "Smartin Labs"],
    ["/mk/privacy", "Smartin Labs"],
    ["/en/terms", "Smartin Labs"],
  ] as const) {
    test(`${path} names the business and has no placeholders left`, async ({ page }) => {
      await page.goto(path);
      const main = page.locator("main");
      await expect(main).toContainText(who);
      await expect(main).toContainText("info@getcarbot.co");
      await expect(main).not.toContainText("{{");
    });
  }
});

test.describe("layout", () => {
  for (const path of [
    "/en",
    "/mk",
    "/sq",
    "/sr",
    "/en/partners",
    "/mk/partners",
    "/sq/partners",
    "/sr/partners",
    "/en/thanks?type=yearly",
    "/en/privacy",
  ]) {
    test(`no horizontal scroll at 360px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(path);
      const [scroll, inner] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        window.innerWidth,
      ]);
      expect(scroll).toBeLessThanOrEqual(inner);
    });
  }

  test("file-like paths outside a locale return 404, not 500", async ({ page }) => {
    for (const path of ["/favicon.ico", "/ads.txt"]) {
      expect((await page.goto(path))?.status()).toBe(404);
    }
  });

  test("unknown page shows the localized 404", async ({ page }) => {
    const res = await page.goto("/mk/nema-takva-strana");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Оваа страница веќе замина.");
  });
});
