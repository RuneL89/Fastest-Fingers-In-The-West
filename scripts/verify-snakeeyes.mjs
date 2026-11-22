// Phase 3 verification: full Sam Snakeeyes duel in the gambling den.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 2340 } });
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

// Gambling-den poster sign (0.29, 0.77) → modal → START DUEL.
await page.mouse.click(gx(0.29, 0.77).x, gx(0.29, 0.77).y);
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/snakeeyes-01-modal.png` });
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);
await page.waitForFunction(() => !!window.__duel, null, { timeout: 15000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/snakeeyes-02-opening.png` });
console.log("phase:", (await probe())?.phase);

for (let i = 0; i < 6; i++) {
  if ((await probe())?.phase === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
assert.equal((await probe())?.phase, "options");
await page.screenshot({ path: `${out}/snakeeyes-03-options.png` });
await page.mouse.click(gx(0.5, 170 / 300).x, gx(0.5, 170 / 300).y);
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/snakeeyes-04-race.png` });

// Win both exchanges with the same visible word used by the outlaw.
for (let ex = 0; ex < 2; ex++) {
  const word = (await probe()).word;
  for (const ch of word.toLowerCase()) {
    await page.keyboard.press(ch);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(900);
  console.log(`after exchange ${ex + 1}:`, (await probe())?.phase, "lives:", (await probe())?.outlawLives);
  if (ex === 0) {
    await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
    await page.screenshot({ path: `${out}/snakeeyes-05-race2.png` });
  }
}
await page.waitForFunction(() => window.__duel?.().phase === "victory", null, { timeout: 15000 });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${out}/snakeeyes-06-victory.png` });

// Thank-you advance → freed den and Busted Ben on the town map.
for (let i = 0; i < 5; i++) {
  if (await page.evaluate(() => !!window.__map && window.__map().freed.includes("gambling-den"))) break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}
await page.waitForFunction(() => window.__map?.().freed.includes("gambling-den"), null, { timeout: 15000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/snakeeyes-07-map-freed.png` });
console.log("map:", await page.evaluate(() => window.__map?.()));
assert.deepEqual(errors, []);
console.log("CONSOLE ERRORS:", errors);
await browser.close();
