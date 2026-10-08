import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.REACHLAB_URL || "http://127.0.0.1:4173");
const design = page.getByRole("button", { name: "01 Design & move" }),
  learn = page.getByRole("button", { name: "02 Train & test AI" });
assert.equal(await design.getAttribute("aria-pressed"), "true");
await learn.click();
assert.equal(await learn.getAttribute("aria-pressed"), "true");
assert.equal(await design.getAttribute("aria-pressed"), "false");
const map = page.locator("#cspace");
assert.equal(await map.getAttribute("tabindex"), "0");
await map.focus();
await map.press("ArrowRight");
assert.match(await page.locator("#map-status").innerText(), /Shoulder -30°/);
await map.press("ArrowUp");
assert.match(await page.locator("#map-status").innerText(), /elbow 5°/);
assert.match(await page.locator("#map-status").innerText(), /Geometry:/);
assert.equal(await page.locator("#insight").getAttribute("role"), "status");
await page.locator("#train").click();
await page.waitForFunction(() =>
  document.querySelector("#accuracy").textContent.includes("%"),
);
await page.locator("#prediction").click();
assert.equal(
  await page.locator("#prediction").getAttribute("aria-pressed"),
  "true",
);
assert.equal(
  await page.locator("#truth").getAttribute("aria-pressed"),
  "false",
);
await design.click();
await page.locator("#scene").selectOption("1");
await learn.click();
assert.equal(await page.locator("#truth").getAttribute("aria-pressed"), "true");
assert.equal(
  await page.locator("#prediction").getAttribute("aria-pressed"),
  "false",
);
assert.deepEqual(errors, []);
console.log(
  "Launch accessibility checks passed: view/map states, focused keyboard inspection, live training status, invalidation.",
);
await browser.close();
