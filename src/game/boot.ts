/**
 * boot.ts — startGame(canvas)/stopGame() contract used by pages/Home.tsx.
 * Phaser renders into the existing #game-canvas with a high-resolution backing
 * store, so detailed artwork stays sharp on modern phone screens.
 */
import Phaser from "phaser";
import { TitleScene } from "./scenes/TitleScene";
import { PrologueScene } from "./scenes/PrologueScene";
import { MapScene } from "./scenes/MapScene";
import { DuelScene } from "./scenes/DuelScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { EndingScene } from "./scenes/EndingScene";
import { VIEW, RENDER_SCALE } from "./config";

let game: Phaser.Game | null = null;
/**
 * StrictMode mounts the hosting effect twice and startGame awaits font
 * loading, so without this token both continuations would create a Phaser
 * game on the canvas. The leftover game's input listeners eat every pointer
 * event (they preventDefault before the visible game sees it).
 */
let startToken = 0;

export async function startGame(canvas: HTMLCanvasElement): Promise<void> {
  stopGame();
  const token = ++startToken;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('8px "Press Start 2P"'),
        document.fonts.load('24px "Press Start 2P"'),
      ]),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  } catch {
    // font failed: monospace fallback still renders the game
  }
  if (token !== startToken) return; // a newer startGame or stopGame superseded us
  game = new Phaser.Game({
    type: Phaser.CANVAS,
    canvas,
    parent: "game-root",
    width: VIEW.W * RENDER_SCALE,
    height: VIEW.H * RENDER_SCALE,
    pixelArt: true,
    roundPixels: true,
    render: { preserveDrawingBuffer: true },
    backgroundColor: "#000000",
    banner: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEW.W * RENDER_SCALE,
      height: VIEW.H * RENDER_SCALE,
    },
    scene: [TitleScene, PrologueScene, MapScene, DuelScene, GameOverScene, EndingScene],
  });
}

export function stopGame(): void {
  startToken++; // invalidate any in-flight startGame continuation
  if (game) {
    game.destroy(true);
    game = null;
  }
}
