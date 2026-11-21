// Verify the actual outlaw word illuminates gradually at a playable pace.
import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 540, height: 640 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const out = "/mnt/agents/output/app/verification-shots";

await page.goto("http://localhost:8899/");
await page.waitForFunction(() => window.__GAME_READY__, null, { timeout: 30000 });
await page.keyboard.press("Space"); // EASY is default-selected? title defaults to NORMAL
await page.waitForTimeout(500);
await page.keyboard.press("Escape");
await page.waitForFunction(() => !!window.__map, null, { timeout: 60000 });

const canvas = await page.locator("canvas#game-canvas").boundingBox();
const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
await page.mouse.click(gx(0.62, 0.70).x, gx(0.62, 0.70).y);
await page.waitForTimeout(500);
await page.mouse.click(gx(0.5, 264 / 300).x, gx(0.5, 264 / 300).y);
for (let i = 0; i < 6; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "options") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.keyboard.press("1");
for (let i = 0; i < 8; i++) {
  if ((await page.evaluate(() => window.__duel?.().phase)) === "race") break;
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
}
await page.waitForFunction(() => window.__duel?.().phase === "race", null, { timeout: 15000 });
const start = Date.now();

// sample aiChars over time: the shared word should illuminate slowly
const samples = [];
for (let i = 0; i < 4; i++) {
  await page.waitForTimeout(1500);
  const s = await page.evaluate(() => {
    const d = window.__duel();
    return { t: Date.now(), ai: d.aiChars, len: d.word.length, word: d.word, phase: d.phase };
  });
  samples.push(s);
  if (i === 1) await page.screenshot({ path: `${out}/pace-race-mid.png` });
  if (s.phase !== "race") break;
}
console.log("samples:", samples.map((s) => `${s.ai}/${s.len}`).join(" → "), "word:", samples[0].word);

// how long until the outlaw finishes an exchange by itself?
await page.waitForFunction(() => window.__duel?.().phase === "resolve" && window.__duel?.().aiChars > 0, null, { timeout: 60000 }).catch(() => {});
const elapsed = (Date.now() - start) / 1000;
const st = await page.evaluate(() => window.__duel());
console.log(`outlaw finished '${st.word}' in ~${elapsed.toFixed(1)}s, aiChars=${st.aiChars}, phase=${st.phase}`);
await page.screenshot({ path: `${out}/pace-resolve.png` });
console.log("ERRORS:", errors);
await browser.close();
