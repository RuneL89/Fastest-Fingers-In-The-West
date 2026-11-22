/**
 * locations.ts — the six duel locations of Tombwood Creek.
 * Map hotspot positions are normalized (0..1) against the map image;
 * the MapScene multiplies them by the view size.
 */
import { hOf, METERS } from "./scale";

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

/** A townsfolk sprite: feet at (x, y), scaled to h logical pixels tall. */
export interface DuelActor {
  key: string;
  x: number;
  y: number;
  h: number;
  flip?: boolean;
}

/** A furniture object drawn in the same depth-sorted pass as the crowd. */
export interface DuelProp {
  key: string;
  x: number;
  y: number;
  h: number;
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
  /** Townsfolk, depth-sorted with props and occluders by feet-y. */
  crowd?: readonly DuelActor[];
  /** Furniture objects; an actor standing behind one is genuinely hidden. */
  props?: readonly DuelProp[];
  /** Victory representative position in the duel scene. */
  repSpot?: DuelSpot;
  /** Representative pixel height (defaults to REP_TARGET_H in DuelScene). */
  repH?: number;
  /** Background regions redrawn in front of townsfolk and the representative. */
  occluders?: readonly DuelOccluder[];
  thankYou: string;
}

export const LOCATIONS: LocationDef[] = [
  {
    id: "main-street", name: "MAIN STREET", fighterId: "yello-billy",
    mapX: 0.70, mapY: 0.70, posterX: 0.62, posterY: 0.70,
    bgKey: "bg-main-street", repKey: "rep-mainstreet", repName: "STEW POTTS",
    crowd: [
      { key: "npc-townman", x: 27, y: 240, h: 80 },
      { key: "npc-matron", x: 243, y: 240, h: 80 },
    ],
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
    bgKey: "bg-saloon-v2", repKey: "rep-saloon", repName: "BARMAN",
    // Busy bar: 7 townsfolk + the barman. Heights come from the scale map
    // (data/scale.ts); the center duel lane stays clear of people and props.
    crowd: [
      { key: "npc-matron", x: 190, y: 150, h: hOf(METERS.npc, 150) },
      { key: "npc-oldtimer", x: 216, y: 158, h: hOf(METERS.npc, 158), flip: true },
      { key: "npc-oldtimer", x: 48, y: 188, h: hOf(METERS.npc, 188) },
      { key: "npc-laborer", x: 218, y: 196, h: hOf(METERS.npc, 196) },
      { key: "npc-townman", x: 58, y: 214, h: hOf(METERS.npc, 214), flip: true },
      { key: "npc-matron", x: 244, y: 236, h: hOf(METERS.npc, 236), flip: true },
      { key: "npc-laborer", x: 26, y: 252, h: hOf(METERS.npc, 252), flip: true },
    ],
    props: [
      { key: "prop-table-round", x: 218, y: 208, h: hOf(METERS.table, 208) },
      { key: "prop-chair-upright", x: 252, y: 212, h: hOf(METERS.chair, 212) },
      { key: "prop-table-round", x: 58, y: 226, h: hOf(METERS.table, 226) },
      { key: "prop-chair-upright", x: 30, y: 230, h: hOf(METERS.chair, 230) },
      { key: "prop-table-tilted", x: 244, y: 252, h: hOf(METERS.tippedTable, 252) },
      { key: "prop-chair-broken", x: 198, y: 264, h: hOf(METERS.brokenChair, 264) },
    ],
    repSpot: { x: 62, y: 142 },
    repH: 78,
    // The bar counter is painted into the background; this region is redrawn
    // at depth 168 so the barman (feet 142) hides behind it while nearer
    // townsfolk correctly stand in front of it.
    occluders: [{ x: 0, y: 92, width: 104, height: 76 }],
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
