import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { PROJECTS } from "@/data/portfolio";
import { withSecurityHeaders } from "@/lib/security-headers";

const page = () => new Response("<p>ok</p>", { headers: { "content-type": "text/html" } });

describe("security headers", () => {
  it("adds the basic headers everywhere, keeping framing allowed for the Lovable preview", () => {
    const res = withSecurityHeaders(new Request("https://preview.example.com/"), page());
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("X-Frame-Options")).toBeNull();
  });

  it("blocks framing on the published site and keeps status and body", async () => {
    const res = withSecurityHeaders(
      new Request("https://paukrt.lovable.app/cv"),
      new Response("missing", { status: 404 }),
    );
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("missing");
  });
});

describe("sitemap", () => {
  const sitemap = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");
  const robots = readFileSync(resolve(__dirname, "../../public/robots.txt"), "utf8");

  it("lists every project page", () => {
    for (const project of PROJECTS) {
      expect(sitemap).toContain(`<loc>https://jiri-paukrt.vercel.app/projects/${project.slug}</loc>`);
    }
  });

  it("is linked from robots.txt", () => {
    expect(robots).toContain("Sitemap: https://jiri-paukrt.vercel.app/sitemap.xml");
  });
});
