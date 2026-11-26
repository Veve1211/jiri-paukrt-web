import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { NAV } from "../src/components/site/SiteHeader";
import { PROJECTS } from "../src/data/portfolio";

const PAGES = ["/", ...NAV.map((n) => n.to), "/cv", "/privacy", `/projects/${PROJECTS[0].slug}`];

// CLAUDE.md: the site presents Jiri, it never advertises him for a job.
const JOB_SEEKING =
  /open to (new )?(roles|opportunities|work)|available for (hire|work|new)|looking for (a )?(new )?(job|role|position)|job search|hledám (novou )?práci|hledám (nové )?uplatnění|k dispozici pro nové/i;

async function open(page: Page, path: string, lang: "en" | "cs" = "en") {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("lang", lang);
  await page.goto(url.pathname + url.search, { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
}

for (const path of PAGES) {
  test(`${path} loads without errors, overflow or job-seeking text (EN + CZ)`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    for (const lang of ["en", "cs"] as const) {
      await open(page, path, lang);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, "horizontal scroll").toBeLessThanOrEqual(0);
      expect(await page.locator("body").innerText()).not.toMatch(JOB_SEEKING);
    }
    expect(errors).toEqual([]);
  });

  test(`${path} has no accessibility violations (WCAG 2.1 AA)`, async ({ page }) => {
    // Without motion and after scrolling through, so axe sees the content at full opacity.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, path);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([]);
  });
}

test("the EN/CZ switch translates the menu and is remembered", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "CZ", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(page.getByRole("link", { name: "CZ", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  if (page.viewportSize()!.width >= 768) {
    const nav = page.getByRole("navigation", { name: "Hlavní menu" });
    for (const item of NAV) await expect(nav.getByRole("link", { name: item.cs })).toBeVisible();
  }
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the mobile menu opens and navigates", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 768, "the full menu shows from md (768 px)");
  await open(page, "/");
  const menu = page.getByRole("navigation", { name: "Mobile menu" });
  await expect(async () => {
    if (!(await menu.isVisible())) {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await expect(menu).toBeVisible({ timeout: 750 });
  }).toPass({ timeout: 10_000 });
  await menu.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page.getByRole("navigation", { name: "Mobile menu" })).toBeHidden();
});

test("the contact form checks the fields before sending anything", async ({ page }) => {
  const sent: string[] = [];
  page.on("request", (r) => r.method() === "POST" && sent.push(r.url()));
  await open(page, "/contact");
  await page.locator("#inq-name").fill("Jan Novák");
  await page.locator("#inq-email").fill("  not-an-email ");
  await page.locator("#inq-message").fill("Short");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.locator("#inq-email")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#inq-message")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  // A valid address with spaces around it passes once trimmed.
  await page.locator("#inq-email").fill("  jan.novak@example.com ");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.locator("#inq-email")).not.toHaveAttribute("aria-invalid", "true");
  expect(sent).toEqual([]);
});

// Google Search Console reads the raw server HTML, so check the response body, not the live DOM.
const SITE_VERIFICATION_TOKENS = [
  "Ctgx3MlIJJWdodU5RKD0QqkVdI_yZhYH0Ax9UxsskUY", // paukrt.lovable.app
  "I1BdPvOxBZ2Xa9qqwYhdoJhEafmc3PIXcCgCenOrBPw", // jiri-paukrt-web-eytb.vercel.app
];

test("server HTML keeps the Google Search Console verification tags in <head>", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();
  const head = html.slice(0, html.indexOf("</head>"));
  for (const token of SITE_VERIFICATION_TOKENS) {
    // [^>]* allows extra attributes the dev server adds (data-tsd-source)
    expect(head).toMatch(
      new RegExp(`<meta name="google-site-verification" content="${token}"[^>]*>`),
    );
  }
});

