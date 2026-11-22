/**
 * phrases.ts — per-goon phrase pools, themed per NARRATIVE.md.
 * Lowercase letters only, with a themed pool for every duelist.
 */
export const PHRASE_POOLS: Record<string, readonly string[]> = {
  "yello-billy": [
    "gun", "boot", "dust", "hat", "horse", "bread", "wagon", "chair",
    "door", "horse", "water", "table", "shoe", "clock", "rope", "bell",
    "cup", "key", "floor", "house", "wheel", "plate", "fence", "road",
    "broom", "lamp", "bucket", "spoon", "coat", "stairs", "window",
  ],
  "three-finger-rye": ["whiskey", "saloon", "bottle", "barrel", "tavern", "drunk"],
  "sam-snakeeyes": ["poker", "gamble", "dealer", "aces", "cheat", "ante", "flush"],
  "greg-goose": ["beaver", "timber", "trapper", "moose", "forest", "cabin", "pelts", "nugget", "tunnel", "pickaxe"],
  "dandy-dan": ["romance", "darling", "flowers", "dearest", "adore", "sonnet", "poetry", "charm", "heart", "roses"],
  "black-bart": ["buffalo", "revenge", "outlaw", "showdown", "bandit", "stampede", "lawless", "rampage", "gunslinger", "tombwood"],
};

export function phraseFor(fighterId: string, rnd: () => number): string {
  const pool = PHRASE_POOLS[fighterId];
  return pool[Math.floor(rnd() * pool.length)];
}
