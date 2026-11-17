// Checks the links on the homepage that point at discobiscuits.net. External
// links are skipped: sites like PayPal answer every scripted request with 403.

import { extractLinks } from "https://jslib.k6.io/sm-linkcheck/0.1.0/index.js";
import { check, fail } from "k6";
import { browser } from "k6/browser";
import http from "k6/http";

export const options = {
  scenarios: { ui: { executor: "shared-iterations", options: { browser: { type: "chromium" } } } },
};

const SITE = "https://discobiscuits.net";
const MAX_LINKS = 25;

export default async function () {
  const page = await browser.newPage();
  try {
    await page.goto(SITE, { waitUntil: "load" });
    const links = extractLinks(await page.content(), page.url())
      .filter((link) => link.startsWith(`${SITE}/`) || link === SITE)
      .slice(0, MAX_LINKS);

    const responses = http.batch(links.map((url) => ({ method: "GET", url, params: { timeout: "10s" } })));
    const broken = links
      .map((url, i) => ({ url, status: responses[i].status, error: responses[i].error }))
      .filter((r) => r.status !== 200);

    const ok = check(null, {
      "no broken links": () => broken.length === 0,
      "found links to check": () => links.length > 0,
    });
    if (!ok) {
      fail(
        `checked ${links.length} links, broken: ${broken.map((b) => `${b.url} (${b.error || b.status})`).join(", ") || "none"}`,
      );
    }
    // biome-ignore lint/suspicious/noConsole: k6 sends this to the check logs
    console.log(`checked ${links.length} links: ${links.join(" ")}`);
  } finally {
    await page.close();
  }
}
