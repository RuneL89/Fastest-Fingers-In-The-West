/**
 * verify-game.mjs — cold production playthrough of the complete story mode.
 * Serves dist, plays all six duels through their real posters and dialogue,
 * checks the five-goon Town Hall gate, five-life Bart finale, touch ending,
 * title return, and clean new-run reset. No debug unlocks or scene injection.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = existsSync(join(ROOT, "dist/public/index.html")) ? join(ROOT, "dist/public") : join(ROOT, "dist");
if (!existsSync(join(DIST, "index.html"))) throw new Error(`No build output at ${DIST}; run npm run build first`);
const SHOTS = join(ROOT, "verification-shots");
mkdirSync(SHOTS, { recursive: true });

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json",
  ".wasm": "application/wasm", ".ttf": "font/ttf", ".woff": "font/woff",
  ".woff2": "font/woff2", ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const raw = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const file = resolve(DIST, "." + decodeURIComponent(raw));
    if (file !== DIST && !file.startsWith(DIST + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 2340 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
const shot = (name) => page.screenshot({ path: join(SHOTS, name) });
const duel = () => page.evaluate(() => window.__duel?.());
const map = () => page.evaluate(() => window.__map?.());
const waitPhase = (phase) => page.waitForFunction((p) => window.__duel?.().phase === p, phase, { timeout: 20000 });

const locations = [
  { id: "main-street", outlaw: "yello-billy", x: 0.62, y: 0.70, lives: 2 },
  { id: "saloon", outlaw: "three-finger-rye", x: 0.29, y: 0.275, lives: 2 },
  { id: "gambling-den", outlaw: "sam-snakeeyes", x: 0.29, y: 0.77, lives: 2 },
  { id: "gold-mine", outlaw: "greg-goose", x: 0.75, y: 0.185, lives: 2 },
  { id: "church", outlaw: "dandy-dan", x: 0.185, y: 0.535, lives: 2 },
  { id: "town-hall", outlaw: "black-bart", x: 0.435, y: 0.565, lives: 5 },
];

try {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__GAME_READY__ === true, null, { timeout: 30000 });
  await shot("campaign-00-title.png");
  const canvas = await page.locator("canvas#game-canvas").boundingBox();
  assert.ok(canvas && canvas.width > 0 && canvas.height > 0, "Game canvas must be visible");
  const gx = (nx, ny) => ({ x: canvas.x + nx * canvas.width, y: canvas.y + ny * canvas.height });
  const tapGame = async (nx, ny) => {
    const p = gx(nx, ny);
    await page.mouse.click(p.x, p.y);
  };

  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !!window.__map, null, { timeout: 30000 });
  assert.deepEqual((await map()).freed, []);
  assert.equal((await map()).unlocked, false);
  assert.equal((await map()).lives, 3);

  // The real lock must reject Bart before any goon has been defeated.
  await tapGame(0.435, 0.565);
  await page.waitForTimeout(400);
  await shot("campaign-01-town-hall-locked.png");
  await tapGame(0.5, 0.88); // start-button area: must not start a duel
  await page.waitForTimeout(300);
  assert.ok(await page.evaluate(() => !!window.__map), "Locked Town Hall must stay on map");
  await tapGame(0.08, 0.12); // close through the scrim
  await page.waitForTimeout(300);

  for (let li = 0; li < locations.length; li++) {
    const loc = locations[li];
    if (loc.id === "town-hall") assert.equal((await map()).unlocked, true, "Town Hall opens after all five goons");
    await tapGame(loc.x, loc.y);
    await page.waitForTimeout(450);
    await tapGame(0.5, 264 / 300);
    await page.waitForFunction((id) => window.__duel?.().outlawPose === `${id}-idle`, loc.outlaw, { timeout: 20000 });

    for (let i = 0; i < 10 && (await duel()).phase !== "options"; i++) {
      await page.keyboard.press("Space");
      await page.waitForTimeout(180);
    }
    assert.equal((await duel()).phase, "options", `${loc.outlaw} opening dialogue`);
    await page.keyboard.press(String((li % 3) + 1));
    for (let i = 0; i < 10 && (await duel()).phase !== "race"; i++) {
      await page.keyboard.press("Space");
      await page.waitForTimeout(180);
    }
    await waitPhase("race");

    for (let ex = 0; ex < loc.lives; ex++) {
      const before = await duel();
      assert.ok(before.word.length > 0, "A shared typing word must be visible");
      if (li === 0 && ex === 0) {
        const wrong = before.word[0].toLowerCase() === "q" ? "z" : "q";
        await page.keyboard.press(wrong);
        await page.waitForTimeout(80);
        assert.equal((await duel()).typed, 0, "Wrong keys only waste time");
      }
      if (ex === 0) await shot(`campaign-${loc.id}-race.png`);
      await page.keyboard.type((await duel()).word.toLowerCase(), { delay: 18 });
      await page.waitForFunction((lives) => window.__duel?.().phase === "resolve" && window.__duel?.().outlawLives === lives, loc.lives - ex - 1, { timeout: 10000 });
      if (loc.id === "town-hall") {
        assert.equal((await duel()).repVisible, true, "Mayor stays visible throughout Bart's duel");
        assert.equal((await duel()).repPose, "rep-town-hall-flinch", "Mayor reacts to every shot");
      }
      if (ex < loc.lives - 1) await waitPhase("race");
    }
    await waitPhase("victory");
    assert.equal((await duel()).outlawLives, 0);
    if (loc.id === "church") {
      const states = (await duel()).npcPoses;
      assert.equal(states.filter((p) => p === "npc-matron-crying").length, 3, "All three matrons cry");
      assert.equal((await duel()).repPose, "rep-church-happy", "Father Merritt celebrates");
    }
    await shot(`campaign-${loc.id}-victory.png`);

    if (loc.id === "town-hall") {
      for (let i = 0; i < 8 && !(await page.evaluate(() => !!window.__ending)); i++) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(250);
      }
      await page.waitForFunction(() => window.__ending?.().stage === "celebration", null, { timeout: 15000 });
      const ending = await page.evaluate(() => window.__ending());
      assert.equal(ending.freed.length, 6, "All six locations are freed in the celebration");
      await shot("campaign-ending-celebration.png");
    } else {
      for (let i = 0; i < 8 && !(await map()).freed.includes(loc.id); i++) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(250);
      }
      await page.waitForFunction((id) => window.__map?.().freed.includes(id), loc.id, { timeout: 15000 });
      await page.waitForTimeout(500);
      assert.equal((await map()).freed.length, li + 1);
      assert.equal((await map()).unlocked, li === 4);
      console.log(`Freed ${loc.id}; campaign progress ${li + 1}/5`);
    }
  }

  // Complete the ending with pointer input, covering touch advancement.
  await tapGame(0.5, 0.45);
  await page.waitForFunction(() => window.__ending?.().stage === "closing", null, { timeout: 10000 });
  await page.waitForTimeout(500);
  await shot("campaign-ending-closing.png");
  await tapGame(0.5, 0.45); // finish typewriter reveal
  await page.waitForTimeout(250);
  await shot("campaign-ending-closing-full.png");
  await tapGame(0.5, 0.45); // return to title and reset only now
  await page.waitForFunction(() => window.__ending?.().complete === true, null, { timeout: 10000 });
  await shot("campaign-ending-title.png");

  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => window.__map?.().freed.length === 0 && window.__map().lives === 3, null, { timeout: 15000 });
  assert.equal((await map()).unlocked, false, "A new run locks Town Hall again");
  assert.deepEqual(errors, [], "No console or page errors during the campaign");
  console.log("VERIFY OK: full six-duel campaign, wrong keys, lock, representatives, five-life Bart, touch ending, title reset, zero browser errors");
} finally {
  await browser.close();
  server.close();
}
