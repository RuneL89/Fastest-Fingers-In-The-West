/**
 * TextBox.ts — NES-style wooden text panel with typewriter reveal.
 * Speaker name colored per fighter; advances on keypress or tap.
 */
import Phaser from "phaser";
import { VIEW, PAL } from "../config";

const FONT = '"Press Start 2P", monospace';

export class TextBox extends Phaser.GameObjects.Container {
  private bodyText: Phaser.GameObjects.Text;
  private nameLabel: Phaser.GameObjects.Text;
  private hint: Phaser.GameObjects.Text;
  private full = "";
  private shown = 0;
  private revealTimer = 0;
  onAdvance: (() => void) | null = null;

  constructor(scene: Phaser.Scene, y = VIEW.H - 64) {
    super(scene, 0, 0);
    const h = 56;
    const panel = scene.add.rectangle(VIEW.W / 2, y + h / 2, VIEW.W - 12, h, 0x503000, 0.96)
      .setStrokeStyle(2, 0xac7c00);
    const inner = scene.add.rectangle(VIEW.W / 2, y + h / 2, VIEW.W - 18, h - 6, 0x2a1a08, 1);
    this.nameLabel = scene.add.text(12, y + 5, "", {
      fontFamily: FONT, fontSize: "8px", color: PAL.gold,
    });
    this.bodyText = scene.add.text(12, y + 18, "", {
      fontFamily: FONT, fontSize: "8px", color: PAL.white,
      wordWrap: { width: VIEW.W - 28 }, lineSpacing: 4,
    });
    this.hint = scene.add.text(VIEW.W - 12, y + h - 10, ">", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(1, 0.5);
    this.add([panel, inner, this.nameLabel, this.bodyText, this.hint]);
    scene.add.existing(this);
    this.setDepth(100);
  }

  /** Show a line. speaker=null for narrator text. */
  say(speaker: string | null, text: string, color: string = PAL.gold): void {
    this.nameLabel.setText(speaker ? `${speaker}:` : "").setColor(color);
    this.full = text;
    this.shown = 0;
    this.revealTimer = 0;
    this.bodyText.setText("");
  }

  /** Immediately finish the current reveal; returns true if it was mid-reveal. */
  skipReveal(): boolean {
    if (this.shown < this.full.length) {
      this.shown = this.full.length;
      this.bodyText.setText(this.full);
      return true;
    }
    return false;
  }

  advance(): void {
    if (this.skipReveal()) return;
    this.onAdvance?.();
  }

  update(_time: number, delta: number): void {
    if (this.shown < this.full.length) {
      this.revealTimer += delta;
      const step = 25; // ms per character
      while (this.revealTimer >= step && this.shown < this.full.length) {
        this.revealTimer -= step;
        this.shown++;
      }
      this.bodyText.setText(this.full.substring(0, this.shown));
    }
    this.hint.setVisible(this.shown >= this.full.length);
  }
}
