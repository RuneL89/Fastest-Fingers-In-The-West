/**
 * audio.ts — 100% procedural Web Audio: wind ambience, a sparse saloon-piano loop,
 * and synthesized SFX. No audio files. Mute persisted defensively in localStorage.
 */
import { storage } from "./storage";

export type SfxId = "click" | "reveal" | "shot" | "thud" | "lose" | "win" | "ui" | "fanfare";

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windSrc: AudioBufferSourceNode | null = null;
  private pianoTimer: number | null = null;
  private nextNoteTime = 0;
  private noteIndex = 0;
  private disposed = false;
  muted = false;

  private readonly unlock = () => {
    this.ensureCtx();
    this.startWind();
    this.detachUnlock();
  };

  constructor() {
    this.muted = storage.get("muted", false);
    window.addEventListener("pointerdown", this.unlock);
    window.addEventListener("keydown", this.unlock);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.detachUnlock();
    if (this.pianoTimer !== null) window.clearInterval(this.pianoTimer);
    this.pianoTimer = null;
    try { this.windSrc?.stop(); } catch { /* already stopped */ }
    this.windSrc = null;
    this.master?.disconnect();
    this.master = null;
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx && ctx.state !== "closed") void ctx.close();
  }

  private detachUnlock(): void {
    window.removeEventListener("pointerdown", this.unlock);
    window.removeEventListener("keydown", this.unlock);
  }

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      this.music = this.ctx.createGain();
      this.music.gain.value = 0.5;
      this.music.connect(this.master);
      this.startPiano();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    storage.set("muted", this.muted);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.55, this.ctx.currentTime, 0.02);
    }
    return this.muted;
  }

  /** Piano plays during duels, ducks to near-silence in the tension beat. */
  setMood(mood: "title" | "duel" | "tension"): void {
    if (!this.ctx || !this.music) return;
    const target = mood === "duel" ? 0.55 : mood === "title" ? 0.3 : 0.05;
    this.music.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
  }

  private startWind(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.windSrc) return;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      // brown-ish noise: softer, more wind-like than white
      last = (last + (Math.random() * 2 - 1) * 0.02) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 480;
    const g = ctx.createGain();
    g.gain.value = 0.16;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.07;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    src.connect(lp).connect(g).connect(this.master);
    src.start();
    this.windSrc = src;
    this.windGain = g;
  }

  /** Simple lookahead scheduler for an 8th-note saloon piano loop. */
  private startPiano(): void {
    const ctx = this.ctx!;
    // A-minor-ish honky tonk figure; 0 = rest.
    const melody = [440, 0, 523, 659, 0, 659, 587, 523, 440, 0, 392, 440, 523, 0, 659, 0];
    const bass = [110, 0, 0, 0, 82.4, 0, 0, 0, 110, 0, 0, 0, 98, 0, 0, 0];
    const eighth = 60 / 112 / 2;
    this.nextNoteTime = ctx.currentTime + 0.1;
    this.pianoTimer = window.setInterval(() => {
      if (!this.ctx || this.disposed) return;
      while (this.nextNoteTime < this.ctx.currentTime + 0.35) {
        const i = this.noteIndex % 16;
        const m = melody[i];
        const b = bass[i];
        if (m) this.note(m, this.nextNoteTime, eighth * 1.7, "square", 0.055);
        if (b) this.note(b, this.nextNoteTime, eighth * 2.6, "triangle", 0.09);
        this.nextNoteTime += eighth;
        this.noteIndex++;
      }
    }, 120);
  }

  private note(freq: number, t: number, dur: number, type: OscillatorType, vol: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    env.gain.setValueAtTime(vol, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env).connect(this.music!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  sfx(id: SfxId): void {
    if (this.disposed || this.muted) return;
    const ctx = this.ensureCtx();
    if (!this.master) return;
    const t = ctx.currentTime;
    const beep = (f0: number, f1: number, dur: number, type: OscillatorType, g: number, at = t) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f0, at);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), at + dur);
      env.gain.setValueAtTime(g, at);
      env.gain.exponentialRampToValueAtTime(0.001, at + dur);
      osc.connect(env).connect(this.master!);
      osc.start(at);
      osc.stop(at + dur + 0.02);
    };
    switch (id) {
      case "click": beep(1900, 1400, 0.035, "square", 0.08); break;
      case "reveal":
        beep(660, 660, 0.09, "square", 0.22);
        beep(880, 880, 0.14, "square", 0.22, t + 0.09);
        break;
      case "shot": {
        // noise crack + low thump
        const len = Math.floor(ctx.sampleRate * 0.18);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.value = 0.5;
        src.connect(g).connect(this.master);
        src.start(t);
        beep(160, 40, 0.28, "sine", 0.5);
        break;
      }
      case "thud": beep(120, 35, 0.22, "sine", 0.4); break;
      case "ui": beep(520, 660, 0.06, "square", 0.15); break;
      case "lose":
        [392, 330, 262, 196].forEach((f, i) => beep(f, f * 0.98, 0.22, "square", 0.2, t + i * 0.17));
        break;
      case "win":
        [523, 659, 784].forEach((f, i) => beep(f, f, 0.14, "square", 0.2, t + i * 0.09));
        break;
      case "fanfare":
        [523, 659, 784, 1046, 784, 1046].forEach((f, i) => beep(f, f, 0.18, "square", 0.2, t + i * 0.12));
        break;
    }
  }
}
