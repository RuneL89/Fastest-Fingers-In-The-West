/**
 * locations.ts — the six duel locations of Tombwood Creek.
 * Map hotspot positions are normalized (0..1) against the map image;
 * the MapScene multiplies them by the view size.
 */
export interface DuelSpot {
  x: number;
  y: number;
}

export interface DuelOccluder {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LocationDef {
  id: string;
  name: string;
  fighterId: string;
  /** Normalized freed-representative position outside the building. */
  mapX: number;
  mapY: number;
  /** Normalized WANTED-poster position beside the visible building. */
  posterX: number;
  posterY: number;
  /** Duel background texture key. */
  bgKey: string;
  /** Representative sprite texture base key. */
  repKey: string | null;
  /** Speaker label for the freed representative's thank-you line. */
  repName?: string;
  /** Two background townsfolk texture base keys for this duel. */
  npcs?: readonly [string, string];
  /** Duel-scene positions for those townsfolk, partly hidden by occluders. */
  npcSpots?: readonly [DuelSpot, DuelSpot];
  /** Victory representative position in the duel scene. */
  repSpot?: DuelSpot;
  /** Background regions redrawn in front of townsfolk and the representative. */
  occluders?: readonly DuelOccluder[];
  thankYou: string;
}

export const LOCATIONS: LocationDef[] = [
  {
    id: "main-street", name: "MAIN STREET", fighterId: "yello-billy",
    mapX: 0.70, mapY: 0.70, posterX: 0.62, posterY: 0.70,
    bgKey: "bg-main-street", repKey: "rep-mainstreet", repName: "STEW POTTS",
    npcSpots: [{ x: 27, y: 240 }, { x: 243, y: 240 }],
    repSpot: { x: 57, y: 240 },
    occluders: [
      { x: 0, y: 205, width: 96, height: 55 },
      { x: 174, y: 205, width: 96, height: 55 },
    ],
    thankYou: "Store's open again! First pickle's free, Sheriff.",
  },
  {
    id: "saloon", name: "THE SALOON", fighterId: "three-finger-rye",
    mapX: 0.29, mapY: 0.275, posterX: 0.29, posterY: 0.275,
    bgKey: "bg-saloon", repKey: "rep-saloon", repName: "BARMAN",
    npcs: ["npc-oldtimer", "npc-townman"],
    npcSpots: [{ x: 48, y: 142 }, { x: 236, y: 148 }],
    repSpot: { x: 62, y: 142 },
    occluders: [
      { x: 0, y: 92, width: 104, height: 76 },
      { x: 206, y: 96, width: 64, height: 78 },
    ],
    thankYou: "First round's on the house, Sheriff. The good stuff, this time.",
  },
  {
    id: "gambling-den", name: "GAMBLING DEN", fighterId: "sam-snakeeyes",
    mapX: 0.285, mapY: 0.69, posterX: 0.29, posterY: 0.77,
    bgKey: "bg-gambling-den", repKey: null,
    thankYou: "You cleaned him out! The town owes you its wallets.",
  },
  {
    id: "church", name: "THE CHURCH", fighterId: "dandy-dan",
    mapX: 0.185, mapY: 0.43, posterX: 0.185, posterY: 0.535,
    bgKey: "bg-church", repKey: null,
    thankYou: "Bless you, Sheriff. The sermon was getting unbearable.",
  },
  {
    id: "gold-mine", name: "GOLD MINE", fighterId: "greg-goose",
    mapX: 0.82, mapY: 0.11, posterX: 0.75, posterY: 0.185,
    bgKey: "bg-gold-mine", repKey: null,
    thankYou: "The mine is back in business, Sheriff! You saved the whole town.",
  },
  {
    id: "town-hall", name: "TOWN HALL", fighterId: "black-bart",
    mapX: 0.50, mapY: 0.45, posterX: 0.435, posterY: 0.565,
    bgKey: "bg-town-hall", repKey: null,
    thankYou: "Tombwood Creek is free! You have my eternal gratitude, Sheriff.",
  },
];

export function locationById(id: string): LocationDef {
  const loc = LOCATIONS.find((l) => l.id === id);
  if (!loc) throw new Error(`Unknown location: ${id}`);
  return loc;
}
