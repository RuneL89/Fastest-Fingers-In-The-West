/**
 * LoadingBar.ts — visible progress while a scene downloads its artwork.
 */
import Phaser from "phaser";
import { VIEW, PAL } from "../config";

const FONT = '"Press Start 2P", monospace';

export class LoadingBar extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  private percent: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, label: string) {
    super(scene, 0, 0);
    scene.cameras.main.setBackgroundColor("#241608");

    const title = scene.add.text(VIEW.W / 2, 126, label, {
      fontFamily: FONT,
      fontSize: "8px",
      color: PAL.cream,
      align: "center",
      wordWrap: { width: VIEW.W - 32 },
    }).setOrigin(0.5);
    const subtitle = scene.add.text(VIEW.W / 2, 145, "LOADING ARTWORK", {
      fontFamily: FONT,
      fontSize: "8px",
      color: PAL.grayLight,
    }).setOrigin(0.5);
    const border = scene.add.rectangle(VIEW.W / 2, 170, 190, 20, 0x2a1a08)
      .setStrokeStyle(2, 0xac7c00);
    this.fill = scene.add.rectangle(VIEW.W / 2 - 90, 170, 180, 12, 0xf8b800)
      .setOrigin(0, 0.5)
      .setScale(0, 1);
    this.percent = scene.add.text(VIEW.W / 2, 193, "0%", {
      fontFamily: FONT,
      fontSize: "8px",
      color: PAL.gold,
    }).setOrigin(0.5);

    this.add([title, subtitle, border, this.fill, this.percent]);
    scene.add.existing(this);
    this.setDepth(200);
  }

  setProgress(value: number): void {
    const progress = Phaser.Math.Clamp(value, 0, 1);
    this.fill.setScale(progress, 1);
    this.percent.setText(`${Math.round(progress * 100)}%`);
  }
}
