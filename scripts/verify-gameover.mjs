// Game-over path: lose all three lives by never typing; also test Town Hall lock.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 540, height: 640 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(e.stack ?? String(e)));
const out = "/mnt/agents/output/app/verification-shots";

await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, { timeout: 20000 });
await page.keyboard.press("Space"); // normal
await page.waitForTimeout(500);
await page.keyboard.press("Escape"); // skip prologue
await page.waitForFunction(() => !!window.__map, { timeout: 10000 });

// Town Hall locked toast
const canvas = await page.locator("canvas#game-canvas").boundingBox();
await page.mouse.click(canvas.x + 0.64 * canvas.width, canvas.y + 0.45 * canvas.height);
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/11-townhall-locked.png` });
await page.waitForTimeout(2200);

// into Billy's duel
await page.mouse.click(canvas.x + 0.55 * canvas.width, canvas.y + 0.70 * canvas.height);
await page.waitForTimeout(1000);
for (let i = 0; i < 6; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}
await page.keyboard.press("1");
for (let i = 0; i < 6; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}

// never type: wait for game over
await page.waitForFunction(() => window.__duel?.().playerLives === 0, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/12-gameover.png` });
console.log("gameover shot taken; lives:", await page.evaluate(() => window.__duel?.().playerLives));

// restart from game over
await page.keyboard.press("Space");
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/13-restart-title.png` });

// Start another full run: the prologue and duel must reset, not reuse old state.
await page.keyboard.press("Space");
await page.waitForTimeout(600);
await page.screenshot({ path: `${out}/14-second-run-prologue.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(700);
await page.mouse.click(canvas.x + 0.55 * canvas.width, canvas.y + 0.70 * canvas.height);
await page.waitForFunction(() => window.__duel?.().phase === "opening", null, { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/15-second-run-duel.png` });
console.log("second run duel:", await page.evaluate(() => window.__duel?.().phase));
console.log("CONSOLE ERRORS:", errors);
await browser.close();
