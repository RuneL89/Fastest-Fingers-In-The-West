// Mobile emulation: phone-sized touch device, verify soft-keyboard focus flow.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({
  viewport: { width: 1080, height: 2340 },
  hasTouch: true,
  isMobile: true,
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const out = "/mnt/agents/output/app/verification-shots";

await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
const canvas = await page.locator("canvas#game-canvas").boundingBox();
const tap = async (nx, ny) => page.touchscreen.tap(canvas.x + nx * canvas.width, canvas.y + ny * canvas.height);

// title: tap NORMAL option
await tap(0.5, 196 / 300);
await page.waitForTimeout(700);
// prologue: skip via taps
for (let i = 0; i < 14; i++) {
  if (await page.evaluate(() => !!window.__map)) break;
  await tap(0.5, 0.5);
  await page.waitForTimeout(400);
}
await page.screenshot({ path: `${out}/m1-map.png` });
// Billy poster sign → modal → START DUEL button
await tap(0.62, 0.70);
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/m1b-poster-modal.png` });
await tap(0.5, 264 / 300);
await page.waitForTimeout(1000);
for (let i = 0; i < 8; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "options") break;
  await tap(0.5, 0.9);
  await page.waitForTimeout(400);
}
// tap option 2 (y = 130+26=156 of 300)
await tap(0.5, 156 / 300);
for (let i = 0; i < 8; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "race") break;
  await tap(0.5, 0.9);
  await page.waitForTimeout(400);
}
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/m2-race-hint.png` });
// tap during race: should focus the hidden input
await tap(0.5, 0.5);
await page.waitForTimeout(400);
const focused = await page.evaluate(() => document.activeElement?.id);
console.log("focused element after tap:", focused);
await page.screenshot({ path: `${out}/m3-after-tap.png` });
// type via the hidden input like a soft keyboard would
const word = await page.evaluate(() => window.__duel?.().word);
await page.locator("#mobile-type-input").fill(word.toLowerCase());
await page.waitForTimeout(600);
console.log("typed:", await page.evaluate(() => window.__duel?.().typed), "of", word.length);
await page.screenshot({ path: `${out}/m4-after-typing.png` });
console.log("ERRORS:", errors);
await browser.close();
