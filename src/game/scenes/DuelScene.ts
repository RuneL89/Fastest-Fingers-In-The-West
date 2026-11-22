/**
 * DuelScene.ts — one complete duel, data-driven per fighter/location.
 * Flow: goon opening → 3 sheriff options → goon closing → race exchanges
 * (shared phrase, both sides fill, first to finish fires) → victory
 * (representative thank-you) or game over. No pause (RULES.md).
 */
import Phaser from "phaser";
import { VIEW, PAL, RENDER_SCALE } from "../config";
import { FIGHTERS, type FighterDef } from "../data/fighters";
import { locationById, type LocationDef } from "../data/locations";
import { DIALOGUE } from "../data/dialogue";
import { phraseFor } from "../data/phrases";
import { run, DIFFICULTY_WPM } from "../state";
import { AudioSystem } from "../audio";
import { GameInput } from "../input";
import { TextBox } from "../ui/TextBox";
import { loadAssets } from "./preload";
import { LoadingBar } from "../ui/LoadingBar";
import { buildProps } from "../pixelart";

const FONT = '"Press Start 2P", monospace';
const CX = VIEW.W / 2;
// Character heights in the 270×300 view. The people need enough presence to
// hold their own against the large painted background and 16px word display.
const FIGHTER_TARGET_H = 112;
const NPC_TARGET_H = 80;
const REP_TARGET_H = 92;

