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
import { VIEW, RENDER_SCALE } from "./config";

let game: Phaser.Game | null = null;

export async function startGame(canvas: HTMLCanvasElement): Promise<void> {
  stopGame();
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
    scene: [TitleScene, PrologueScene, MapScene, DuelScene, GameOverScene],
  });
}

export function stopGame(): void {
  if (game) {
    game.destroy(true);
    game = null;
  }
}
