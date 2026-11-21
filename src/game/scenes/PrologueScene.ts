/**
 * PrologueScene.ts — narrator text slides before the map.
 * Illustrated slides arrive in Phase 5A; v1 shows text over tinted panels.
 */
import Phaser from "phaser";
import { VIEW, PAL } from "../config";
import { PROLOGUE } from "../data/dialogue";
import { TextBox } from "../ui/TextBox";
import { GameInput } from "../input";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;

export class PrologueScene extends Phaser.Scene {
  private box!: TextBox;
  private index = 0;
  private skipText!: Phaser.GameObjects.Text;
  private keys!: GameInput;

  constructor() { super("prologue"); }

  create(): void {
    this.keys = new GameInput();
    this.keys.attach();
    this.keys.onControl = (k) => { if (k === "start") this.box.advance(); };
    this.events.once("shutdown", () => this.keys.dispose());
    this.cameras.main.setBackgroundColor("#241608");
    this.add.text(CX, 60, "TOMBWOOD CREEK", {
      fontFamily: FONT, fontSize: "16px", color: PAL.gold,
      stroke: PAL.brownDark, strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(CX, 96, "A STORY IN THE DUST", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(0.5);

    this.box = new TextBox(this, 140);
    this.box.onAdvance = () => this.next();
    this.showSlide();

    this.skipText = this.add.text(CX, 288, "SPACE/TAP: NEXT   ESC: SKIP", {
      fontFamily: FONT, fontSize: "8px", color: PAL.gray,
    }).setOrigin(0.5);

    this.input.keyboard!.on("keydown-SPACE", () => this.box.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.box.advance());
    this.input.keyboard!.on("keydown-ESC", () => this.scene.start("map"));
    this.input.on("pointerdown", () => this.box.advance());
  }

  private showSlide(): void {
    this.box.say(null, PROLOGUE[this.index]);
  }

  private next(): void {
    this.index++;
    if (this.index >= PROLOGUE.length) {
      this.scene.start("map");
    } else {
      this.showSlide();
    }
  }

  update(time: number, delta: number): void {
    this.box.update(time, delta);
  }
}
