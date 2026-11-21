/**
 * dialogue.ts — duel intro exchanges and prologue text.
 * Structure per duel: goon opening line → player picks 1 of 3 sheriff lines
 * (stern / dry wit / gentle) → goon closing response → race begins.
 */
export interface SheriffOption {
  tone: string;
  line: string;
}

export interface DuelDialogue {
  opening: string;
  options: readonly SheriffOption[];
  closing: string;
}

export const DIALOGUE: Record<string, DuelDialogue> = {
  "yello-billy": {
    opening: "I-i-I'm in charge of M-Main Street now, lawman!",
    options: [
      { tone: "STERN", line: "This street belongs to Tombwood Creek." },
      { tone: "DRY WIT", line: "You? In charge? Your knees are knocking." },
      { tone: "GENTLE", line: "Hand over the gun, son. Walk away." },
    ],
    closing: "S-s-shoot first, ask questions later! Wait — n-no, wait...",
  },
  "three-finger-rye": {
    opening: "Hic! This here saloon's mine, Sheriff! Whiskey's free... for ME!",
    options: [
      { tone: "STERN", line: "The party's over, Rye. Out of my town." },
      { tone: "DRY WIT", line: "You couldn't hit the floor if you fell on it." },
      { tone: "GENTLE", line: "Put the bottle down. Nobody needs to die thirsty." },
    ],
    closing: "Hic! I'll... I'll show ya! Barkeep, hold my beer!",
  },
};

export const PROLOGUE: readonly string[] = [
  "The Buffalo Gang rode into Tombwood Creek one dusty morning, and the good folk of this quiet gold and cattle town were too peaceful to stop them.",
  "Now the saloon pours free whiskey, the poker table is rigged, and the mine stands idle.",
  "Somebody had to do something. Somebody with fast fingers and a steady nerve.",
  "That somebody... is you, Sheriff.",
];
