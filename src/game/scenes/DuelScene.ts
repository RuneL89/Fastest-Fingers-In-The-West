/**
 * DuelScene.ts — the whole game: title → intro → tension → race → resolve,
 * outlaw ladder, 3 lives per side (player lives carry across outlaws),
 * game over / victory / endless, pause, procedural effects.
 */
import Phaser from "phaser";
import { AudioSystem } from "../audio";
import { GameInput, type ControlKey } from "../input";
import { storage } from "../storage";
import {
  VIEW, PAL, LADDER, LIVES, BEST_KEY, TIMING, ENDLESS_WPM_STEP,
  wordForOutlaw, type OutlawDef,
} from "../config";
import { buildBackground, buildOutlawTextures, buildProps } from "../pixelart";
import genIdleUrl from "../assets/gen/cactus-jack-idle-nes.png";
import genAimUrl from "../assets/gen/cactus-jack-aim-nes.png";
import genHitUrl from "../assets/gen/cactus-jack-hit-nes.png";
import genDownUrl from "../assets/gen/cactus-jack-down-nes.png";
import genStreetUrl from "../assets/gen/main-street-nes.png";

type Phase =
  | "title" | "intro" | "tension" | "race" | "resolve"
  | "outlawdown" | "playerhit" | "gameover" | "victory";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class DuelScene extends Phaser.Scene {
  private audio!: AudioSystem;
  private keys!: GameInput;
  private rng = mulberry32(Date.now());

  private phase: Phase = "title";
  private phaseT = 0;
  private paused = false;
  private playerWonExchange = true;

  private outlawIndex = 0;
  private endlessCycle = 0;
  private playerLives = LIVES;
  private outlawLives = LIVES;
  private bounty = 0;
  private best = 0;

  private word = "";
  private typed = 0;
  private aiChars = 0;
  private aiTimer = 0;

  // scene objects
  private outlaw!: Phaser.GameObjects.Image;
  private outlawHat!: Phaser.GameObjects.Image;
  private flashFx!: Phaser.GameObjects.Image;
  private playerHat!: Phaser.GameObjects.Image;
  private vulture!: Phaser.GameObjects.Image;
  private tumbleweed!: Phaser.GameObjects.Image;
  private blood: Array<{ img: Phaser.GameObjects.Image; vx: number; vy: number; life: number }> = [];

  private hudPlayerHats: Phaser.GameObjects.Image[] = [];
  private hudOutlawHats: Phaser.GameObjects.Image[] = [];
  private hudBar!: Phaser.GameObjects.Rectangle;
  private wordBg!: Phaser.GameObjects.Rectangle;
  private hudName!: Phaser.GameObjects.Text;
  private hudBounty!: Phaser.GameObjects.Text;
  private hudMute!: Phaser.GameObjects.Text;
  private hudPause!: Phaser.GameObjects.Text;
  private wordFull!: Phaser.GameObjects.Text;
  private wordTyped!: Phaser.GameObjects.Text;
  private banner!: Phaser.GameObjects.Text;
  private bannerSub!: Phaser.GameObjects.Text;

  private titleGroup!: Phaser.GameObjects.Container;
  private pauseGroup!: Phaser.GameObjects.Container;
  private endGroup!: Phaser.GameObjects.Container;
  private endTitle!: Phaser.GameObjects.Text;
  private endLines!: Phaser.GameObjects.Text;
  private pauseSound!: Phaser.GameObjects.Text;
  private titleStart!: Phaser.GameObjects.Text;
  private titleBest!: Phaser.GameObjects.Text;

  constructor() {
    super("duel");
  }

  private get def(): OutlawDef {
    return LADDER[this.outlawIndex];
  }

  private get effectiveWpm(): number {
    return this.def.wpm + this.endlessCycle * ENDLESS_WPM_STEP;
  }

  preload(): void {
    this.load.image("gen-cj-idle", genIdleUrl);
    this.load.image("gen-cj-aim", genAimUrl);
    this.load.image("gen-cj-hit", genHitUrl);
    this.load.image("gen-cj-down", genDownUrl);
    this.load.image("gen-street", genStreetUrl);
  }

  /** Use AI art for outlaw 0 (Cactus Jack PoC); other outlaws stay code-drawn. */
  private get genArt(): boolean {
    return this.outlawIndex === 0 && this.textures.exists("gen-cj-idle");
  }

  private outlawTex(pose: string): string {
    return this.genArt ? `gen-cj-${pose}` : `outlaw-${this.outlawIndex}-${pose}`;
  }

  private fitOutlaw(): void {
    if (this.genArt) {
      // match the code sprite's on-screen height (44px grid * scale 2)
      this.outlaw.setScale(88 / this.outlaw.height);
    } else {
      this.outlaw.setScale(1);
    }
  }

  create(): void {
    buildBackground(this);
    buildProps(this);
    LADDER.forEach((d, i) => buildOutlawTextures(this, d, i));
    this.audio = new AudioSystem();
    this.keys = new GameInput();
    this.keys.attach();
    this.keys.onChar = (c) => this.onChar(c);
    this.keys.onControl = (k) => this.onControl(k);
    this.keys.typingActive = () => this.phase === "race" && !this.paused;
    this.best = storage.get<number>(BEST_KEY, 0);

    if (this.textures.exists("gen-street")) {
      this.add.image(0, 0, "gen-street").setOrigin(0, 0).setDisplaySize(VIEW.W, VIEW.H);
    } else {
      this.add.image(0, 0, "bg").setOrigin(0, 0);
    }

    // outlaw + his removable hat
    this.outlaw = this.add.image(CX, 236, "outlaw-0-idle").setOrigin(0.5, 1);
    this.outlawHat = this.add.image(CX, 236 - 84, "hat-0").setOrigin(0.5, 1).setVisible(false);
    this.flashFx = this.add.image(CX + 40, 178, "flash").setVisible(false);

    this.playerHat = this.add.image(-30, 272, "player-hat").setVisible(false);
    this.vulture = this.add.image(-40, 40, "vulture-0").setVisible(false);
    this.tumbleweed = this.add.image(-40, 262, "tumbleweed").setVisible(false);

    for (let i = 0; i < 40; i++) {
      const img = this.add.image(0, 0, i % 3 === 0 ? "blood-px-dark" : "blood-px").setVisible(false);
      this.blood.push({ img, vx: 0, vy: 0, life: 0 });
    }

    // HUD
    this.hudBar = this.add.rectangle(CX, 13, VIEW.W, 26, 0x000000, 0.45);
    for (let i = 0; i < LIVES; i++) {
      this.hudPlayerHats.push(this.add.image(12 + i * 20, 12, "life-hat").setOrigin(0, 0.5));
      this.hudOutlawHats.push(this.add.image(VIEW.W - 12 - i * 20, 12, "life-hat").setOrigin(1, 0.5));
    }
    this.hudName = this.add.text(CX, 12, "", { fontFamily: FONT, fontSize: "8px", color: PAL.cream }).setOrigin(0.5);
    this.hudBounty = this.add.text(CX, 290, "", { fontFamily: FONT, fontSize: "8px", color: PAL.brownDark }).setOrigin(0.5);
    this.hudMute = this.add.text(VIEW.W - 6, 290, "", { fontFamily: FONT, fontSize: "8px", color: PAL.brownDark }).setOrigin(1, 0.5);
    this.hudPause = this.add.text(6, 290, "II", { fontFamily: FONT, fontSize: "8px", color: PAL.brownDark }).setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.onControl("pause"));

    // word display: dark strip so the word reads against any sky
    this.wordBg = this.add.rectangle(CX, 62, VIEW.W, 30, 0x000000, 0.82).setVisible(false);
    const wordStyle = { fontFamily: FONT, fontSize: "16px" };
    this.wordFull = this.add.text(CX, 62, "", { ...wordStyle, color: PAL.gray }).setOrigin(0, 0.5);
    this.wordTyped = this.add.text(CX, 62, "", { ...wordStyle, color: PAL.white }).setOrigin(0, 0.5);
    this.banner = this.add.text(CX, 120, "", { fontFamily: FONT, fontSize: "16px", color: PAL.white, stroke: PAL.black, strokeThickness: 4 }).setOrigin(0.5);
    this.bannerSub = this.add.text(CX, 146, "", { fontFamily: FONT, fontSize: "8px", color: PAL.cream, stroke: PAL.black, strokeThickness: 3 }).setOrigin(0.5);

    this.buildTitle();
    this.buildPause();
    this.buildEnd();

    this.input.on("pointerdown", () => this.onTap());
    this.events.once("shutdown", () => {
      this.keys.dispose();
      this.audio.dispose();
    });

    this.enterTitle();
    window.__GAME_READY__ = true;
    window.__duel = () => ({
      phase: this.phase,
      paused: this.paused,
      word: this.word,
      typed: this.typed,
      playerLives: this.playerLives,
      outlawLives: this.outlawLives,
      outlawIndex: this.outlawIndex,
      bounty: this.bounty,
      endlessCycle: this.endlessCycle,
      muted: this.audio.muted,
    });
  }

  /* ---------------- screens ---------------- */

  private buildTitle(): void {
    const g = this.add.container(0, 0);
    const t1 = this.add.text(CX, 66, "FASTEST", { fontFamily: FONT, fontSize: "24px", color: PAL.gold, stroke: PAL.brownDark, strokeThickness: 5 }).setOrigin(0.5);
    const t2 = this.add.text(CX, 96, "FINGERS", { fontFamily: FONT, fontSize: "24px", color: PAL.gold, stroke: PAL.brownDark, strokeThickness: 5 }).setOrigin(0.5);
    const t3 = this.add.text(CX, 126, "IN THE WEST", { fontFamily: FONT, fontSize: "12px", color: PAL.white, stroke: PAL.brownDark, strokeThickness: 4 }).setOrigin(0.5);
    this.titleStart = this.add.text(CX, 216, "PRESS SPACE / TAP", { fontFamily: FONT, fontSize: "8px", color: PAL.white, stroke: PAL.black, strokeThickness: 3 }).setOrigin(0.5);
    this.titleBest = this.add.text(CX, 236, "", { fontFamily: FONT, fontSize: "8px", color: PAL.cream, stroke: PAL.black, strokeThickness: 3 }).setOrigin(0.5);
    const hint = this.add.text(CX, 258, "TYPE THE WORD FIRST.\nWRONG KEYS JUST WASTE TIME.", { fontFamily: FONT, fontSize: "8px", color: PAL.brownDark, align: "center" }).setOrigin(0.5);
    g.add([t1, t2, t3, this.titleStart, this.titleBest, hint]);
    this.titleGroup = g;
  }

  private buildPause(): void {
    const g = this.add.container(0, 0).setVisible(false);
    const shade = this.add.rectangle(CX, VIEW.H / 2, VIEW.W, VIEW.H, 0x000000, 0.72);
    const title = this.add.text(CX, 92, "HOLD YOUR FIRE", { fontFamily: FONT, fontSize: "12px", color: PAL.gold }).setOrigin(0.5);
    const mk = (y: number, label: string, action: ControlKey) =>
      this.add.text(CX, y, label, { fontFamily: FONT, fontSize: "8px", color: PAL.white }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.onControl(action));
    const resume = mk(130, "ESC  RESUME", "pause");
    const restart = mk(152, "R    RESTART RUN", "restart");
    this.pauseSound = mk(174, "M    SOUND: ON", "mute");
    const reset = mk(196, "X    RESET BEST BOUNTY", "resetBest");
    g.add([shade, title, resume, restart, this.pauseSound, reset]);
    this.pauseGroup = g;
  }

  private buildEnd(): void {
    const g = this.add.container(0, 0).setVisible(false);
    const shade = this.add.rectangle(CX, VIEW.H / 2, VIEW.W, VIEW.H, 0x000000, 0.6);
    const poster = this.add.rectangle(CX, 150, 216, 190, 0xf8d878).setStrokeStyle(4, 0x503000);
    this.endTitle = this.add.text(CX, 74, "WANTED", { fontFamily: FONT, fontSize: "20px", color: PAL.darkRed }).setOrigin(0.5);
    this.endLines = this.add.text(CX, 166, "", { fontFamily: FONT, fontSize: "8px", color: PAL.brownDark, align: "center", lineSpacing: 8 }).setOrigin(0.5);
    g.add([shade, poster, this.endTitle, this.endLines]);
    this.endGroup = g;
  }

  /* ---------------- flow ---------------- */

  private enterTitle(): void {
    this.phase = "title";
    this.paused = false;
    this.titleGroup.setVisible(true);
    this.pauseGroup.setVisible(false);
    this.endGroup.setVisible(false);
    this.outlaw.setVisible(false);
    this.clearWord();
    this.banner.setText("");
    this.bannerSub.setText("");
    this.hudName.setText("");
    this.hudBounty.setText("");
    this.hudPlayerHats.forEach((h) => h.setVisible(false));
    this.hudOutlawHats.forEach((h) => h.setVisible(false));
    this.hudPause.setVisible(false);
    this.hudBar.setVisible(false);
    this.titleBest.setText(`BEST BOUNTY $${this.best}`);
    this.audio.setMood("title");
  }

  private startRun(endless = false): void {
    this.endlessCycle = endless ? 1 : 0;
    this.outlawIndex = 0;
    this.playerLives = LIVES;
    this.bounty = 0;
    this.titleGroup.setVisible(false);
    this.endGroup.setVisible(false);
    this.pauseGroup.setVisible(false);
    this.paused = false;
    this.hudPlayerHats.forEach((h) => h.setVisible(true));
    this.hudOutlawHats.forEach((h) => h.setVisible(true));
    this.hudPause.setVisible(true);
    this.hudBar.setVisible(true);
    this.audio.sfx("ui");
    this.startOutlaw();
  }

  private startOutlaw(): void {
    this.outlawLives = LIVES;
    this.phase = "intro";
    this.phaseT = TIMING.intro;
    this.resetOutlawSprite();
    this.clearWord();
    this.hudName.setText(this.def.name);
    this.banner.setText(`DUEL ${this.endlessCycle > 0 ? "E" : ""}${this.outlawIndex + 1}`);
    this.bannerSub.setText(`${this.def.name}  $${this.def.bounty}`);
    this.refreshHud();
    this.audio.setMood("duel");
  }

  private startExchange(): void {
    this.phase = "tension";
    this.phaseT = TIMING.tension;
    this.word = "";
    this.typed = 0;
    this.aiChars = 0;
    this.clearWord();
    this.banner.setText("");
    this.bannerSub.setText("");
    this.resetOutlawSprite();
    this.playerHat.setVisible(false);
    this.cameras.main.resetFX();
    this.audio.setMood("tension");
  }

  private revealWord(): void {
    this.phase = "race";
    this.word = wordForOutlaw(this.outlawIndex, this.rng).toUpperCase();
    this.typed = 0;
    this.aiChars = 0;
    this.aiTimer = this.aiBaseDelay() * 0.9;
    const display = this.word;
    this.wordBg.setVisible(true);
    this.wordFull.setText(display);
    this.wordFull.setX(CX - this.wordFull.width / 2);
    this.wordTyped.setX(this.wordFull.x).setText("");
    this.audio.sfx("reveal");
    this.audio.setMood("duel");
  }

  private aiBaseDelay(): number {
    return 60 / (this.effectiveWpm * 5);
  }

  private resolveExchange(playerWon: boolean): void {
    this.phase = "resolve";
    this.phaseT = TIMING.resolve;
    this.playerWonExchange = playerWon;
    this.audio.sfx("shot");
    this.cameras.main.shake(140, 0.012);
    this.cameras.main.flash(70, 255, 248, 220);
    if (playerWon) {
      this.outlawLives--;
      this.burstBlood(this.outlaw.x, this.outlaw.y - 56);
      if (this.genArt) {
        // AI frames: recoil pose, hat flies inside the art itself
        this.outlaw.setTexture("gen-cj-hit");
        this.fitOutlaw();
        this.tweens.add({ targets: this.outlaw, y: this.outlaw.y + 10, duration: 300, yoyo: true });
      } else {
        this.outlaw.setTexture(`outlaw-${this.outlawIndex}-aim`);
        this.outlawHat.setVisible(true).setPosition(this.outlaw.x, this.outlaw.y - 84).setRotation(0);
        this.tweens.add({ targets: this.outlawHat, y: this.outlawHat.y - 40, angle: 200, duration: 700 });
        this.tweens.add({ targets: this.outlaw, angle: 88, y: this.outlaw.y + 26, duration: 650, ease: "Bounce.easeOut" });
      }
      this.audio.sfx("thud");
    } else {
      this.playerLives--;
      this.flashFx.setVisible(true);
      this.time.delayedCall(90, () => this.flashFx.setVisible(false));
      this.burstBlood(CX - 40, 250);
    }
    this.refreshHud();
  }

  private afterResolve(): void {
    if (this.playerWonExchange) {
      if (this.outlawLives <= 0) {
        this.phase = "outlawdown";
        this.phaseT = TIMING.outlawDown;
        if (this.genArt) {
          this.outlaw.setTexture("gen-cj-down");
          this.fitOutlaw();
        }
        this.bounty += this.def.bounty;
        this.banner.setText("OUTLAW DOWN");
        this.bannerSub.setText(`BOUNTY +$${this.def.bounty}`);
        this.audio.sfx("win");
        this.refreshHud();
      } else {
        this.startExchangeAfter(TIMING.betweenExchanges);
      }
    } else {
      if (this.playerLives <= 0) {
        this.gameOver();
      } else {
        this.phase = "playerhit";
        this.phaseT = TIMING.playerHit;
        this.banner.setText("HIT!");
        this.bannerSub.setText(`${this.playerLives} ${this.playerLives === 1 ? "LIFE" : "LIVES"} LEFT`);
        this.playerHat.setVisible(true).setPosition(-20, 268).setRotation(0);
        this.tweens.add({ targets: this.playerHat, x: 70, angle: 360, duration: 900 });
        this.audio.sfx("lose");
      }
    }
  }

  private startExchangeAfter(delay: number): void {
    this.phase = "tension";
    this.phaseT = delay;
    this.clearWord();
    this.resetOutlawSprite();
    this.audio.setMood("tension");
  }

  private gameOver(): void {
    this.phase = "gameover";
    this.saveBest();
    this.endTitle.setText("WANTED");
    this.endLines.setText(
      `DEAD OR ALIVE\n\nYOUR BOUNTY\n$${this.bounty}\n\nBEST $${this.best}\n\nSPACE/TAP: NEW RUN`,
    );
    this.endGroup.setVisible(true);
    this.audio.sfx("lose");
    this.audio.setMood("title");
  }

  private victory(): void {
    this.phase = "victory";
    this.saveBest();
    this.endTitle.setText("YEEHAW!");
    this.endLines.setText(
      `RAILROAD REACHED\nALL OUTLAWS DOWN\n\nBOUNTY $${this.bounty}\nBEST $${this.best}\n\nENTER/TAP: ENDLESS\nSPACE: NEW RUN`,
    );
    this.endGroup.setVisible(true);
    this.audio.sfx("fanfare");
    this.audio.setMood("title");
  }

  private saveBest(): void {
    if (this.bounty > this.best) {
      this.best = this.bounty;
      storage.set(BEST_KEY, this.best);
    }
  }

  /* ---------------- helpers ---------------- */

  private resetOutlawSprite(): void {
    this.outlaw.setVisible(true);
    this.outlaw.setTexture(this.outlawTex("idle"));
    this.fitOutlaw();
    this.outlaw.setPosition(CX, 236).setAngle(0).setAlpha(1);
    this.outlawHat.setVisible(false);
    this.tweens.killTweensOf(this.outlaw);
    this.tweens.killTweensOf(this.outlawHat);
    for (const b of this.blood) { b.life = 0; b.img.setVisible(false); }
  }

  private clearWord(): void {
    this.wordBg.setVisible(false);
    this.wordFull.setText("");
    this.wordTyped.setText("");
  }

  private refreshHud(): void {
    this.hudPlayerHats.forEach((h, i) => h.setTexture(i < this.playerLives ? "life-hat" : "life-hat-lost"));
    this.hudOutlawHats.forEach((h, i) => h.setTexture(i < this.outlawLives ? "life-hat" : "life-hat-lost"));
    this.hudBounty.setText(`BOUNTY $${this.bounty}`);
    this.hudMute.setText(this.audio.muted ? "MUTED" : "");
  }

  private burstBlood(x: number, y: number): void {
    let n = 0;
    for (const b of this.blood) {
      if (b.life > 0) continue;
      b.life = 0.5 + this.rng() * 0.3;
      b.img.setVisible(true).setPosition(x, y).setAlpha(1);
      b.vx = (this.rng() * 2 - 1) * 130;
      b.vy = -40 - this.rng() * 110;
      if (++n >= 26) break;
    }
  }

  private onChar(c: string): void {
    if (this.paused || this.phase !== "race") return;
    // Lenient rule: a wrong key does nothing at all. Only time is lost.
    if (c !== this.word[this.typed].toLowerCase()) return;
    this.typed++;
    this.audio.sfx("click");
    this.wordTyped.setText(this.word.substring(0, this.typed));
    if (this.typed >= this.word.length) this.resolveExchange(true);
  }

  private onControl(k: ControlKey): void {
    if (k === "mute") {
      this.audio.toggleMute();
      this.pauseSound.setText(`M    SOUND: ${this.audio.muted ? "OFF" : "ON"}`);
      this.refreshHud();
      return;
    }
    if (k === "pause") {
      if (this.phase === "title" || this.phase === "gameover" || this.phase === "victory") return;
      this.paused = !this.paused;
      this.pauseGroup.setVisible(this.paused);
      this.audio.sfx("ui");
      return;
    }
    if (this.paused) {
      if (k === "restart") this.startRun(this.endlessCycle > 0);
      if (k === "resetBest") {
        this.best = 0;
        storage.set(BEST_KEY, 0);
        this.titleBest.setText("BEST BOUNTY $0");
        this.audio.sfx("ui");
      }
      return;
    }
    if (k === "start") {
      if (this.phase === "title") this.startRun();
      else if (this.phase === "gameover" || this.phase === "victory") this.startRun();
    } else if (k === "endless") {
      if (this.phase === "victory") this.startRun(true);
    }
  }

  private onTap(): void {
    if (this.paused) return; // pause menu items handle their own taps
    if (this.phase === "title") this.startRun();
    else if (this.phase === "gameover") this.startRun();
    else if (this.phase === "victory") this.startRun(true);
  }

  /* ---------------- update ---------------- */

  update(time: number, delta: number): void {
    const dt = Math.min(delta, 100) / 1000;
    if (!this.paused) {
      this.phaseT -= dt;
      switch (this.phase) {
        case "intro":
          if (this.phaseT <= 0) this.startExchange();
          break;
        case "tension":
          if (this.phaseT <= 0) this.revealWord();
          break;
        case "race": {
          // opponent types on his own clock
          this.aiTimer -= dt;
          while (this.aiTimer <= 0 && this.aiChars < this.word.length) {
            this.aiChars++;
            const jitter = this.def.jitter ?? 0.45;
            let d = this.aiBaseDelay() * (1 + (this.rng() * 2 - 1) * jitter);
            if (this.def.stumble && this.rng() < this.def.stumble) d += 0.45 + this.rng() * 0.5;
            this.aiTimer += Math.max(0.03, d);
          }
          const p = this.aiChars / Math.max(1, this.word.length);
          const pose = this.genArt ? (p < 0.5 ? "idle" : "aim") : p < 0.34 ? "idle" : p < 0.86 ? "draw" : "aim";
          const key = this.outlawTex(pose);
          if (this.outlaw.texture.key !== key) {
            this.outlaw.setTexture(key);
            this.fitOutlaw();
          }
          if (this.aiChars >= this.word.length && this.phase === "race") this.resolveExchange(false);
          break;
        }
        case "resolve":
          if (this.phaseT <= 0) this.afterResolve();
          break;
        case "outlawdown":
          if (this.phaseT <= 0) {
            if (this.outlawIndex >= LADDER.length - 1 && this.endlessCycle === 0) {
              this.victory();
            } else {
              this.outlawIndex++;
              if (this.outlawIndex >= LADDER.length) {
                this.outlawIndex = 0;
                this.endlessCycle++;
              }
              this.startOutlaw();
            }
          }
          break;
        case "playerhit":
          if (this.phaseT <= 0) this.startExchangeAfter(TIMING.tension);
          break;
      }

      // blood particles
      for (const b of this.blood) {
        if (b.life <= 0) continue;
        b.life -= dt;
        b.vy += 520 * dt;
        b.img.x += b.vx * dt;
        b.img.y += b.vy * dt;
        b.img.setAlpha(Math.min(1, b.life * 3));
        if (b.life <= 0) b.img.setVisible(false);
      }

      // ambient life: vulture drifts across, tumbleweed rolls
      const t = time / 1000;
      const vcycle = t % 26;
      this.vulture.setVisible(vcycle < 9);
      if (vcycle < 9) {
        this.vulture.setPosition(-30 + vcycle * 36, 34 + Math.sin(vcycle * 1.4) * 6);
        this.vulture.setTexture(Math.floor(t * 4) % 2 === 0 ? "vulture-0" : "vulture-1");
      }
      const wcycle = (t + 9) % 21;
      this.tumbleweed.setVisible(wcycle < 7 && this.phase !== "race");
      if (wcycle < 7) {
        this.tumbleweed.setPosition(-20 + wcycle * 48, 262 + Math.abs(Math.sin(wcycle * 5)) * -8);
        this.tumbleweed.setAngle(wcycle * 260);
      }
      this.titleStart.setAlpha(Math.floor(t * 2) % 2 === 0 ? 1 : 0.25);
    }
  }
}
