/**
 * config.ts — all tuning for Fastest Fingers in the West.
 * Scene is 270x300 logical pixels: exactly the Communicator's 1.18:1 (0.9) aspect,
 * so on the device (1080x1200) every logical pixel scales by an integer 4.
 */

export const VIEW = { W: 270, H: 300 } as const;

/** Strict NES-palette subset (authentic 2C02 entries). */
export const PAL = {
  black: "#000000",
  white: "#FCFCFC",
  grayLight: "#BCBCBC",
  gray: "#7C7C7C",
  sky: "#3CBCFC",
  cream: "#F8D878",
  gold: "#F8B800",
  orange: "#F87858",
  redOrange: "#F83800",
  red: "#D82800",
  darkRed: "#880000",
  brownDark: "#503000",
  brown: "#AC7C00",
  green: "#00A800",
  greenDark: "#005800",
  greenLight: "#58F898",
  skin: "#F8B878",
} as const;

export interface OutlawDef {
  name: string;
  wpm: number;
  bounty: number;
  hat: string;
  shirt: string;
  pants: string;
  feature: "none" | "bandana" | "eyepatch" | "mustache" | "hair";
  /** Boss behaviour: chance per character of a long stumble pause. */
  stumble?: number;
  /** Extra per-character timing spread. */
  jitter?: number;
}

/** Fixed ladder, 10 outlaws, escalating draw speed. */
export const LADDER: OutlawDef[] = [
  { name: "CACTUS JACK", wpm: 28, bounty: 100, hat: PAL.brown, shirt: PAL.cream, pants: PAL.brownDark, feature: "none" },
  { name: "DUSTY PETE", wpm: 36, bounty: 150, hat: PAL.gray, shirt: PAL.orange, pants: PAL.brownDark, feature: "bandana" },
  { name: "ONE-EYE ROY", wpm: 44, bounty: 200, hat: PAL.black, shirt: PAL.greenLight, pants: PAL.gray, feature: "eyepatch" },
  { name: "MONTANA MAE", wpm: 50, bounty: 250, hat: PAL.red, shirt: PAL.white, pants: PAL.red, feature: "hair" },
  { name: "DEADEYE DAN", wpm: 58, bounty: 300, hat: PAL.brownDark, shirt: PAL.sky, pants: PAL.black, feature: "mustache" },
  { name: "RATTLESNAKE RED", wpm: 64, bounty: 400, hat: PAL.darkRed, shirt: PAL.red, pants: PAL.brownDark, feature: "bandana" },
  { name: "TWO-TOED THOMPSON", wpm: 72, bounty: 500, hat: PAL.greenDark, shirt: PAL.gold, pants: PAL.gray, feature: "mustache", jitter: 0.9 },
  { name: "THE PROFESSOR", wpm: 78, bounty: 600, hat: PAL.black, shirt: PAL.grayLight, pants: PAL.black, feature: "none" },
  { name: "SIDEWINDER SAM", wpm: 84, bounty: 800, hat: PAL.green, shirt: PAL.orange, pants: PAL.brownDark, feature: "eyepatch" },
  { name: "BLACK BART", wpm: 92, bounty: 1200, hat: PAL.black, shirt: PAL.black, pants: PAL.black, feature: "mustache", stumble: 0.16 },
];

/** Endless mode: each cycle through the roster adds this much WPM. */
export const ENDLESS_WPM_STEP = 6;

/** Lowercase, letters only, Wild West flavored. Tiered by length. */
export const WORDS = {
  short: ["gun", "colt", "draw", "boot", "gold", "mine", "town", "whip", "herd", "rail", "dust", "iron", "spur", "noon", "law", "six"],
  mid: ["horse", "spurs", "noose", "saloon", "sheriff", "bounty", "cactus", "saddle", "outlaw", "deputy", "coyote", "holster", "bandit", "riders"],
  long: ["desperado", "tumbleweed", "gunfighter", "stagecoach", "horseshoe", "gunslinger", "showdown", "barnstorm", "rattlesnake"],
  boss: ["sarsaparilla", "bootlegging", "reckonings", "frontierland", "thunderstorm", "wantedsign", "vigilantes", "rambunctious"],
} as const;

export function wordForOutlaw(index: number, rnd: () => number): string {
  const pick = (arr: readonly string[]) => arr[Math.floor(rnd() * arr.length)];
  if (index >= 9) return pick(WORDS.boss);
  if (index >= 6) return rnd() < 0.5 ? pick(WORDS.long) : pick(WORDS.mid);
  if (index >= 3) return rnd() < 0.5 ? pick(WORDS.mid) : pick(WORDS.short);
  return pick(WORDS.short);
}

export const TIMING = {
  intro: 1.7,
  tension: 1.4,
  resolve: 1.15,
  betweenExchanges: 0.9,
  outlawDown: 2.4,
  playerHit: 1.6,
} as const;

export const LIVES = 3;
export const BEST_KEY = "bestBounty";
