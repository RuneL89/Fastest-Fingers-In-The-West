/**
 * MapScene.ts — the top-down map of Tombwood Creek.
 * Tormented locations show WANTED posters; freed ones show the happy
 * representative. Town Hall stays padlocked until all five goons fall.
 * Phase 1: only Main Street's duel is built; other posters show a stub note.
 */
import Phaser from "phaser";
import { VIEW, PAL, RENDER_SCALE } from "../config";
import { LOCATIONS } from "../data/locations";
import { run, townHallUnlocked } from "../state";
import { AudioSystem } from "../audio";
import { loadAssets } from "./preload";
import { LoadingBar } from "../ui/LoadingBar";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;

export class MapScene extends Phaser.Scene {
  private audio!: AudioSystem;
  private loadingBar?: LoadingBar;
  private toast!: Phaser.GameObjects.Text;
  private toastBg!: Phaser.GameObjects.Rectangle;
  private toastTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: "map",
      cameras: {
        zoom: RENDER_SCALE,
        scrollX: -VIEW.W * (RENDER_SCALE - 1) / 2,
        scrollY: -VIEW.H * (RENDER_SCALE - 1) / 2,
      },
    });
  }

  preload(): void {
    this.loadingBar = new LoadingBar(this, "TOMBWOOD CREEK");
    this.load.on("progress", (value: number) => this.loadingBar?.setProgress(value));
    loadAssets(this);
  }

  create(): void {
    this.loadingBar?.destroy(true);
    this.loadingBar = undefined;
    this.audio = new AudioSystem();
    this.audio.setMood("title");
    this.events.once("shutdown", () => this.audio.dispose());
    this.add.image(0, 0, "map").setOrigin(0, 0).setDisplaySize(VIEW.W, VIEW.H);

    for (const loc of LOCATIONS) {
      const x = loc.mapX * VIEW.W;
      const y = loc.mapY * VIEW.H;
      const freed = run.freed.has(loc.id);
      if (freed && loc.repKey) {
        this.add.image(x, y, `${loc.repKey}-happy`)
          .setScale(30 / this.textures.get(`${loc.repKey}-happy`).getSourceImage().height);
      } else {
        const posterX = loc.posterX * VIEW.W;
        const posterY = loc.posterY * VIEW.H;
        const poster = this.add.image(posterX, posterY, `poster-${loc.fighterId}`);
        // Large enough for WANTED lettering and the outlaw's face to read on phones.
        poster.setScale(64 / poster.height);
        poster.setInteractive({ useHandCursor: true });
        poster.on("pointerdown", () => this.pick(loc.id));
        if (loc.id === "town-hall" && !townHallUnlocked()) {
          const lock = this.add.graphics();
          lock.fillStyle(0x2a2a2a, 1).fillRect(-6, -2, 12, 10);
          lock.lineStyle(3, 0xbcbcbc, 1).strokeCircle(0, -3, 5);
          lock.fillStyle(0xf8b800, 1).fillRect(-6, -2, 12, 10);
          lock.lineStyle(2, 0x503000, 1).strokeRect(-6, -2, 12, 10);
          lock.fillStyle(0x503000, 1).fillRect(-1, 1, 2, 4);
          lock.setPosition(posterX + 14, posterY - 12);
        }
      }
    }

    // HUD: sheriff lives + hint
    this.add.rectangle(CX, 9, VIEW.W, 18, 0x000000, 0.55);
    this.add.text(6, 9, `SHERIFF: ${"★".repeat(run.playerLives)}${"☆".repeat(3 - run.playerLives)}`, {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(0, 0.5);
    this.add.text(VIEW.W - 6, 9, "TAP A POSTER", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(1, 0.5);

    this.toastBg = this.add.rectangle(CX, 150, VIEW.W - 20, 40, 0x000000, 0.85).setVisible(false);
    this.toast = this.add.text(CX, 150, "", {
      fontFamily: FONT, fontSize: "8px", color: PAL.white, align: "center",
      wordWrap: { width: VIEW.W - 32 },
    }).setOrigin(0.5).setVisible(false);

    this.input.keyboard!.on("keydown-D", () => {
      // Debug: free all five goon areas to preview the Town Hall unlock.
      for (const id of ["main-street", "saloon", "gambling-den", "gold-mine", "church"]) run.freed.add(id);
      this.scene.restart();
    });

    window.__map = () => ({
      freed: [...run.freed],
      unlocked: townHallUnlocked(),
      lives: run.playerLives,
    });
  }

  private pick(locationId: string): void {
    const loc = LOCATIONS.find((l) => l.id === locationId)!;
    if (locationId === "town-hall" && !townHallUnlocked()) {
      this.showToast("TOWN HALL IS LOCKED.\nDEFEAT ALL FIVE GOONS FIRST.");
      return;
    }
    if (locationId === "main-street") {
      this.audio.sfx("ui");
      this.scene.start("duel", { locationId });
      return;
    }
    this.showToast(`${loc.name}\nTHIS DUEL IS NOT BUILT YET.`);
  }

  private showToast(text: string): void {
    this.toastBg.setVisible(true);
    this.toast.setText(text).setVisible(true);
    this.toastTimer?.destroy();
    this.toastTimer = this.time.delayedCall(2200, () => {
      this.toastBg.setVisible(false);
      this.toast.setVisible(false);
    });
  }
}
