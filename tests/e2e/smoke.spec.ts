import { expect, test, type Page, type Route } from "@playwright/test";

const LINK = "https://suchen.mobile.de/fahrzeuge/search.html?ms=25200&isSearchRequest=true";

async function dismissCookies(page: Page, choice: "Accept" | "Essential only" = "Essential only") {
  const banner = page.getByTestId("cookie-banner");
  await banner.getByRole("button", { name: choice }).click();
  await expect(banner).toBeHidden();
}

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

  test("language switcher keeps the page", async ({ page }) => {
    await page.goto("/en/partners");
    await dismissCookies(page);
    await page
      .getByRole("banner")
      .getByRole("link", { name: /Македонски/ })
      .click();
    await expect(page).toHaveURL(/\/mk\/partners$/);
  });
});

test.describe("free test", () => {
  test("shows validation messages", async ({ page }) => {
    await page.goto("/en");
    await dismissCookies(page);
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
    await dismissCookies(page);
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
    await dismissCookies(page);
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
    await dismissCookies(page);
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
      await dismissCookies(page);
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
    await dismissCookies(page);
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
    await dismissCookies(page);
    await expect(page.getByTestId("partner-year-total")).toHaveText("€12,100");
    await expect(page.getByTestId("partner-monthly")).toHaveText("€1,200");
    await expect(page.getByTestId("partner-total-clients")).toContainText("24 dealerships");
    await page.getByTestId("partner-clients").fill("1");
    await expect(page.getByTestId("partner-year-total")).toHaveText("€6,050");
    await expect(page.getByTestId("partner-monthly")).toHaveText("€600");
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
    await dismissCookies(page);
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

test.describe("affiliate ref", () => {
  test("?ref=ABC sets the cookie after consent and appears in the lead payload", async ({
    page,
    context,
  }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route("**/api/lead", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto("/en?ref=ABC");
    expect((await context.cookies()).find((c) => c.name === "cb_ref")).toBeUndefined();
    await dismissCookies(page, "Accept");
    await expect
      .poll(async () => (await context.cookies()).find((c) => c.name === "cb_ref")?.value ?? "")
      .toMatch(/^ABC/);

    await page.getByTestId("choose-monthly").click();
    const dialog = page.getByTestId("lead-modal");
    await expect(dialog.getByLabel("Partner or discount code (optional)")).toHaveValue("ABC");
    await expect(dialog).toContainText("10% off setup and monthly");
    await fillContact(page);
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Confirm my plan" }).click();
    await expect(page.getByTestId("lead-done")).toBeVisible();
    expect(payload).toMatchObject({ ref: "ABC", code: "ABC" });
  });

  test("server sets the cookie on later visits once consent exists", async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "cb_consent", value: "accepted", url: baseURL! }]);
    await page.goto("/en/partners?partner=XYZ_1");
    const ref = (await context.cookies()).find((c) => c.name === "cb_ref");
    expect(ref?.value).toMatch(/^XYZ_1/);
  });
});

test.describe("layout", () => {
  for (const path of [
    "/en",
    "/mk",
    "/en/partners",
    "/mk/partners",
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
