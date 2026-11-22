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
  "sam-snakeeyes": {
    opening: "Well, well. The law sits down at my table. The house always wins, Sheriff.",
    options: [
      { tone: "STERN", line: "Your game's rigged, Snakeeyes. It ends now." },
      { tone: "DRY WIT", line: "You call that a poker face? I've seen better on a mule." },
      { tone: "GENTLE", line: "Fold your hand, Sam. Nobody has to get hurt." },
    ],
    closing: "Ha! I'll deal you in... six feet under!",
  },
  "greg-goose": {
    opening: "Well, look what crawled out of the creek. This here's my mine now, lawman.",
    options: [
      { tone: "STERN", line: "Step away from the tunnel, Goose. The miners are going back to work." },
      { tone: "DRY WIT", line: "I've seen quicker traps on a cabin door." },
      { tone: "GENTLE", line: "Share the trail, Greg. Nobody needs to get hurt." },
    ],
    closing: "I'll bag you like a varmint!",
  },
  "dandy-dan": {
    opening: "Ah, the sheriff arrives at last. Do try not to interrupt the poetry, darling.",
    options: [
      { tone: "STERN", line: "Step away from the congregation, Dan. Your recital is over." },
      { tone: "DRY WIT", line: "Your rhymes are cruel. Your aim had better not be." },
      { tone: "GENTLE", line: "Holster the gun, Dan. Let these folks go home." },
    ],
    closing: "But I haven't reached the romantic finale!",
  },
  "black-bart": {
    opening: "Five fool gunmen brought you here. One big buffalo sends you back.",
    options: [
      { tone: "STERN", line: "Your gang is finished, Bart. Let the Mayor go." },
      { tone: "DRY WIT", line: "That head is all buffalo. Let's see if you have any brains." },
      { tone: "GENTLE", line: "There is still a road out of town, Bart. Take it alive." },
    ],
    closing: "This town belongs to the Buffalo Gang. And I belong to nobody!",
  },
};

export const PROLOGUE: readonly string[] = [
  "The Buffalo Gang rode into Tombwood Creek one dusty morning, and the good folk of this quiet gold and cattle town were too peaceful to stop them.",
  "Now the saloon pours free whiskey, the poker table is rigged, and the mine stands idle.",
  "Somebody had to do something. Somebody with fast fingers and a steady nerve.",
  "That somebody... is you, Sheriff.",
];