test("server HTML includes the Seznam Webmaster tag in the homepage head", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const head = html.slice(0, html.indexOf("</head>"));
  expect(head).toMatch(/<meta name="seznam-wmt" content="xhTtQpmWvW9uVGZRCyfxKoysTzTmFjkI"[^>]*>/);

  const cv = await (await request.get("/cv")).text();
  expect(cv).not.toContain('name="seznam-wmt"');
});

test("all canonical pages have reciprocal hreflang and complete sharing cards in server HTML", async ({
  request,
}) => {
  const origin = "https://jiri-paukrt.vercel.app";
  const siteMap = await request.get("/sitemap.xml");
  expect(siteMap.ok()).toBe(true);
  const urls = Array.from((await siteMap.text()).matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]!);
  expect(urls).toHaveLength(2 * (8 + PROJECTS.length));

  for (const url of urls) {
    const { pathname, search } = new URL(url);
    const czech = search === "?lang=cs";
    const enUrl = origin + pathname;
    const csUrl = enUrl + "?lang=cs";
    const response = await request.get(pathname + search);
    expect(response.ok(), url).toBe(true);
    const html = await response.text();
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head, url).toContain(`<html lang="${czech ? "cs" : "en"}"`);
    expect(head, url).toMatch(czech ? /<title>[^<]*Jiří Paukrt/ : /<title>[^<]*Jiri Paukrt/);
    expect(head.match(/<link rel="canonical" href="([^"]+)"/g), url).toEqual([
      `<link rel="canonical" href="${url}"`,
    ]);
    for (const [lang, href] of [
      ["en", enUrl],
      ["cs", csUrl],
      ["x-default", enUrl],
    ]) {
      expect(head, url).toContain(`rel="alternate" hrefLang="${lang}" href="${href}"`);
    }
    for (const property of ["title", "description", "image:alt", "type"]) {
      expect(head, url).toMatch(new RegExp(`property="og:${property}" content="[^"]+"`));
    }
    expect(head, url).toContain(`property="og:url" content="${url}"`);
    expect(head, url).toContain(`property="og:image" content="${origin}/og.png"`);
    expect(head, url).toContain(`name="twitter:image" content="${origin}/og.png"`);

    if (pathname === "/") {
      const json = head.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
      expect(json, url).toBeDefined();
      expect(JSON.parse(json!)).toMatchObject({
        "@type": "ProfilePage",
        inLanguage: czech ? "cs" : "en",
        mainEntity: {
          "@type": "Person",
          name: "Jiří Paukrt",
          alternateName: "Jiri Paukrt",
          sameAs: ["https://www.linkedin.com/in/jiri-paukrt"],
          worksFor: { name: "SYSTRA" },
        },
      });
    }
  }
});

test("switching languages preserves project filters and map selections", async ({ page }) => {
  await open(page, "/projects", "cs");
  const filter = page
    .getByRole("group", { name: "Filtrovat podle oboru" })
    .locator('a[href*="domain=microsim"]');
  await filter.click();
  await expect(filter).toHaveAttribute("aria-current", "page");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/lang=cs/);
  await expect(page).toHaveURL(/domain=microsim/);
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/domain=microsim/);

  await open(page, "/network?node=dublin", "en");
  await page.getByRole("link", { name: "CZ", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(page).toHaveURL(/node=dublin/);
});

test("the contact form accepts email delivery when the backup fails", async ({ page }) => {
  await page.route("**/rest/v1/contact_inquiries", (route) =>
    route.fulfill({ status: 503, json: { message: "Test database unavailable" } }),
  );
  await page.route("https://api.web3forms.com/submit", (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Jan Novák",
      email: "jan.novak@example.com",
    });
    return route.fulfill({ json: { success: true } });
  });
  await page.clock.install();
  await open(page, "/contact");
  await page.locator("#inq-name").fill("Jan Novák");
  await page.locator("#inq-email").fill("jan.novak@example.com");
  await page.locator("#inq-message").fill("I would like to ask about a regional transport model.");
  await page.clock.fastForward(4_100);
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.getByText(/MSG-[A-F0-9]{8}/)).toBeVisible();
});
