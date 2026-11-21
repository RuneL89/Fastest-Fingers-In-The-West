/**
 * GameOverScene.ts — third lost life: GAME OVER card + narrator line.
 * Starting again begins the run from the top (RULES.md).
 */
import Phaser from "phaser";
import { VIEW, PAL } from "../config";
import { resetRun } from "../state";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;

export class GameOverScene extends Phaser.Scene {
  constructor() { super("gameover"); }

  create(): void {
    this.cameras.main.setBackgroundColor("#000000");
    this.add.text(CX, 100, "GAME OVER", {
      fontFamily: FONT, fontSize: "20px", color: PAL.darkRed,
      stroke: PAL.brownDark, strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(CX, 156, "THE BUFFALO GANG KEEPS\nTOMBWOOD CREEK... FOR NOW.", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream, align: "center", lineSpacing: 6,
    }).setOrigin(0.5);
    this.add.text(CX, 232, "SPACE/TAP: NEW RUN", {
      fontFamily: FONT, fontSize: "8px", color: PAL.white,
    }).setOrigin(0.5);

    const restart = () => {
      resetRun();
      this.scene.start("title");
    };
    this.input.keyboard!.on("keydown-SPACE", restart);
    this.input.keyboard!.on("keydown-ENTER", restart);
    this.input.on("pointerdown", restart);
  }
}
