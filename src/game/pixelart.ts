/**
 * pixelart.ts — every sprite is generated in code (ASCII grids + parametric rects).
 * Outlaw: finer 1px grid, shaded, several poses (16-bit feel).
 * Background: coarse 2px blocks, fewer colors (8-bit feel). Strict NES palette only.
 */
import Phaser from "phaser";
import { PAL, VIEW, type OutlawDef } from "./config";

type Grid = string[];

function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Render an ASCII grid into a Phaser canvas texture. Every row must be the same width. */
export function gridTexture(
  scene: Phaser.Scene,
  key: string,
  grid: Grid,
  colors: Record<string, string>,
  scale = 1,
  outline = false,
): void {
  const w = grid[0].length;
  for (const row of grid) {
    if (row.length !== w) throw new Error(`grid ${key}: ragged row "${row}" (${row.length} != ${w})`);
  }
  const tex = scene.textures.createCanvas(key, w * scale, grid.length * scale)!;
  const ctx = tex.getContext();
  if (outline) {
    // NES-style 1-cell black outline on every transparent cell touching the sprite
    ctx.fillStyle = PAL.black;
    const filled = (x: number, y: number) =>
      y >= 0 && y < grid.length && x >= 0 && x < w && grid[y][x] !== "." && grid[y][x] !== " ";
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < w; x++) {
        if (filled(x, y)) continue;
        if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  }
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < w; x++) {
      const c = grid[y][x];
      if (c === "." || c === " ") continue;
      const col = colors[c];
      if (!col) throw new Error(`grid ${key}: unmapped char "${c}"`);
      ctx.fillStyle = col;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  tex.refresh();
}

/* ------------------------------------------------------------------ */
/* Outlaw                                                              */
/* ------------------------------------------------------------------ */

// 22 x 44. H hat, b hat band, K skin, S shirt, V vest, T belt, U buckle,
// P pants, B boots, G gun, E eye/black.
const OUTLAW_IDLE: Grid = [
  ".......HHHHHHHH.......",
  "......HHHHHHHHHH......",
  "......HHHHHHHHHH......",
  "......HHHHHHHHHH......",
  ".HH...bbbbbbbbbb...HH.",
  ".HHHHHHHHHHHHHHHHHHHH.",
  "......KKKKKKKKKK......",
  "......KKKKKKKKKK......",
  "......KEKKKKEKKK......",
  "......KKKKKKKKKK......",
  "......KKKKKKKKKK......",
  "......kKKKKKKKKk......",
  ".......KKKKKKKK.......",
  "........KKKKKK........",
  ".....SSSSSSSSSSSS.....",
  "....SSSSSSSSSSSSSS....",
  "...SSSSSSSSSSSSSSSS...",
  "..SSSSSSSSSSSSSSSSSS..",
  "..SSSSSSSSSSSSSSSSSS..",
  "..sSSSSSSSSSSSSSSSSs..",
  "..sSSSSSSSSSSSSSSSSs..",
  "..sSSSSSSSSSSSSSSSSG..",
  "..sSSSSSSSSSSSSSSSSG..",
  "..sSSSSSSSSSSSSSSSs...",
  "...SSSSSSSSSSSSSSS....",
  "....SSSSSSSSSSSSSS....",
  ".....SSSSSSSSSSSS.....",
  ".....TTTTTUUTTTTT.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....PPPPPPPPPPPP.....",
  ".....BBBB..BBBB.......",
  ".....BBBB..BBBB.......",
  ".....BBBB..BBBB.......",
  ".....BBBB..BBBB.......",
  "....BBBBB..BBBBB......",
];

// Pose variants: explicit row replacements for the gun arm.
function withArm(base: Grid, replacements: Record<number, string>): Grid {
  return base.map((row, y) => replacements[y] ?? row);
}

const DRAW_ROWS: Record<number, string> = {
  16: "...SSSSSSSSSSSSSSSS...",
  17: "..SSSSSSSSSSSSSSSS....",
  18: "..SSSSSSSSSSSSSSKK....",
  19: "..sSSSSSSSSSSSSSKK....",
  20: "..sSSSSSSSSSSSSSGG....",
  21: "..sSSSSSSSSSSSSSGG....",
  22: "..sSSSSSSSSSSSSSSs....",
  23: "..sSSSSSSSSSSSSSSs....",
};

