import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { NAV } from "../src/components/site/SiteHeader";
import { PROJECTS } from "../src/data/portfolio";

const PAGES = ["/", ...NAV.map((n) => n.to), "/cv", "/privacy", `/projects/${PROJECTS[0].slug}`];

// CLAUDE.md: the site presents Jiri, it never advertises him for a job.
const JOB_SEEKING =
  /open to (new )?(roles|opportunities|work)|available for (hire|work|new)|looking for (a )?(new )?(job|role|position)|job search|hledám (novou )?práci|hledám (nové )?uplatnění|k dispozici pro nové/i;

async function open(page: Page, path: string, lang: "en" | "cs" = "en") {
  await page.goto(`${path}?lang=${lang}`, { waitUntil: "networkidle" });
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
  await page.getByRole("button", { name: "CZ", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  await expect(page.getByRole("button", { name: "CZ", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  if (page.viewportSize()!.width >= 768) {
    const nav = page.getByRole("navigation", { name: "Hlavní menu" });
    for (const item of NAV) await expect(nav.getByRole("link", { name: item.cs })).toBeVisible();
  }
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the mobile menu opens and navigates", async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 768, "the full menu shows from md (768 px)");
  await open(page, "/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile menu" })
    .getByRole("link", { name: "Projects" })
    .click();
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

test("every page names jiri-paukrt.vercel.app as the canonical address", async ({ request }) => {
  for (const path of ["/", "/cv", `/projects/${PROJECTS[0].slug}`]) {
    const html = await (await request.get(`${path}?lang=cs`)).text();
    const head = html.slice(0, html.indexOf("</head>"));
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/g) ?? [];
    expect(canonical, path).toEqual([
      `<link rel="canonical" href="https://jiri-paukrt.vercel.app${path}"`,
    ]);
  }
});
