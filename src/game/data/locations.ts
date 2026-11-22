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
  /** Optional reaction after the outlaw falls, such as crying at the Church. */
  victoryKey?: string;
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
  /** Keep the representative visible during the duel and react to gunshots. */
  repVisible?: boolean;
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
    mapX: 0.29, mapY: 0.77, posterX: 0.29, posterY: 0.77,
    bgKey: "bg-gambling-den", repKey: "rep-gambling-den", repName: "BUSTED BEN",
    // The rigged poker game on the right, a second card table on the left.
    // Scale-mapped like the saloon; the center duel lane stays clear.
    crowd: [
      { key: "npc-townman", x: 80, y: 150, h: hOf(METERS.npc, 150) },
      { key: "npc-matron", x: 180, y: 150, h: hOf(METERS.npc, 150) },
      { key: "npc-matron", x: 45, y: 182, h: hOf(METERS.npc, 182) },
      { key: "npc-laborer", x: 208, y: 198, h: hOf(METERS.npc, 198), flip: true },
      { key: "npc-oldtimer", x: 182, y: 205, h: hOf(METERS.npc, 205) },
      { key: "npc-townman", x: 60, y: 216, h: hOf(METERS.npc, 216), flip: true },
      { key: "npc-laborer", x: 30, y: 252, h: hOf(METERS.npc, 252), flip: true },
    ],
    props: [
      { key: "prop-poker-table", x: 208, y: 214, h: hOf(METERS.table, 214) },
      { key: "prop-chair-upright", x: 240, y: 222, h: hOf(METERS.chair, 222) },
      { key: "prop-table-round", x: 60, y: 230, h: hOf(METERS.table, 230) },
      { key: "prop-chair-upright", x: 90, y: 235, h: hOf(METERS.chair, 235) },
    ],
    repSpot: { x: 105, y: 185 },
    repH: 70,
    thankYou: "My lucky watch! You're aces, Sheriff. Aces!",
  },
  {
    id: "church", name: "THE CHURCH", fighterId: "dandy-dan",
    mapX: 0.185, mapY: 0.535, posterX: 0.185, posterY: 0.535,
    bgKey: "bg-church", repKey: "rep-church", repName: "FATHER MERRITT",
    // Father Merritt and the men are furious; the matrons endure Dan's poetry.
    // Pews are separate depth-sorted objects, leaving the central aisle clear.
    crowd: [
      { key: "npc-townman", x: 52, y: 150, h: hOf(METERS.npc, 150) },
      { key: "npc-matron", x: 198, y: 150, h: hOf(METERS.npc, 150), victoryKey: "npc-matron-crying" },
      { key: "npc-oldtimer", x: 36, y: 182, h: hOf(METERS.npc, 182) },
      { key: "npc-matron", x: 220, y: 185, h: hOf(METERS.npc, 185), flip: true, victoryKey: "npc-matron-crying" },
      { key: "npc-townman", x: 66, y: 207, h: hOf(METERS.npc, 207), flip: true },
      { key: "npc-matron", x: 200, y: 210, h: hOf(METERS.npc, 210), victoryKey: "npc-matron-crying" },
      { key: "npc-laborer", x: 28, y: 252, h: hOf(METERS.npc, 252), flip: true },
    ],
    props: [
      { key: "prop-church-pew", x: 48, y: 218, h: hOf(METERS.churchPew, 218) },
      { key: "prop-church-pew", x: 222, y: 218, h: hOf(METERS.churchPew, 218) },
      { key: "prop-church-pew", x: 50, y: 258, h: hOf(METERS.churchPew, 258) },
      { key: "prop-church-pew", x: 220, y: 258, h: hOf(METERS.churchPew, 258) },
    ],
    repSpot: { x: 185, y: 168 },
    repH: 64,
    repVisible: true,
    thankYou: "Bless you, Sheriff. The sermon was getting unbearable.",
  },
  {
    id: "gold-mine", name: "GOLD MINE", fighterId: "greg-goose",
    mapX: 0.75, mapY: 0.185, posterX: 0.75, posterY: 0.185,
    bgKey: "bg-gold-mine", repKey: "rep-gold-mine", repName: "DUSTY PETE",
    // Miners gather around the blocked tunnel. Separate props sit in front
    // of them by depth, leaving the center lane clear for Goose.
    crowd: [
      { key: "npc-townman", x: 55, y: 150, h: hOf(METERS.npc, 150) },
      { key: "npc-laborer", x: 210, y: 155, h: hOf(METERS.npc, 155), flip: true },
      { key: "npc-oldtimer", x: 45, y: 182, h: hOf(METERS.npc, 182) },
      { key: "npc-oldtimer", x: 182, y: 205, h: hOf(METERS.npc, 205), flip: true },
      { key: "npc-laborer", x: 218, y: 198, h: hOf(METERS.npc, 198) },
      { key: "npc-townman", x: 60, y: 216, h: hOf(METERS.npc, 216), flip: true },
      { key: "npc-laborer", x: 28, y: 252, h: hOf(METERS.npc, 252), flip: true },
    ],
    props: [
      { key: "prop-mine-cart", x: 215, y: 220, h: hOf(METERS.mineCart, 220) },
      { key: "prop-mining-crate", x: 55, y: 235, h: hOf(METERS.miningCrate, 235) },
    ],
    repSpot: { x: 92, y: 178 },
    repH: 72,
    thankYou: "You got the mine back! The whole town eats because of you!",
  },
  {
    id: "town-hall", name: "TOWN HALL", fighterId: "black-bart",
    mapX: 0.50, mapY: 0.56, posterX: 0.435, posterY: 0.565,
    bgKey: "bg-town-hall", repKey: "rep-town-hall", repName: "MAYOR HOBART PLUM",
    crowd: [],
    repSpot: { x: 211, y: 187 },
    repH: 66,
    repVisible: true,
    thankYou: "Tombwood Creek is free! You have my eternal gratitude, Sheriff.",
  },
];

export function locationById(id: string): LocationDef {
  const loc = LOCATIONS.find((l) => l.id === id);
  if (!loc) throw new Error(`Unknown location: ${id}`);
  return loc;
}
