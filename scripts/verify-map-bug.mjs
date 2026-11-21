// Reproduce: full flow to the map on a phone-sized touch device.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log(m.type(), m.text().slice(0, 300)); });
page.on("pageerror", (e) => console.log("PAGEERROR", e.stack?.slice(0, 600)));
page.on("requestfailed", (r) => console.log("REQFAIL", r.url().slice(-60), r.failure()?.errorText));

await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
const canvas = await page.locator("canvas#game-canvas").boundingBox();
const tap = async (nx, ny) => page.touchscreen.tap(canvas.x + nx * canvas.width, canvas.y + ny * canvas.height);
await tap(0.5, 196 / 300);
await page.waitForTimeout(700);
// Finish the first narrator reveal and inspect the complete wrapped paragraph.
await tap(0.5, 0.5);
await page.waitForTimeout(150);
await page.screenshot({ path: "/mnt/agents/output/app/verification-shots/bug-prologue-fixed.png" });
for (let i = 0; i < 16; i++) {
  if (await page.evaluate(() => !!window.__map)) break;
  await tap(0.5, 0.5);
  await page.waitForTimeout(400);
}
await page.waitForTimeout(1500);
console.log("map state:", await page.evaluate(() => window.__map?.()));
await page.screenshot({ path: "/mnt/agents/output/app/verification-shots/bug-map.png" });
// also check canvas pixel content: is anything drawn?
const px = await page.evaluate(() => {
  const c = document.querySelector("canvas#game-canvas");
  const g = c.getContext("2d");
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let nonblack = 0;
  for (let i = 0; i < d.length; i += 4) if (d[i] + d[i+1] + d[i+2] > 30) nonblack++;
  return { w: c.width, h: c.height, nonblack };
});
console.log("canvas pixels:", px);
await browser.close();
