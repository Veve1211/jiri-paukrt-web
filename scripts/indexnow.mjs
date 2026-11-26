import { readFile } from "node:fs/promises";

const origin = "https://jiri-paukrt.vercel.app";
const key = "ed4a22145f6077749e36a72a7a2eb14a";
const keyLocation = `${origin}/${key}.txt`;
const dryRun = process.argv.includes("--dry-run");

async function getText(url) {
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function submit() {
  const [sitemap, publishedKey] = dryRun
    ? await Promise.all([
        readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
        readFile(new URL(`../public/${key}.txt`, import.meta.url), "utf8"),
      ])
    : await Promise.all([getText(`${origin}/sitemap.xml`), getText(keyLocation)]);

  if (publishedKey.trim() !== key) throw new Error("IndexNow key file does not match the key.");

  const urlList = [...new Set(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]))];
  if (
    urlList.length === 0 ||
    urlList.length > 10_000 ||
    urlList.some((url) => new URL(url).origin !== origin)
  ) {
    throw new Error("Expected 1–10,000 sitemap URLs on the production origin.");
  }

  if (dryRun) {
    console.log(`Validated the public key file and ${urlList.length} canonical URLs locally.`);
    return;
  }

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(origin).hostname, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow returned HTTP ${response.status}.`);
  }
  console.log(
    `IndexNow accepted ${urlList.length} URLs (HTTP ${response.status})` +
      (response.status === 202 ? "; key validation is pending." : "."),
  );
}

submit().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
