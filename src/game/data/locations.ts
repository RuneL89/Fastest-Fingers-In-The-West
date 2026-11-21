/**
 * locations.ts — the six duel locations of Tombwood Creek.
 * Map hotspot positions are normalized (0..1) against the map image;
 * the MapScene multiplies them by the view size.
 */
export interface LocationDef {
  id: string;
  name: string;
  fighterId: string;
  /** Normalized building position on the map image. */
  mapX: number;
  mapY: number;
  /** Normalized WANTED-poster position beside the visible building. */
  posterX: number;
  posterY: number;
  /** Duel background texture key (only Main Street exists in Phase 1). */
  bgKey: string;
  /** Representative sprite texture base key (only Stew exists in Phase 1). */
  repKey: string | null;
  thankYou: string;
}

export const LOCATIONS: LocationDef[] = [
  {
    id: "main-street", name: "MAIN STREET", fighterId: "yello-billy",
    mapX: 0.70, mapY: 0.70, posterX: 0.62, posterY: 0.70,
    bgKey: "bg-main-street", repKey: "rep-mainstreet",
    thankYou: "Store's open again! First pickle's free, Sheriff.",
  },
  {
    id: "saloon", name: "THE SALOON", fighterId: "three-finger-rye",
    mapX: 0.275, mapY: 0.175, posterX: 0.29, posterY: 0.275,
    bgKey: "bg-saloon", repKey: null,
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
