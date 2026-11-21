/**
 * state.ts — the single run state shared across scenes.
 * No saves (RULES.md v1): a run lives in memory; game over resets everything.
 */
export type Difficulty = "easy" | "normal" | "hard";

/** Goon typing speed (words per minute) by difficulty. */
export const DIFFICULTY_WPM: Record<Difficulty, number> = {
  easy: 6,
  normal: 9,
  hard: 12,
};

export interface RunState {
  difficulty: Difficulty;
  playerLives: number;
  freed: Set<string>;
}

export const run: RunState = {
  difficulty: "normal",
  playerLives: 3,
  freed: new Set<string>(),
};

export function resetRun(): void {
  run.playerLives = 3;
  run.freed = new Set<string>();
}

export function townHallUnlocked(): boolean {
  return ["main-street", "saloon", "gambling-den", "gold-mine", "church"]
    .every((id) => run.freed.has(id));
}
