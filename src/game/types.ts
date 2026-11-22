/** Shared/global types. */

export interface DuelProbe {
  phase: string;
  paused: boolean;
  word: string;
  typed: number;
  aiChars: number;
  outlawPose: string;
  repPose: string | null;
  repVisible: boolean;
  npcPoses: string[];
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
    __map?: () => { freed: string[]; unlocked: boolean; lives: number };
    __ending?: () => { stage: "celebration" | "closing"; freed: string[]; complete: boolean };
  }
}

export {};
