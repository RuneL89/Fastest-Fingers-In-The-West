// Verify that Rye's approved idle → draw → aim → fire sequence appears live.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 540, height: 640 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const out = "/mnt/agents/output/app/verification-shots";
const gameUrl = process.env.GAME_URL ?? "http://localhost:8899/";
const probe = () => page.evaluate(() => window.__duel?.());

await page.goto(gameUrl);
await page.waitForFunction(() => window.__GAME_READY__, null, { timeout: 30000 });
await page.keyboard.press("Space");
await page.waitForTimeout(500);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !!window.__map, null, { timeout: 60000 });

const canvas = await page.locator("canvas#game-canvas").boundingBox();
const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
await page.mouse.click(gx(0.29, 0.275).x, gx(0.29, 0.275).y);
await page.waitForTimeout(500);
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);

for (let i = 0; i < 6; i++) {
  if ((await probe())?.phase === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.keyboard.press("2");
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
assert.equal((await probe()).outlawPose, "three-finger-rye-idle");
await page.screenshot({ path: `${out}/rye-live-01-idle.png` });

await page.waitForFunction(() => window.__duel?.().outlawPose === "three-finger-rye-draw", null, { timeout: 30000 });
await page.screenshot({ path: `${out}/rye-live-02-draw.png` });
console.log("live pose: draw");

await page.waitForFunction(() => window.__duel?.().outlawPose === "three-finger-rye-aim", null, { timeout: 30000 });
await page.screenshot({ path: `${out}/rye-live-03-aim.png` });
console.log("live pose: aim");

await page.waitForFunction(() => window.__duel?.().phase === "resolve" && window.__duel?.().outlawPose === "three-finger-rye-fire", null, { timeout: 30000 });
await page.waitForTimeout(200);
await page.screenshot({ path: `${out}/rye-live-04-fire.png` });
assert.equal((await probe()).playerLives, 2);
console.log("live pose: fire; sheriff lives:", (await probe()).playerLives);
assert.deepEqual(errors, []);
console.log("CONSOLE ERRORS:", errors);
await browser.close();
