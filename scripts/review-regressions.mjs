import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://127.0.0.1:4173");
await page.locator("#scene").selectOption("1");
await page.locator("#q1").fill("180");
await page.locator("#q2").fill("0");
await page.locator("#tx").fill("-230");
await page.locator("#ty").fill("0");
await page.locator("#plan").click();
await page.waitForFunction(() =>
  document.querySelector("#message").textContent.includes("waypoints found"),
);
await page.locator("#play").click();
await page.waitForTimeout(400);
assert.equal(await page.locator("#q1").inputValue(), "180");
await page.locator("#q2").fill("1");
await page.locator("#tx").fill("185.25");
await page.locator("#ty").fill("125.75");
await page.locator("#q1").fill("35");
assert.equal(await page.locator("#tx").inputValue(), "185.25");
assert.equal(await page.locator("#ty").inputValue(), "125.75");
await page.locator("#tx").fill("");
await page.locator("#plan").click();
assert.match(await page.locator("#message").innerText(), /Enter both/);
const queued = await browser.newPage();
await queued.addInitScript(() => {
  window.testWorkers = [];
  window.Worker = class {
    constructor() {
      window.testWorkers.push(this);
    }
    postMessage() {}
    terminate() {
      this.terminated = true;
    }
  };
});
await queued.goto("http://127.0.0.1:4173");
await queued.getByRole("button", { name: "02 Train & test AI" }).click();
await queued.locator("#train").click();
await queued.getByRole("button", { name: "01 Design & move" }).click();
await queued.locator("#scene").selectOption("1");
await queued.getByRole("button", { name: "02 Train & test AI" }).click();
await queued.locator("#train").click();
await queued.evaluate(() =>
  window.testWorkers[0].onmessage({ data: { error: "STALE ERROR" } }),
);
assert.equal(await queued.locator("#train").isDisabled(), true);
assert.equal(await queued.locator("#accuracy").innerText(), "—");
assert.equal(
  await queued.evaluate(() => !!window.testWorkers[1].terminated),
  false,
);
await queued.evaluate(() =>
  window.testWorkers[1].onmessage({ data: { error: "Current worker error" } }),
);
assert.equal(await queued.locator("#train").isEnabled(), true);
assert.equal(
  await queued.locator("#insight").innerText(),
  "Current worker error",
);
console.log(
  "Cursor review regression checks passed: stationary endpoint, decimal/blank targets, stale queued worker result.",
);
await browser.close();