const AIM_ROWS: Record<number, string> = {
  16: "...SSSSSSSSSSSSSSSS...",
  17: "..SSSSSSSSSSSSSSSSSS..",
  18: "..SSSSSSSSSSSSSSSSKKK.",
  19: "..sSSSSSSSSSSSSSSSKKK.",
  20: "..sSSSSSSSSSSSSSSSGGGG",
  21: "..sSSSSSSSSSSSSSSSGGGG",
  22: "..sSSSSSSSSSSSSSSSs...",
};

const HAT_GRID: Grid = [
  "....HHHHHH....",
  "....HHHHHH....",
  "H...bbbbbb...H",
  "HHHHHHHHHHHHHH",
];

export function outlawColors(def: OutlawDef): Record<string, string> {
  return {
    H: def.hat,
    h: shade(def.hat, 0.65),
    b: shade(def.hat, 0.42),
    V: PAL.black,
    T: PAL.brownDark,
    U: PAL.gold,
    K: PAL.skin,
    k: shade(PAL.skin, 0.8),
    E: PAL.black,
    S: def.shirt,
    s: shade(def.shirt, 0.7),
    P: def.pants,
    p: shade(def.pants, 0.75),
    B: PAL.brownDark,
    G: PAL.grayLight,
  };
}

function applyFeature(grid: Grid, def: OutlawDef): { grid: Grid; colors: Record<string, string> } {
  const colors = outlawColors(def);
  const rows = grid.map((r) => r.split(""));
  if (def.feature === "bandana") {
    colors.N = PAL.red;
    for (let x = 7; x <= 14; x++) rows[13][x] = "N";
    rows[14][12] = "N";
    rows[15][12] = "N";
  } else if (def.feature === "eyepatch") {
    for (let x = 7; x <= 9; x++) rows[8][x] = "E";
    rows[7][7] = "E";
    rows[9][7] = "E";
  } else if (def.feature === "mustache") {
    for (let x = 8; x <= 13; x++) rows[10][x] = "E";
    rows[11][8] = "E";
    rows[11][13] = "E";
  } else if (def.feature === "hair") {
    colors.R = PAL.gold;
    for (let y = 6; y <= 12; y++) {
      rows[y][5] = "R";
      rows[y][16] = "R";
    }
  }
  return { grid: rows.map((r) => r.join("")), colors };
}

export function buildOutlawTextures(scene: Phaser.Scene, def: OutlawDef, index: number): void {
  const poses: Array<[string, Grid]> = [
    ["idle", OUTLAW_IDLE],
    ["draw", withArm(OUTLAW_IDLE, DRAW_ROWS)],
    ["aim", withArm(OUTLAW_IDLE, AIM_ROWS)],
  ];
  for (const [pose, grid] of poses) {
    const { grid: g, colors } = applyFeature(grid, def);
    // dark vest panels over the shirt, arms stay in shirt color (Wild Gunman look)
    const vested = g.map((row, y) => {
      if (y < 15 || y > 25) return row;
      const cells = row.split("");
      for (const x of [5, 6, 15, 16]) {
        if (cells[x] === "S" || cells[x] === "s") cells[x] = "V";
      }
      return cells.join("");
    });
    gridTexture(scene, `outlaw-${index}-${pose}`, vested, colors, 2, true);
  }
  gridTexture(scene, `hat-${index}`, HAT_GRID, outlawColors(def), 2, true);
}

/* ------------------------------------------------------------------ */
/* Background (8-bit, coarse 2px blocks)                               */
/* ------------------------------------------------------------------ */

