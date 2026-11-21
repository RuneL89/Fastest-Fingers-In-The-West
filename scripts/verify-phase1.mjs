// Phase 1 verification: drive the full loop and screenshot key states.
import { chromium } from "playwright";
import fs from "node:fs";

const out = "/mnt/agents/output/app/verification-shots";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 540, height: 640 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

const shot = (name) => page.screenshot({ path: `${out}/${name}.png` });
const probe = () => page.evaluate(() => window.__duel?.());

await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
await page.waitForTimeout(600);
await shot("01-title");

// difficulty: NORMAL default, start
await page.keyboard.press("Space");
await page.waitForTimeout(800);
await shot("02-prologue");
for (let i = 0; i < 14; i++) {
  if (await page.evaluate(() => !!window.__map)) break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}
await page.waitForTimeout(600);
await shot("03-map");

// click Billy's poster (map hotspot 0.70,0.70 of 270x300 game view)
// find canvas position: FIT scale — canvas fills 540 wide, height 600
const canvas = await page.locator("canvas#game-canvas").boundingBox();
const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
const billy = gx(0.70, 0.70);
await page.mouse.click(billy.x, billy.y);
await page.waitForTimeout(1200);
await shot("04-duel-opening");
console.log("phase:", (await probe())?.phase);

// advance to options
await page.keyboard.press("Space");
await page.waitForTimeout(600);
await shot("05-options");
console.log("phase:", (await probe())?.phase);

// pick option 2 (dry wit)
await page.keyboard.press("2");
await page.waitForTimeout(800);
await shot("06-closing");

// advance to race (first Space may just finish the typewriter reveal)
for (let i = 0; i < 6; i++) {
  if ((await probe())?.phase === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", { timeout: 15000 });
await shot("07-race");

// type the word
const word = (await probe()).word;
for (const ch of word.toLowerCase()) { await page.keyboard.press(ch); await page.waitForTimeout(90); }
await page.waitForTimeout(600);
console.log("after word 1:", await probe());
await shot("08-hit");

// second exchange
await page.waitForFunction(() => window.__duel?.().phase === "race", { timeout: 15000 });
const word2 = (await probe()).word;
for (const ch of word2.toLowerCase()) { await page.keyboard.press(ch); await page.waitForTimeout(90); }
await page.waitForTimeout(1000);
console.log("after word 2:", await probe());
await shot("09-victory");

// thank-you advance → map with freed main street
for (let i = 0; i < 5; i++) {
  if (await page.evaluate(() => !!window.__map && (window.__map().freed.length > 0))) break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(600);
}
await page.waitForTimeout(800);
await shot("10-map-freed");
console.log("map:", await page.evaluate(() => window.__map?.()));

console.log("CONSOLE ERRORS:", errors);
await browser.close();
