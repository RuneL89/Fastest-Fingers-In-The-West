// Reusable live idle → draw → aim → fire verification for any outlaw.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const outlawId = process.env.OUTLAW_ID;
if (!outlawId) throw new Error("Set OUTLAW_ID, POSTER_X and POSTER_Y");
const posterX = Number(process.env.POSTER_X);
const posterY = Number(process.env.POSTER_Y);
const prefix = process.env.SHOT_PREFIX ?? outlawId;
const gameUrl = process.env.GAME_URL ?? "http://localhost:8899/";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 540, height: 640 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const out = "/mnt/agents/output/app/verification-shots";
const probe = () => page.evaluate(() => window.__duel?.());

await page.goto(gameUrl);
await page.waitForFunction(() => window.__GAME_READY__, null, { timeout: 30000 });
await page.keyboard.press("Space");
await page.waitForTimeout(500);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !!window.__map, null, { timeout: 60000 });
if (outlawId === "black-bart") {
  await page.keyboard.press("d");
  await page.waitForFunction(() => window.__map?.().unlocked === true, null, { timeout: 15000 });
  await page.waitForTimeout(800);
}
const canvas = await page.locator("canvas#game-canvas").boundingBox();
const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
await page.mouse.click(gx(posterX, posterY).x, gx(posterX, posterY).y);
await page.waitForTimeout(500);
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(350);
}
await page.keyboard.press("2");
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(350);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
assert.equal((await probe()).outlawPose, `${outlawId}-idle`);
await page.screenshot({ path: `${out}/${prefix}-live-01-idle.png` });
await page.waitForFunction((id) => window.__duel?.().outlawPose === `${id}-draw`, outlawId, { timeout: 30000 });
await page.screenshot({ path: `${out}/${prefix}-live-02-draw.png` });
await page.waitForFunction((id) => window.__duel?.().outlawPose === `${id}-aim`, outlawId, { timeout: 30000 });
await page.screenshot({ path: `${out}/${prefix}-live-03-aim.png` });
await page.waitForFunction((id) => window.__duel?.().phase === "resolve" && window.__duel?.().outlawPose === `${id}-fire`, outlawId, { timeout: 30000 });
await page.waitForTimeout(200);
await page.screenshot({ path: `${out}/${prefix}-live-04-fire.png` });
assert.equal((await probe()).playerLives, 2);
assert.deepEqual(errors, []);
console.log(`Verified ${outlawId}: idle, draw, aim, fire. Sheriff lives:`, (await probe()).playerLives);
await browser.close();
