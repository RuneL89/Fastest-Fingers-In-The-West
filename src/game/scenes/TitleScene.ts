/**
 * TitleScene.ts — title wordmark + difficulty select → prologue.
 */
import Phaser from "phaser";
import { VIEW, PAL } from "../config";
import { run, resetRun, type Difficulty } from "../state";
import { AudioSystem } from "../audio";
import { GameInput } from "../input";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;

export class TitleScene extends Phaser.Scene {
  private audio!: AudioSystem;
  private keys!: GameInput;
  private options: Phaser.GameObjects.Text[] = [];
  private selected = 1;
  private blink = 0;

  constructor() { super("title"); }

  create(): void {
    this.keys = new GameInput();
    this.keys.attach();
    this.keys.onControl = (k) => {
      if (k === "start") this.start((["easy", "normal", "hard"] as Difficulty[])[this.selected]);
    };
    this.events.once("shutdown", () => this.keys.dispose());
    this.audio = new AudioSystem();
    this.audio.setMood("title");
    this.cameras.main.setBackgroundColor("#1a0f06");

    this.add.text(CX, 62, "FASTEST", {
      fontFamily: FONT, fontSize: "24px", color: PAL.gold,
      stroke: PAL.brownDark, strokeThickness: 5,
    }).setOrigin(0.5);
    this.add.text(CX, 92, "FINGERS", {
      fontFamily: FONT, fontSize: "24px", color: PAL.gold,
      stroke: PAL.brownDark, strokeThickness: 5,
    }).setOrigin(0.5);
    this.add.text(CX, 120, "IN THE WEST", {
      fontFamily: FONT, fontSize: "12px", color: PAL.white,
      stroke: PAL.brownDark, strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(CX, 168, "CHOOSE YOUR DUEL SPEED", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(0.5);

    const labels = ["EASY", "NORMAL", "HARD"];
    labels.forEach((label, i) => {
      const t = this.add.text(CX, 196 + i * 18, label, {
        fontFamily: FONT, fontSize: "8px", color: PAL.white,
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => { this.selected = i; this.refreshOptions(); })
        .on("pointerdown", () => this.start(label.toLowerCase() as Difficulty));
      this.options.push(t);
    });
    this.refreshOptions();

    this.add.text(CX, 266, "TYPE THE WORD FIRST.\nWRONG KEYS JUST WASTE TIME.", {
      fontFamily: FONT, fontSize: "8px", color: PAL.grayLight, align: "center",
    }).setOrigin(0.5);
    this.add.text(CX, 292, "UP/DOWN + SPACE, OR TAP\nON PHONE: TAP, THEN SPACE", {
      fontFamily: FONT, fontSize: "8px", color: PAL.gray,
    }).setOrigin(0.5);

    const up = this.input.keyboard!.addKey("UP");
    const down = this.input.keyboard!.addKey("DOWN");
    up.on("down", () => { this.selected = (this.selected + 2) % 3; this.refreshOptions(); });
    down.on("down", () => { this.selected = (this.selected + 1) % 3; this.refreshOptions(); });
    this.input.keyboard!.on("keydown-SPACE", () => {
      this.start((["easy", "normal", "hard"] as Difficulty[])[this.selected]);
    });
    this.input.keyboard!.on("keydown-ENTER", () => {
      this.start((["easy", "normal", "hard"] as Difficulty[])[this.selected]);
    });

    window.__GAME_READY__ = true;
  }

  private refreshOptions(): void {
    this.options.forEach((t, i) => {
      if (!t.active) return;
      t.setText(i === this.selected ? `> ${["EASY", "NORMAL", "HARD"][i]} <` : `  ${["EASY", "NORMAL", "HARD"][i]}  `);
      t.setColor(i === this.selected ? PAL.gold : PAL.white);
    });
  }

  private start(difficulty: Difficulty): void {
    run.difficulty = difficulty;
    resetRun();
    this.audio.sfx("ui");
    this.scene.start("prologue");
  }
}
