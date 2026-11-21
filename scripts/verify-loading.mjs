// Delay artwork responses so the phone loading state can be inspected, then
// verify that the real map replaces it when loading completes.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
let imageIndex = 0;
await page.route("**/assets/*.png", async (route) => {
  const delay = 600 + (imageIndex++ % 10) * 200;
  await new Promise((resolve) => setTimeout(resolve, delay));
  await route.continue();
});
await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
await page.keyboard.press("Space");
await page.waitForTimeout(400);
await page.keyboard.press("Escape");
await page.waitForTimeout(1450);
await page.screenshot({ path: "/mnt/agents/output/app/verification-shots/bug-loading-bar.png" });
await page.waitForFunction(() => !!window.__map, null, { timeout: 60000 });
await page.waitForTimeout(300);
await page.screenshot({ path: "/mnt/agents/output/app/verification-shots/bug-map-after-loading.png" });
console.log("map after delayed load:", await page.evaluate(() => window.__map?.()));
console.log("ERRORS:", errors);
await browser.close();
