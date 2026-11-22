/**
 * scale.ts — the saloon scale map. Every crowd member and furniture prop
 * derives its pixel height from a real-world size and its floor depth, so a
 * table is always a table's height next to a person, never a toy or a wall.
 *
 * Real-world reference sizes (meters):
 *   adult townsfolk  1.75
 *   round table      0.85  (top on pedestal)
 *   upright chair    0.95  (including backrest)
 *   tipped table     1.15  (tabletop diameter, lying on its side)
 *   broken chair     0.45  (smashed debris pile)
 *
 * Perspective: pixels-per-meter grows as feet-y moves down the 270x300 view.
 *   feet y=150 (back wall)  -> 26 px/m   (adult 46px)
 *   feet y=200 (mid floor)  -> 40 px/m   (adult 70px)
 *   feet y=240 (near)       -> 46 px/m   (adult 80px)
 *   feet y=265 (front edge) -> 50 px/m   (adult 88px)
 */

export const METERS = {
  npc: 1.75,
  table: 0.85,
  chair: 0.95,
  tippedTable: 1.15,
  brokenChair: 0.45,
} as const;

const DEPTH_PPM: readonly (readonly [number, number])[] = [
  [150, 26],
  [200, 40],
  [240, 46],
  [265, 50],
];

export function pixelsPerMeter(feetY: number): number {
  for (let i = 0; i < DEPTH_PPM.length - 1; i++) {
    const [y0, p0] = DEPTH_PPM[i];
    const [y1, p1] = DEPTH_PPM[i + 1];
    if (feetY <= y1) return p0 + ((p1 - p0) * (feetY - y0)) / (y1 - y0);
  }
  return DEPTH_PPM[DEPTH_PPM.length - 1][1];
}

/** Pixel height for a real-world object whose feet rest at feetY. */
export function hOf(meters: number, feetY: number): number {
  return Math.round(meters * pixelsPerMeter(feetY));
}
