/**
 * MapScene.ts — the top-down map of Tombwood Creek.
 * Tormented locations show WANTED posters; freed ones show the happy
 * representative. Town Hall stays padlocked until all five goons fall.
 * Phase 2: Main Street and the Saloon have real duels; other posters show a stub note.
 */
import Phaser from "phaser";
import { VIEW, PAL, RENDER_SCALE } from "../config";
import { LOCATIONS, type LocationDef } from "../data/locations";
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
  private modal?: Phaser.GameObjects.Container;

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
    this.modal = undefined;
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
        // A small sign stuck in the ground: wooden stake plus a quarter-size
        // poster. Tapping it opens the full-size poster modal instead.
        this.add.rectangle(posterX, posterY + 12, 2, 8, 0x6b4423);
        const poster = this.add.image(posterX, posterY, `poster-${loc.fighterId}`);
        poster.setScale(16 / poster.height);
        poster.setInteractive({ useHandCursor: true });
        poster.on("pointerdown", () => this.openModal(loc));
        if (loc.id === "town-hall" && !townHallUnlocked()) {
          const lock = this.add.graphics();
          lock.fillStyle(0x2a2a2a, 1).fillRect(-4, -1, 8, 7);
          lock.lineStyle(2, 0xbcbcbc, 1).strokeCircle(0, -2, 3.5);
          lock.fillStyle(0xf8b800, 1).fillRect(-4, -1, 8, 7);
          lock.lineStyle(1.5, 0x503000, 1).strokeRect(-4, -1, 8, 7);
          lock.fillStyle(0x503000, 1).fillRect(-0.5, 1, 1, 3);
          lock.setPosition(posterX + 7, posterY - 7);
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

  /** Poster modal: full-size poster, name, START DUEL when available. */
  private openModal(loc: LocationDef): void {
    this.closeModal();
    this.audio.sfx("ui");
    const locked = loc.id === "town-hall" && !townHallUnlocked();
    const built = loc.id === "main-street" || loc.id === "saloon";
    const c = this.add.container(0, 0);
    this.modal = c;

    // Full-screen scrim; tapping anywhere on it closes the modal. Phaser's
    // default topOnly input means the button below still wins its own taps.
    const scrim = this.add.rectangle(CX, VIEW.H / 2, VIEW.W, VIEW.H, 0x000000, 0.78)
      .setInteractive();
    scrim.on("pointerdown", () => this.closeModal());
    c.add(scrim);

    c.add(this.add.text(CX, 26, loc.name, {
      fontFamily: FONT, fontSize: "12px", color: PAL.gold,
    }).setOrigin(0.5));

    const key = `poster-${loc.fighterId}`;
    const src = this.textures.get(key).getSourceImage();
    const scale = Math.min((VIEW.W * 0.8) / src.width, (VIEW.H * 0.7) / src.height);
    const pw = src.width * scale;
    const ph = src.height * scale;
    const posterCY = 142;
    c.add(this.add.rectangle(CX, posterCY, pw + 6, ph + 6, 0xf0dcb0, 1));
    c.add(this.add.rectangle(CX, posterCY, pw + 6, ph + 6).setStrokeStyle(2, 0x503000));
    c.add(this.add.image(CX, posterCY, key).setScale(scale));

    if (locked) {
      c.add(this.add.text(CX, 262, "DEFEAT ALL FIVE GOONS FIRST", {
        fontFamily: FONT, fontSize: "8px", color: PAL.gold,
      }).setOrigin(0.5));
    } else if (!built) {
      c.add(this.add.text(CX, 262, "THIS DUEL IS NOT BUILT YET", {
        fontFamily: FONT, fontSize: "8px", color: PAL.cream,
      }).setOrigin(0.5));
    } else {
      const btn = this.add.rectangle(CX, 264, 122, 22, 0x8a5a2b)
        .setStrokeStyle(2, 0x503000)
        .setInteractive({ useHandCursor: true });
      btn.on("pointerdown", () => {
        this.audio.sfx("ui");
        this.scene.start("duel", { locationId: loc.id });
      });
      c.add(btn);
      c.add(this.add.text(CX, 264, "START DUEL", {
        fontFamily: FONT, fontSize: "9px", color: PAL.cream,
      }).setOrigin(0.5));
    }

    c.add(this.add.text(CX, 289, "TAP AWAY TO CLOSE", {
      fontFamily: FONT, fontSize: "7px", color: PAL.cream,
    }).setOrigin(0.5).setAlpha(0.7));
  }

  private closeModal(): void {
    this.modal?.destroy(true);
    this.modal = undefined;
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