type Phase =
  | "opening" | "options" | "closing" | "tension" | "race"
  | "resolve" | "victory" | "done";

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
  private loadingBar?: LoadingBar;
  private keys!: GameInput;
  private rng = mulberry32(Date.now());

  private loc!: LocationDef;
  private fighter!: FighterDef;

  private phase: Phase = "opening";
  private phaseT = 0;
  private playerWonExchange = true;

  private word = "";
  private typed = 0;
  private aiChars = 0;
  private aiTimer = 0;
  private outlawLives = 2;
  private flinchT = 0;
  private selectedOption = 0;

  private outlaw!: Phaser.GameObjects.Image;
  private npcs: Phaser.GameObjects.Image[] = [];
  private rep?: Phaser.GameObjects.Image;
  private box!: TextBox;
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private optionsPanel?: Phaser.GameObjects.Rectangle;
  private wordBg!: Phaser.GameObjects.Rectangle;
  private wordFull!: Phaser.GameObjects.Text;
  private wordTyped!: Phaser.GameObjects.Text;
  private aiBarLabel!: Phaser.GameObjects.Text;
  private aiWordFull!: Phaser.GameObjects.Text;
  private aiWordTyped!: Phaser.GameObjects.Text;
  private hudName!: Phaser.GameObjects.Text;
  private hudLives!: Phaser.GameObjects.Text;
  private hudGoonLives!: Phaser.GameObjects.Text;
  private banner!: Phaser.GameObjects.Text;
  private tapHint!: Phaser.GameObjects.Text;
  private flashFx!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({
      key: "duel",
      cameras: {
        zoom: RENDER_SCALE,
        scrollX: -VIEW.W * (RENDER_SCALE - 1) / 2,
        scrollY: -VIEW.H * (RENDER_SCALE - 1) / 2,
      },
    });
  }

  init(data: { locationId?: string }): void {
    this.loc = locationById(data.locationId ?? "main-street");
    this.fighter = FIGHTERS[this.loc.fighterId];
  }

  preload(): void {
    this.loadingBar = new LoadingBar(this, "PREPARING THE DUEL");
    this.load.on("progress", (value: number) => this.loadingBar?.setProgress(value));
    loadAssets(this);
  }

  create(): void {
    this.loadingBar?.destroy(true);
    this.loadingBar = undefined;
    // Phaser reuses scene instances; reset every mutable field for a fresh duel.
    this.phase = "opening";
    this.phaseT = 0;
    this.playerWonExchange = true;
    this.word = "";
    this.typed = 0;
    this.aiChars = 0;
    this.aiTimer = 0;
    this.flinchT = 0;
    this.selectedOption = 0;
    this.npcs = [];
    this.rep = undefined;
    this.optionTexts = [];
    this.optionsPanel = undefined;
    buildProps(this); // life-hat, blood pixels, flash textures
    this.audio = new AudioSystem();
    this.keys = new GameInput();
    this.keys.attach();
    this.keys.onChar = (c) => this.onChar(c);
    this.keys.typingActive = () => this.phase === "race";
    this.outlawLives = this.fighter.lives;

    this.add.image(0, 0, this.loc.bgKey).setOrigin(0, 0).setDisplaySize(VIEW.W, VIEW.H);

    // Painter's algorithm: townsfolk, furniture, the representative, and the
    // background occluders are all spawned in feet-y order. A table placed in
    // front of a person genuinely hides their legs; the bar counter occluder
    // (depth 168) hides the barman behind it but not nearer townsfolk.
    // The outlaw always draws last, in the clear center lane.
    const spawns: { depth: number; spawn: () => void }[] = [];
    const crowd = this.loc.crowd ?? [
      { key: "npc-townman", x: 34, y: 252, h: NPC_TARGET_H },
      { key: "npc-matron", x: VIEW.W - 34, y: 252, h: NPC_TARGET_H },
    ];
    for (const c of crowd) {
      spawns.push({
        depth: c.y,
        spawn: () => {
          const img = this.add.image(c.x, c.y, c.key).setOrigin(0.5, 1);
          img.setScale(c.h / img.height);
          img.setData("baseKey", c.key);
          img.setData("victoryKey", c.victoryKey ?? `${c.key}-happy`);
          img.setData("targetH", c.h);
          if (c.flip) img.setFlipX(true);
          this.npcs.push(img);
        },
      });
    }
    for (const p of this.loc.props ?? []) {
      spawns.push({
        depth: p.y,
        spawn: () => {
          const img = this.add.image(p.x, p.y, p.key).setOrigin(0.5, 1);
          img.setScale(p.h / img.height);
        },
      });
    }
    const repSpot = this.loc.repSpot ?? { x: CX + 52, y: 250 };
    if (this.loc.repKey) {
      const repKey = this.loc.repKey;
      spawns.push({
        depth: repSpot.y,
        spawn: () => {
          const visible = this.loc.repVisible ?? false;
          this.rep = this.add.image(repSpot.x, repSpot.y, visible ? repKey : `${repKey}-happy`)
            .setOrigin(0.5, 1).setVisible(visible);
          this.fitRep();
        },
      });
    }
    (this.loc.occluders ?? []).forEach((r, i) => {
      spawns.push({ depth: r.y + r.height, spawn: () => this.addDuelOccluder(r, i) });
    });
    spawns.sort((a, b) => a.depth - b.depth).forEach((s) => s.spawn());

    this.outlaw = this.add.image(CX, 236, `${this.fighter.id}-idle`).setOrigin(0.5, 1);
    this.fitOutlaw();

    this.flashFx = this.add.rectangle(CX, VIEW.H / 2, VIEW.W, VIEW.H, 0xd82800, 0).setDepth(90);

    // HUD
    this.add.rectangle(CX, 11, VIEW.W, 22, 0x000000, 0.45);
    this.hudName = this.add.text(CX, 11, this.fighter.name, {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
    }).setOrigin(0.5);
    this.hudLives = this.add.text(6, 11, "", {
      fontFamily: FONT, fontSize: "8px", color: PAL.white,
    }).setOrigin(0, 0.5);
    this.hudGoonLives = this.add.text(VIEW.W - 6, 11, "", {
      fontFamily: FONT, fontSize: "8px", color: PAL.orange,
    }).setOrigin(1, 0.5);

    this.wordBg = this.add.rectangle(CX, 62, VIEW.W, 30, 0x000000, 0.82).setVisible(false);
    const wordStyle = { fontFamily: FONT, fontSize: "16px" };
    this.wordFull = this.add.text(CX, 62, "", { ...wordStyle, color: PAL.gray }).setOrigin(0, 0.5);
    this.wordTyped = this.add.text(CX, 62, "", { ...wordStyle, color: PAL.white }).setOrigin(0, 0.5);

    // Outlaw typing progress: the same word, letters lighting up in orange
    // as the goon writes — you see his speed letter by letter, not just a fill.
    this.aiBarLabel = this.add.text(CX, 75, "OUTLAW TYPING", {
      fontFamily: FONT, fontSize: "6px", color: PAL.orange,
    }).setOrigin(0.5).setVisible(false);
    const aiWordStyle = { fontFamily: FONT, fontSize: "16px" };
    this.aiWordFull = this.add.text(CX, 90, "", { ...aiWordStyle, color: "#5a4a3a" }).setOrigin(0, 0.5).setVisible(false);
    this.aiWordTyped = this.add.text(CX, 90, "", { ...aiWordStyle, color: PAL.orange }).setOrigin(0, 0.5).setVisible(false);
    this.banner = this.add.text(CX, 120, "", {
      fontFamily: FONT, fontSize: "12px", color: PAL.white,
      stroke: PAL.black, strokeThickness: 4,
    }).setOrigin(0.5);

    this.tapHint = this.add.text(CX, 270, "TAP SCREEN TO OPEN KEYBOARD", {
      fontFamily: FONT, fontSize: "8px", color: PAL.cream,
      stroke: PAL.black, strokeThickness: 3,
    }).setOrigin(0.5).setVisible(false);

    this.box = new TextBox(this);
    this.box.onAdvance = () => this.onDialogueAdvance();
    this.input.on("pointerdown", () => {
      if (this.phase === "race") {
        this.keys.focusMobile();
        this.tapHint.setVisible(false);
      }
      if (this.phase !== "options") this.box.advance();
    });
    this.input.keyboard!.on("keydown-SPACE", () => {
      if (this.phase === "options") this.chooseOption(this.selectedOption);
      else this.box.advance();
    });
    this.input.keyboard!.on("keydown-ENTER", () => {
      if (this.phase === "options") this.chooseOption(this.selectedOption);
      else this.box.advance();
    });
    this.input.keyboard!.on("keydown-UP", () => {
      if (this.phase === "options") { this.selectedOption = (this.selectedOption + 2) % 3; this.refreshOptions(); }
    });
    this.input.keyboard!.on("keydown-DOWN", () => {
      if (this.phase === "options") { this.selectedOption = (this.selectedOption + 1) % 3; this.refreshOptions(); }
    });
    this.input.keyboard!.on("keydown-ONE", () => { if (this.phase === "options") this.chooseOption(0); });
    this.input.keyboard!.on("keydown-TWO", () => { if (this.phase === "options") this.chooseOption(1); });
    this.input.keyboard!.on("keydown-THREE", () => { if (this.phase === "options") this.chooseOption(2); });

    this.events.once("shutdown", () => {
      this.keys.dispose();
      this.audio.dispose();
    });

    this.refreshHud();
    this.audio.setMood("duel");
    this.box.say(this.fighter.name, DIALOGUE[this.fighter.id].opening, this.fighter.color);

    window.__duel = () => ({
      phase: this.phase,
      paused: false,
      word: this.word,
      typed: this.typed,
      aiChars: this.aiChars,
      outlawPose: this.outlaw.texture.key,
      repPose: this.rep?.texture.key ?? null,
      repVisible: this.rep?.visible ?? false,
      npcPoses: this.npcs.map((n) => n.texture.key),
      playerLives: run.playerLives,
      outlawLives: this.outlawLives,
      outlawIndex: 0,
      bounty: 0,
      endlessCycle: 0,
      muted: this.audio.muted,
    });
  }

  /* ---------------- dialogue flow ---------------- */

  private onDialogueAdvance(): void {
    if (this.phase === "opening") {
      this.phase = "options";
      this.selectedOption = 0;
      this.buildOptions();
    } else if (this.phase === "closing") {
      this.startExchange();
    } else if (this.phase === "victory") {
      this.phase = "done";
      run.freed.add(this.loc.id);
      this.scene.start(this.loc.id === "town-hall" ? "ending" : "map");
    }
  }

  private buildOptions(): void {
    this.box.say(null, "WHAT DO YOU SAY, SHERIFF?");
    const dlg = DIALOGUE[this.fighter.id];
    const panelTop = 116;
    const panelBottom = 224;
    const textTop = panelTop + 6;
    const gap = 4;
    this.optionsPanel = this.add.rectangle(CX, (panelTop + panelBottom) / 2, VIEW.W - 16, panelBottom - panelTop, 0x000000, 0.85)
      .setStrokeStyle(2, 0xac7c00).setDepth(50);
    dlg.options.forEach((opt, i) => {
      const t = this.add.text(12, 0, `${i + 1}. ${opt.tone}: "${opt.line}"`, {
        fontFamily: FONT, fontSize: "8px", color: PAL.white,
        wordWrap: { width: VIEW.W - 24 }, lineSpacing: 0,
      }).setDepth(51).setInteractive({ useHandCursor: true })
        .on("pointerover", () => { this.selectedOption = i; this.refreshOptions(); })
        .on("pointerdown", () => this.chooseOption(i));
      this.optionTexts.push(t);
    });

    // Stack by measured wrapped height instead of fixed 26px rows. Longer
    // choices can use three lines without printing over the next choice.
    const measure = () => this.optionTexts.reduce((sum, t) => sum + t.height, 0) + gap * (this.optionTexts.length - 1);
    const available = panelBottom - textTop - 6;
    let contentHeight = measure();
    if (contentHeight > available) {
      this.optionTexts.forEach((t) => t.setFontSize(7));
      contentHeight = measure();
    }
    let y = textTop + Math.max(0, (available - contentHeight) / 2);
    this.optionTexts.forEach((t) => {
      t.setY(y);
      y += t.height + gap;
    });
    this.refreshOptions();
  }

  private refreshOptions(): void {
    this.optionTexts.forEach((t, i) => { if (t.active) t.setColor(i === this.selectedOption ? PAL.gold : PAL.white); });
  }

  private chooseOption(i: number): void {
    const dlg = DIALOGUE[this.fighter.id];
    this.audio.sfx("ui");
    this.optionTexts.forEach((t) => t.destroy());
    this.optionTexts = [];
    this.optionsPanel?.destroy();
    this.optionsPanel = undefined;
    this.phase = "closing";
    this.box.say(this.fighter.name, dlg.closing, this.fighter.color);
  }

  /* ---------------- race ---------------- */

  private startExchange(): void {
    this.box.setVisible(false);
    this.phase = "tension";
    this.phaseT = 1.2;
    this.word = "";
    this.typed = 0;
    this.aiChars = 0;
    this.clearWord();
    this.banner.setText("");
    this.outlaw.setTexture(`${this.fighter.id}-idle`);
    this.fitOutlaw();
    this.audio.setMood("tension");
  }

  private revealWord(): void {
    this.phase = "race";
    this.word = phraseFor(this.fighter.id, this.rng).toUpperCase();
    this.typed = 0;
    this.aiChars = 0;
    this.aiTimer = this.aiBaseDelay() * 0.9;
    this.wordBg.setVisible(true);
    this.wordFull.setText(this.word);
    this.wordFull.setX(CX - this.wordFull.width / 2);
    this.wordTyped.setX(this.wordFull.x).setText("");
    this.aiBarLabel.setVisible(true);
    this.aiWordFull.setText(this.word);
    this.aiWordFull.setX(CX - this.aiWordFull.width / 2).setVisible(true);
    this.aiWordTyped.setX(this.aiWordFull.x).setText("").setVisible(true);
    this.audio.sfx("reveal");
    this.audio.setMood("duel");
    if (this.keys.isTouch) this.tapHint.setVisible(true);
  }

  private aiBaseDelay(): number {
    return 60 / (DIFFICULTY_WPM[run.difficulty] * 5);
  }

  private resolveExchange(playerWon: boolean): void {
    this.clearWord();
    this.phase = "resolve";
    this.phaseT = 1.15;
    this.playerWonExchange = playerWon;
    this.audio.sfx("shot");
    this.cameras.main.shake(140, 0.012);
    this.npcs.forEach((n) => this.setNpcTexture(n, `${n.getData("baseKey")}-flinch`));
    if (this.rep?.visible && this.loc.repKey) {
      this.rep.setTexture(`${this.loc.repKey}-flinch`);
      this.fitRep();
    }
    if (playerWon) {
      this.outlawLives--;
      this.outlaw.setTexture(`${this.fighter.id}-hit`);
      this.fitOutlaw();
      this.cameras.main.flash(70, 255, 248, 220);
      this.audio.sfx("thud");
    } else {
      run.playerLives--;
      this.outlaw.setTexture(`${this.fighter.id}-fire`);
      this.fitOutlaw();
      this.flashFx.setAlpha(0.45);
      this.tweens.add({ targets: this.flashFx, alpha: 0, duration: 350 });
    }
    this.refreshHud();
  }

  private afterResolve(): void {
    this.npcs.forEach((n) => this.setNpcTexture(n, n.getData("baseKey") as string));
    if (this.rep?.visible && this.loc.repKey) {
      this.rep.setTexture(this.loc.repKey);
      this.fitRep();
    }
    if (this.playerWonExchange) {
      if (this.outlawLives <= 0) {
        this.victory();
      } else {
        this.startExchange();
      }
    } else {
      if (run.playerLives <= 0) {
        this.scene.start("gameover");
      } else {
        this.banner.setText("HIT!");
        this.time.delayedCall(900, () => this.startExchange());
        this.phaseT = 999; // wait for the delayedCall
      }
    }
  }

  private victory(): void {
    this.box.setVisible(true);
    this.phase = "victory";
    this.clearWord();
    this.banner.setText("");
    this.outlaw.setTexture(`${this.fighter.id}-down`);
    this.fitOutlaw();
    this.audio.sfx("win");
    this.npcs.forEach((n) => this.setNpcTexture(n, n.getData("victoryKey") as string));
    if (this.rep && this.loc.repKey) {
      this.rep.setTexture(`${this.loc.repKey}-happy`).setVisible(true);
      this.fitRep();
    }
    this.audio.setMood("title");
    this.box.say(this.loc.repName ?? "TOWNSFOLK", this.loc.thankYou, PAL.greenLight);
  }

  /* ---------------- helpers ---------------- */

  /** Redraw one background region in front of whoever stands behind it. */
  private addDuelOccluder(r: { x: number; y: number; width: number; height: number }, i: number): void {
    const src = this.textures.get(this.loc.bgKey).getSourceImage() as HTMLImageElement;
    const scaleX = VIEW.W / src.width;
    const scaleY = VIEW.H / src.height;
    const sx = Math.max(0, Math.floor(r.x / scaleX));
    const sy = Math.max(0, Math.floor(r.y / scaleY));
    const sw = Math.min(src.width - sx, Math.ceil(r.width / scaleX));
    const sh = Math.min(src.height - sy, Math.ceil(r.height / scaleY));
    const key = `${this.loc.bgKey}-occ-${i}`;
    if (!this.textures.exists(key)) {
      const tex = this.textures.createCanvas(key, sw, sh);
      if (!tex) return;
      const ctx = tex.getContext();
      ctx.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
      tex.refresh();
    }
    this.add.image(r.x, r.y, key).setOrigin(0, 0).setScale(scaleX, scaleY);
  }

  private setNpcTexture(npc: Phaser.GameObjects.Image, key: string): void {
    npc.setTexture(key);
    npc.setScale((npc.getData("targetH") as number) / npc.height);
  }

  private fitRep(): void {
    if (!this.rep) return;
    this.rep.setScale((this.loc.repH ?? REP_TARGET_H) / this.rep.height);
  }

  private fitOutlaw(): void {
    this.outlaw.setScale((FIGHTER_TARGET_H * this.fighter.scale) / this.outlaw.height);
  }

  private clearWord(): void {
    this.tapHint?.setVisible(false);
    this.wordBg.setVisible(false);
    this.wordFull.setText("");
    this.wordTyped.setText("");
    this.aiBarLabel.setVisible(false);
    this.aiWordFull.setVisible(false).setText("");
    this.aiWordTyped.setVisible(false).setText("");
  }

  private refreshHud(): void {
    this.hudLives.setText("★".repeat(run.playerLives) + "☆".repeat(3 - run.playerLives));
    this.hudGoonLives.setText("★".repeat(this.outlawLives) + "☆".repeat(this.fighter.lives - this.outlawLives));
  }

  private onChar(c: string): void {
    if (this.phase !== "race") return;
    if (c !== this.word[this.typed].toLowerCase()) return;
    this.typed++;
    this.tapHint.setVisible(false);
    this.audio.sfx("click");
    this.wordTyped.setText(this.word.substring(0, this.typed));
    // per-keystroke flinch (visual only)
    this.outlaw.setTexture(`${this.fighter.id}-flinch`);
    this.fitOutlaw();
    this.flinchT = 0.12;
    if (this.typed >= this.word.length) this.resolveExchange(true);
  }

  /* ---------------- update ---------------- */

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 100) / 1000;
    this.box.update(_time, delta);
    this.phaseT -= dt;

    if (this.flinchT > 0) {
      this.flinchT -= dt;
      if (this.flinchT <= 0 && this.phase === "race") {
        this.outlaw.setTexture(`${this.fighter.id}-aim`);
        this.fitOutlaw();
      }
    }

    switch (this.phase) {
      case "tension":
        if (this.phaseT <= 0) this.revealWord();
        break;
      case "race": {
        this.aiTimer -= dt;
        while (this.aiTimer <= 0 && this.aiChars < this.word.length) {
          this.aiChars++;
          const d = this.aiBaseDelay() * (1 + (this.rng() * 2 - 1) * 0.45);
          this.aiTimer += Math.max(0.03, d);
        }
        if (this.aiWordTyped.text.length !== this.aiChars) {
          this.aiWordTyped.setText(this.word.substring(0, this.aiChars));
        }
        if (this.flinchT <= 0) {
          const p = this.aiChars / Math.max(1, this.word.length);
          // Show the aim pose for at least one full AI step before firing,
          // including on five-letter words; 0.86 skipped straight to fire.
          const pose = p < 0.34 ? "idle" : p < 0.70 ? "draw" : "aim";
          const key = `${this.fighter.id}-${pose}`;
          if (this.outlaw.texture.key !== key) {
            this.outlaw.setTexture(key);
            this.fitOutlaw();
          }
        }
        if (this.aiChars >= this.word.length && this.phase === "race") this.resolveExchange(false);
        break;
      }
      case "resolve":
        if (this.phaseT <= 0) this.afterResolve();
        break;
    }
  }
}
