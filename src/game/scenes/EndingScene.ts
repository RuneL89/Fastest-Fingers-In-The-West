/**
 * EndingScene.ts — the freed town, then a short narrator closing and title.
 * The run is reset only after the player leaves the ending, so every freed
 * representative remains visible throughout the celebration.
 */
import Phaser from "phaser";
import { VIEW, PAL, RENDER_SCALE } from "../config";
import { LOCATIONS } from "../data/locations";
import { resetRun, run } from "../state";
import { TextBox } from "../ui/TextBox";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;
const CLOSING = "The mine rings with picks again, the piano plays every night, and Tombwood Creek is quiet the way it likes to be. Somebody had to do something. Good thing you showed up, Sheriff.";

export class EndingScene extends Phaser.Scene {
  private stage: "celebration" | "closing" = "celebration";
  private box?: TextBox;
  private finished = false;
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "ending",
      cameras: {
        zoom: RENDER_SCALE,
        scrollX: -VIEW.W * (RENDER_SCALE - 1) / 2,
        scrollY: -VIEW.H * (RENDER_SCALE - 1) / 2,
      },
    });
  }

  create(): void {
    this.stage = "celebration";
    this.finished = false;
    this.box = undefined;
    this.cameras.main.setBackgroundColor("#241608");
    this.add.image(0, 0, "map").setOrigin(0, 0).setDisplaySize(VIEW.W, VIEW.H);

    for (const loc of LOCATIONS) {
      if (!loc.repKey) continue;
      const key = `${loc.repKey}-happy`;
      const image = this.add.image(loc.mapX * VIEW.W, loc.mapY * VIEW.H, key);
      image.setScale(30 / image.height);
    }

    this.add.rectangle(CX, 30, VIEW.W, 44, 0x000000, 0.72);
    this.add.text(CX, 23, "TOMBWOOD CREEK", {
      fontFamily: FONT, fontSize: "14px", color: PAL.gold,
      stroke: PAL.brownDark, strokeThickness: 3,
    }).setOrigin(0.5);
    this.add.text(CX, 41, "IS FREE!", {
      fontFamily: FONT, fontSize: "12px", color: PAL.cream,
      stroke: PAL.brownDark, strokeThickness: 3,
    }).setOrigin(0.5);

    this.hint = this.add.text(CX, 288, "SPACE/TAP: EPILOGUE", {
      fontFamily: FONT, fontSize: "8px", color: PAL.white,
      stroke: PAL.black, strokeThickness: 3,
    }).setOrigin(0.5);

    this.input.keyboard!.on("keydown-SPACE", () => this.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.advance());
    this.input.on("pointerdown", () => this.advance());

    window.__ending = () => ({
      stage: this.stage,
      freed: [...run.freed],
      complete: this.finished,
    });
  }

  private advance(): void {
    if (this.finished) return;
    if (this.stage === "closing") {
      this.box?.advance();
      return;
    }
    this.showClosing();
  }

  private showClosing(): void {
    this.stage = "closing";
    this.add.rectangle(CX, VIEW.H / 2, VIEW.W, VIEW.H, 0x100800, 0.66).setDepth(20);
    this.add.text(CX, 72, "A QUIET TOWN AGAIN", {
      fontFamily: FONT, fontSize: "12px", color: PAL.gold,
      stroke: PAL.brownDark, strokeThickness: 3,
      align: "center", wordWrap: { width: VIEW.W - 24 },
    }).setOrigin(0.5).setDepth(21);
    this.box = new TextBox(this, 126, "down");
    this.box.onAdvance = () => this.finish();
    this.box.say(null, CLOSING);
    this.hint.setText("SPACE/TAP: TITLE").setDepth(101);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    resetRun();
    this.scene.start("title");
  }

  update(time: number, delta: number): void {
    this.box?.update(time, delta);
  }
}
