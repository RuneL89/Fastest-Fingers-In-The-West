/**
 * verify-game.mjs — Playwright self-check for Fastest Fingers in the West.
 * Serves dist → zero console errors → screenshots of every key state →
 * real gameplay assertions: lenient wrong keys, winning exchanges, pause,
 * mute, restart, outlaw defeat + bounty, game over, full ladder victory,
 * endless mode entry.
 *
 * Usage: npm run build && node scripts/verify-game.mjs
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = existsSync(join(ROOT, "dist/public/index.html")) ? join(ROOT, "dist/public") : join(ROOT, "dist");
if (!existsSync(join(DIST, "index.html"))) {
  console.error(`VERIFY FAIL: no build output at ${DIST} — run npm run build first`);
  process.exit(1);
}
const SHOTS = join(ROOT, "verification-shots");
mkdirSync(SHOTS, { recursive: true });
const CANVAS_ID = "game-canvas";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".json": "application/json", ".wasm": "application/wasm", ".ttf": "font/ttf" };
const server = createServer(async (req, res) => {
  try {
    const raw = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    let path;
    try { path = decodeURIComponent(raw); } catch { path = raw; }
    const file = resolve(DIST, "." + path);
    if (file !== DIST && !file.startsWith(DIST + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
const fail = (msg) => { console.error("VERIFY FAIL:", msg); server.close(); process.exit(1); };

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const CANDIDATES = [process.env.CHROMIUM_PATH, "/usr/bin/chromium", "/opt/gchrome/opt/google/chrome/chrome", "/usr/bin/chromium-browser", "/usr/bin/google-chrome"].filter(Boolean);
let browser;
for (const exe of [null, ...CANDIDATES]) {
  try {
    browser = await chromium.launch(exe ? { executablePath: exe, args: ["--no-sandbox", "--disable-gpu-sandbox", "--use-gl=swiftshader"] } : {});
    break;
  } catch { /* next */ }
}
if (!browser) fail("no usable browser found");
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push(String(e)));

const probe = () => page.evaluate(() => window.__duel());
const waitPhase = (phase, timeout = 30000) =>
  page.waitForFunction((p) => window.__duel && window.__duel().phase === p, phase, { timeout });
const shot = (name) => page.screenshot({ path: join(SHOTS, name) });

await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__GAME_READY__ === true, null, { timeout: 10000 })
  .catch(() => fail("window.__GAME_READY__ never turned true"));
await page.waitForTimeout(900);