export function buildBackground(scene: Phaser.Scene): void {
  const key = "bg";
  const tex = scene.textures.createCanvas(key, VIEW.W, VIEW.H)!;
  const ctx = tex.getContext();
  const px = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x * 2, y * 2, w * 2, h * 2);
  };
  // sky bands
  px(0, 0, 135, 62, PAL.sky);
  px(0, 46, 135, 16, PAL.cream);
  // sun
  px(104, 8, 12, 12, PAL.white);
  px(106, 6, 8, 16, PAL.white);
  // clouds
  px(14, 12, 18, 4, PAL.white);
  px(18, 10, 10, 2, PAL.white);
  px(58, 20, 22, 4, PAL.white);
  px(64, 18, 10, 2, PAL.white);
  // distant mesas
  px(80, 44, 30, 18, PAL.orange);
  px(86, 38, 18, 6, PAL.orange);
  px(80, 56, 30, 6, PAL.redOrange);
  px(0, 50, 26, 12, PAL.redOrange);
  px(4, 46, 14, 4, PAL.redOrange);
  // ground
  px(0, 62, 135, 88, PAL.cream);
  px(0, 62, 135, 3, PAL.gold);
  // street (center strip, slightly darker)
  px(46, 66, 44, 84, PAL.gold);
  px(48, 66, 40, 84, shade(PAL.gold, 0.92));
  // saloon, left
  px(2, 30, 38, 36, PAL.brown);
  px(2, 30, 38, 4, PAL.brownDark);
  px(0, 26, 42, 5, PAL.brownDark);
  px(4, 36, 34, 8, PAL.darkRed); // sign band
  px(8, 48, 10, 18, PAL.brownDark); // door
  px(24, 48, 10, 10, PAL.sky); // window
  px(24, 48, 10, 2, PAL.brownDark);
  px(28, 48, 2, 10, PAL.brownDark);
  // porch posts
  px(2, 44, 2, 22, PAL.brownDark);
  px(38, 44, 2, 22, PAL.brownDark);
  // bank, right
  px(98, 34, 34, 32, PAL.grayLight);
  px(98, 34, 34, 4, PAL.gray);
  px(96, 30, 38, 5, PAL.gray);
  px(102, 40, 26, 6, PAL.darkRed);
  px(108, 50, 12, 16, PAL.gray);
  // cactus
  px(120, 96, 6, 26, PAL.green);
  px(114, 102, 6, 4, PAL.green);
  px(114, 96, 4, 10, PAL.green);
  px(126, 106, 6, 4, PAL.green);
  px(128, 100, 4, 10, PAL.green);
  px(120, 96, 2, 26, PAL.greenDark);
  // ground tufts + stones
  const tufts: Array<[number, number]> = [[10, 80], [26, 96], [100, 84], [14, 120], [112, 128], [30, 132], [96, 140], [60, 76]];
  for (const [x, y] of tufts) {
    px(x, y, 4, 2, PAL.brown);
    px(x + 1, y - 2, 2, 2, PAL.green);
  }
  tex.refresh();
}

/* ------------------------------------------------------------------ */
/* Small props                                                         */
/* ------------------------------------------------------------------ */

export function buildProps(scene: Phaser.Scene): void {
  gridTexture(scene, "vulture-0", [
    "K......K",
    "KK....KK",
    ".KKKKKK.",
    "...KK...",
  ], { K: PAL.black }, 2);
  gridTexture(scene, "vulture-1", [
    "........",
    "KKKKKKKK",
    "..KKKK..",
    "...KK...",
  ], { K: PAL.black }, 2);
  gridTexture(scene, "tumbleweed", [
    "..KKKK..",
    ".K.KK.K.",
    "K.K..K.K",
    "KK.KK.KK",
    "K.K..K.K",
    ".K.KK.K.",
    "..KKKK..",
  ], { K: PAL.brown }, 2);
  gridTexture(scene, "flash", [
    "...Y...",
    ".Y.Y.Y.",
    "..YYY..",
    "YYYWYYY",
    "..YYY..",
    ".Y.Y.Y.",
    "...Y...",
  ], { Y: PAL.gold, W: PAL.white }, 2);
  gridTexture(scene, "player-hat", HAT_GRID, { H: PAL.brown, b: PAL.brownDark }, 2, true);
  // HUD life icon: little hat, outlined so it reads on any sky color
  gridTexture(scene, "life-hat", [
    "..HHHH..",
    ".HHHHHH.",
    "HHHHHHHH",
  ], { H: PAL.gold }, 2, true);
  gridTexture(scene, "life-hat-lost", [
    "..HHHH..",
    ".HHHHHH.",
    "HHHHHHHH",
  ], { H: PAL.gray }, 2, true);
  gridTexture(scene, "blood-px", ["R"], { R: PAL.red }, 2);
  gridTexture(scene, "blood-px-dark", ["R"], { R: PAL.darkRed }, 2);
}
