import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const output = fileURLToPath(new URL("..", import.meta.url))
  .replace(/\\/g, "/")
  .replace(/\/$/, "");
await mkdir(output + "/submission/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:4173");
await page.locator("#plan").click();
await page.waitForFunction(() =>
  document.querySelector("#message").textContent.includes("waypoints found"),
);
assert.equal(await page.locator("#play").isEnabled(), true);
await page.screenshot({
  path: output + "/submission/screenshots/workbench.png",
  fullPage: true,
});
await page.locator("#play").click();
await page.waitForFunction(
  () =>
    document.querySelector("#message").textContent.startsWith("Target reached"),
  null,
  { timeout: 20000 },
);
assert.match(await page.locator("#tip-readout").innerText(), /185, 125/);
await page.locator("#tx").fill("320");
await page.locator("#ty").fill("320");
await page.locator("#plan").click();
await page.waitForFunction(() =>
  document.querySelector("#message").textContent.includes("outside"),
);
await page.locator("#reset").click();
await page.getByRole("button", { name: "02 Train & test AI" }).click();
await page.locator("#train").click();
await page.waitForFunction(
  () => document.querySelector("#accuracy").textContent.includes("%"),
  null,
  { timeout: 30000 },
);
const metrics = {
  accuracy: await page.locator("#accuracy").innerText(),
  missed: await page.locator("#missed").innerText(),
  recall: await page.locator("#recall").innerText(),
};
assert.equal(metrics.accuracy, "96.0%");
assert.equal(metrics.missed, "19");
await page.locator("#prediction").click();
await page.screenshot({
  path: output + "/submission/screenshots/ai-evaluation.png",
  fullPage: true,
});
const downloadEvent = page.waitForEvent("download");
await page.locator("#dataset").click();
const csv = await downloadEvent;
await csv.saveAs(output + "/submission/example-training.csv");
await page.getByRole("button", { name: "03 Engineering challenges" }).click();
await page
  .locator("#notes")
  .fill(
    "QA experiment: 500 examples, k=5, default workshop. 96.0% accuracy hid 19 missed collisions on 800 held-out configurations.",
  );
await page.screenshot({
  path: output + "/submission/screenshots/challenges.png",
  fullPage: true,
});
const experimentDownload = page.waitForEvent("download");
await page.getByRole("button", { name: "Export experiment ↗" }).click();
await (
  await experimentDownload
).saveAs(output + "/submission/example-experiment.json");
await page.getByRole("button", { name: "01 Design & move" }).click();
await page.locator("#scene").selectOption("1");
await page.getByRole("button", { name: "02 Train & test AI" }).click();
assert.equal(await page.locator("#accuracy").innerText(), "—");
assert.equal(await page.locator("#dataset").isEnabled(), false);
await page.evaluate(async () => {
  await navigator.serviceWorker.ready;
});
await page.reload();
await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
await context.setOffline(true);
await page.reload();
await page.locator("#plan").click();
await page.waitForFunction(() =>
  document.querySelector("#message").textContent.includes("waypoints found"),
);
await page.getByRole("button", { name: "02 Train & test AI" }).click();
await page.locator("#train").click();
await page.waitForFunction(
  () => document.querySelector("#accuracy").textContent.includes("%"),
  null,
  { timeout: 30000 },
);
assert.equal(
  await page.locator("#notes").inputValue(),
  "QA experiment: 500 examples, k=5, default workshop. 96.0% accuracy hid 19 missed collisions on 800 held-out configurations.",
);
await context.setOffline(false);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: output + "/submission/screenshots/mobile.png",
  fullPage: true,
});
assert.equal(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  ),
  true,
);
assert.deepEqual(errors, []);
await writeFile(
  output + "/research/results/browser-qa.json",
  JSON.stringify(
    {
      scope:
        "Automated local browser functional checks; no human usability study",
      checks: [
        "default geometry-validated route",
        "playback reaches target",
        "unreachable target message",
        "local AI worker training",
        "heldout metrics match expected default scene",
        "CSV download",
        "notes persistence",
        "model invalidation after scene change",
        "offline reload, planning, and AI worker",
        "390px responsive layout without horizontal overflow",
        "no uncaught browser errors",
      ],
      defaultUiMetrics: metrics,
      errors,
    },
    null,
    2,
  ),
);
console.log("Browser QA passed: 11 checks, offline training verified.");
await browser.close();
