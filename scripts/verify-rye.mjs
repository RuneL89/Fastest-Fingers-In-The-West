// Phase 2 verification: full Three-Finger Rye duel in the saloon.
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

// saloon poster sign (0.29, 0.275) → modal → START DUEL
await page.mouse.click(gx(0.29, 0.275).x, gx(0.29, 0.275).y);
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/rye-01-modal.png` });
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/rye-02-opening.png` });
console.log("phase:", (await probe())?.phase);

for (let i = 0; i < 6; i++) {
  if ((await probe())?.phase === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.screenshot({ path: `${out}/rye-03-options.png` });
console.log("phase:", (await probe())?.phase);
await page.keyboard.press("2");
for (let i = 0; i < 8; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/rye-04-race.png` });

// two winning exchanges
for (let ex = 0; ex < 2; ex++) {
  const word = (await probe()).word;
  for (const ch of word.toLowerCase()) { await page.keyboard.press(ch); await page.waitForTimeout(70); }
  await page.waitForTimeout(900);
  console.log(`after exchange ${ex + 1}:`, (await probe())?.phase, "lives:", (await probe())?.outlawLives);
  if (ex === 0) {
    await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
    await page.screenshot({ path: `${out}/rye-05-race2.png` });
  }
}
await page.waitForFunction(() => window.__duel?.().phase === "victory", null, { timeout: 15000 });
await page.waitForTimeout(1800); // let the barkeeper's full thank-you reveal
await page.screenshot({ path: `${out}/rye-06-victory.png` });

// thank-you advance → map with freed saloon and the barman rep
for (let i = 0; i < 5; i++) {
  if (await page.evaluate(() => !!window.__map && window.__map().freed.includes("saloon"))) break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/rye-07-map-freed.png` });
console.log("map:", await page.evaluate(() => window.__map?.()));
console.log("CONSOLE ERRORS:", errors);
await browser.close();
