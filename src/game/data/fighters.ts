/**
 * fighters.ts — the Buffalo Gang roster as data.
 * Art texture keys match the imports registered in scenes/preload.ts.
 * Every playable duelist uses the same seven-frame action sequence.
 */
export interface FighterDef {
  id: string;
  name: string;
  /** Speaker-name color in text boxes. */
  color: string;
  lives: number;
  /** Scale multiplier vs. a normal fighter (Black Bart is 1.5). */
  scale: number;
  bounty: number;
  /** Which frames exist on disk for this fighter. */
  frames: readonly string[];
}

export const FIGHTERS: Record<string, FighterDef> = {
  "yello-billy": {
    id: "yello-billy", name: "YELLO BILLY", color: "#F8D878",
    lives: 2, scale: 1, bounty: 500,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
  "three-finger-rye": {
    id: "three-finger-rye", name: "THREE-FINGER RYE", color: "#F8B800",
    lives: 2, scale: 1, bounty: 500,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
  "sam-snakeeyes": {
    id: "sam-snakeeyes", name: "SAM SNAKEEYES", color: "#58F898",
    lives: 2, scale: 1, bounty: 500,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
  "greg-goose": {
    id: "greg-goose", name: "GREG GOOSE", color: "#AC7C00",
    lives: 2, scale: 1, bounty: 500,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
  "dandy-dan": {
    id: "dandy-dan", name: "DANDY DAN", color: "#F87858",
    lives: 2, scale: 1, bounty: 500,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
  "black-bart": {
    id: "black-bart", name: "BLACK BART", color: "#F83800",
    lives: 5, scale: 1.5, bounty: 1200,
    frames: ["idle", "draw", "aim", "flinch", "fire", "hit", "down"],
  },
};

export const GOON_ORDER = [
  "yello-billy", "three-finger-rye", "sam-snakeeyes", "greg-goose", "dandy-dan",
] as const;
