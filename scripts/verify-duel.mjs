// Reusable real-browser verification for any story-mode duel.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const locationId = process.env.LOCATION_ID;
const outlawId = process.env.OUTLAW_ID;
if (!locationId || !outlawId) throw new Error("Set LOCATION_ID and OUTLAW_ID");
const posterX = Number(process.env.POSTER_X);
const posterY = Number(process.env.POSTER_Y);
const exchanges = Number(process.env.EXCHANGES ?? 2);
const prefix = process.env.SHOT_PREFIX ?? locationId;
const gameUrl = process.env.GAME_URL ?? "http://localhost:8899/";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 2340 } });
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
if (locationId === "town-hall") {
  await page.keyboard.press("d");
  await page.waitForFunction(() => window.__map?.().unlocked === true, null, { timeout: 15000 });
  await page.waitForTimeout(800);
}

const canvas = await page.locator("canvas#game-canvas").boundingBox();
const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
await page.mouse.click(gx(posterX, posterY).x, gx(posterX, posterY).y);
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/${prefix}-01-modal.png` });
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);
await page.waitForFunction(() => !!window.__duel, null, { timeout: 15000 });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${out}/${prefix}-02-opening.png` });

for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(350);
}
assert.equal((await probe())?.phase, "options");
await page.screenshot({ path: `${out}/${prefix}-03-options.png` });
await page.keyboard.press("2");
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(350);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/${prefix}-04-race.png` });

for (let ex = 0; ex < exchanges; ex++) {
  const word = (await probe()).word;
  for (const ch of word.toLowerCase()) {
    await page.keyboard.press(ch);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(900);
  console.log(`after exchange ${ex + 1}:`, (await probe())?.phase, "lives:", (await probe())?.outlawLives);
  if (ex < exchanges - 1) {
    await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
    if (ex === 0) await page.screenshot({ path: `${out}/${prefix}-05-race2.png` });
  }
}
await page.waitForFunction(() => window.__duel?.().phase === "victory", null, { timeout: 15000 });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/${prefix}-06-victory.png` });

if (locationId === "town-hall") {
  for (let i = 0; i < 5; i++) {
    if (await page.evaluate(() => !!window.__ending)) break;
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
  }
  await page.waitForFunction(() => !!window.__ending, null, { timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${prefix}-07-ending.png` });
  console.log("ending:", await page.evaluate(() => window.__ending?.()));
} else {
  for (let i = 0; i < 5; i++) {
    if (await page.evaluate((id) => !!window.__map && window.__map().freed.includes(id), locationId)) break;
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
  }
  await page.waitForFunction((id) => window.__map?.().freed.includes(id), locationId, { timeout: 15000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${prefix}-07-map-freed.png` });
  console.log("map:", await page.evaluate(() => window.__map?.()));
}
assert.deepEqual(errors, []);
console.log("CONSOLE ERRORS:", errors);
await browser.close();
