// Title soft-keyboard start: tap focuses input, space char starts the game.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
const canvas = await page.locator("canvas#game-canvas").boundingBox();
// tap a neutral spot on the title (not a difficulty option)
await page.touchscreen.tap(canvas.x + canvas.width / 2, canvas.y + 30);
await page.waitForTimeout(400);
console.log("focused:", await page.evaluate(() => document.activeElement?.id));
// soft keyboard space = start
await page.locator("#mobile-type-input").pressSequentially(" ");
await page.waitForTimeout(800);
console.log("prologue visible:", await page.evaluate(() => !!document.querySelector("canvas")));
await page.screenshot({ path: "/mnt/agents/output/app/verification-shots/m5-space-start.png" });
// advance prologue with soft spaces until the map. MapScene needs no typing
// input, so the field can disappear while its artwork is still loading.
for (let i = 0; i < 16; i++) {
  if (await page.evaluate(() => !!window.__map)) break;
  const input = page.locator("#mobile-type-input");
  if (await input.count()) {
    await input.pressSequentially(" ");
    await page.waitForTimeout(400);
  } else {
    await page.waitForFunction(() => !!window.__map, null, { timeout: 60000 });
    break;
  }
}
const mapReached = await page.evaluate(() => !!window.__map);
console.log("map reached via soft space:", mapReached);
if (!mapReached) throw new Error("Soft-keyboard spaces did not reach the map");
await browser.close();