// 1) canvas actually renders (drawing-buffer readback, robust on swiftshader)
const canvasCheck = await page.evaluate((id) => {
  const SAMPLES = [[0.5, 0.5], [0.25, 0.5], [0.75, 0.5], [0.5, 0.25], [0.5, 0.75]];
  const el = document.getElementById(id);
  if (!(el instanceof HTMLCanvasElement)) return { kind: "no-canvas" };
  const gl = el.getContext("webgl2") || el.getContext("webgl");
  if (gl) {
    const px = new Uint8Array(4);
    let lit = 0;
    for (const [fx, fy] of SAMPLES) {
      gl.readPixels((gl.drawingBufferWidth * fx) | 0, (gl.drawingBufferHeight * fy) | 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      if (px[3] > 0 && px[0] + px[1] + px[2] > 8) lit++;
    }
    return { kind: "lit", lit };
  }
  const ctx = el.getContext("2d");
  if (ctx) {
    let lit = 0;
    for (const [fx, fy] of SAMPLES) {
      const d = ctx.getImageData((el.width * fx) | 0, (el.height * fy) | 0, 1, 1).data;
      if (d[3] > 0 && d[0] + d[1] + d[2] > 8) lit++;
    }
    return { kind: "lit", lit };
  }
  return { kind: "no-context" };
}, CANVAS_ID);
if (canvasCheck.kind !== "lit" || canvasCheck.lit < 2) fail(`canvas render check: ${JSON.stringify(canvasCheck)}`);
await shot("01-title.png");

// 2) start a run, reach the first race
await page.keyboard.press("Space");
await waitPhase("race");
await page.waitForTimeout(150);
await shot("02-race.png");

// 3) lenient wrong-key rule: a wrong letter must not advance progress
let s = await probe();
const wrong = s.word[0].toLowerCase() === "q" ? "z" : "q";
await page.keyboard.press(wrong);
await page.waitForTimeout(120);
s = await probe();
if (s.typed !== 0) fail(`wrong key advanced typing progress (typed=${s.typed})`);

// 4) type the word, win the exchange, screenshot the shot
await page.keyboard.type(s.word.toLowerCase(), { delay: 12 });
await waitPhase("resolve");
await shot("03-shot.png");
await page.waitForFunction(() => window.__duel().phase !== "resolve", null, { timeout: 10000 });
s = await probe();
if (s.outlawLives !== 2) fail(`outlaw should have 2 lives after losing exchange, got ${s.outlawLives}`);

// 5) pause / resume / mute
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
s = await probe();
if (!s.paused) fail("Esc did not pause");
await shot("04-paused.png");
await page.keyboard.press("m");
await page.waitForTimeout(120);
s = await probe();
if (!s.muted) fail("M did not mute");
await page.keyboard.press("m");
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
s = await probe();
if (s.paused) fail("Esc did not resume");

// 6) finish outlaw #1: win exchanges until he goes down, bounty must register
for (let i = 0; i < 6; i++) {
  s = await probe();
  if (s.outlawIndex > 0) break;
  if (s.phase === "outlawdown") {
    await shot("05-outlawdown.png");
    await page.waitForFunction(() => window.__duel().outlawIndex > 0, null, { timeout: 15000 });
    break;
  }
  await waitPhase("race");
  s = await probe();
  await page.keyboard.type(s.word.toLowerCase(), { delay: 8 });
  await page.waitForTimeout(400);
}
s = await probe();
if (s.outlawIndex < 1 || s.bounty !== 100) fail(`outlaw 1 not defeated correctly: ${JSON.stringify(s)}`);
if (!existsSync(join(SHOTS, "05-outlawdown.png"))) await shot("05-outlawdown.png");

// 7) pause -> R restarts the run (bounty and lives reset)
await page.keyboard.press("Escape");
await page.waitForTimeout(150);
await page.keyboard.press("r");
await page.waitForTimeout(200);
s = await probe();
if (s.outlawIndex !== 0 || s.bounty !== 0 || s.playerLives !== 3 || s.paused) fail(`restart via R broken: ${JSON.stringify(s)}`);

// 8) game over by idling (opponent outdraws us 3 times)
await page.waitForFunction(() => window.__duel().phase === "gameover", null, { timeout: 90000 });
await shot("06-gameover.png");
s = await probe();
if (s.playerLives !== 0) fail("game over with lives remaining?");

// 9) full ladder victory: win every exchange by typing fast
await page.keyboard.press("Space");
const deadline = Date.now() + 240000;
let won = false;
while (Date.now() < deadline) {
  s = await probe();
  if (s.phase === "victory") { won = true; break; }
  if (s.phase === "gameover") fail("lost the run during victory playthrough (typing should always win)");
  if (s.phase === "race") {
    await page.keyboard.type(s.word.toLowerCase(), { delay: 5 });
    await page.waitForTimeout(250);
  } else {
    await page.waitForTimeout(200);
  }
}
if (!won) fail("never reached victory within the playthrough budget");
await shot("07-victory.png");

// 10) endless mode
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
s = await probe();
if (s.endlessCycle !== 1) fail(`Enter did not start endless mode: ${JSON.stringify(s)}`);

if (consoleErrors.length) fail(`${consoleErrors.length} console error(s): ${consoleErrors[0]}`);
await browser.close();
server.close();
console.log("VERIFY OK: render/start/lenient-keys/win/pause/mute/restart/bounty/gameover/victory/endless all passed; screenshots in verification-shots/");
