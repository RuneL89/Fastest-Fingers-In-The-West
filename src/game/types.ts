/** Shared/global types. */

export interface DuelProbe {
  phase: string;
  paused: boolean;
  word: string;
  typed: number;
  playerLives: number;
  outlawLives: number;
  outlawIndex: number;
  bounty: number;
  endlessCycle: number;
  muted: boolean;
}

declare global {
  interface Window {
    __GAME_READY__?: boolean;
    __duel?: () => DuelProbe;
  }
}

export {};
