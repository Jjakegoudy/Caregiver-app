/**
 * Phase 2.1 / 4.4 — the zip code is the only location question the parent
 * ever answers. From it the app silently derives the state and loads that
 * state's Navigator config. No state dropdown, no extra step.
 *
 * Resolution uses the USPS 3-digit ZIP prefix, which maps cleanly to a
 * state for the overwhelming majority of prefixes. A handful of prefixes
 * straddle special cases (military APO/FPO, territories); those return
 * null and the app simply skips state-specific content rather than
 * guessing wrong.
 */

type Zip3Range = [start: number, end: number, state: string];

// Ranges are inclusive and checked in order; earlier entries win, which
// lets narrow exceptions (e.g. 055 → MA inside Vermont's block) sit above
// the broad range they carve out of.
const RANGES: Zip3Range[] = [
  [6, 9, 'PR'], // Puerto Rico & USVI share 008
  [8, 8, 'VI'],
  [10, 27, 'MA'],
  [28, 29, 'RI'],
  [30, 38, 'NH'],
  [39, 49, 'ME'],
  [55, 55, 'MA'], // IRS Andover exception inside VT block
  [50, 59, 'VT'],
  [60, 69, 'CT'],
  [70, 89, 'NJ'],
  [90, 98, 'AE'], // military — no state config
  [100, 149, 'NY'],
  [150, 196, 'PA'],
  [197, 199, 'DE'],
  [201, 201, 'VA'],
  [200, 205, 'DC'],
  [206, 219, 'MD'],
  [220, 246, 'VA'],
  [247, 268, 'WV'],
  [270, 289, 'NC'],
  [290, 299, 'SC'],
  [300, 319, 'GA'],
  [340, 340, 'AA'], // military
  [320, 349, 'FL'],
  [350, 369, 'AL'],
  [370, 385, 'TN'],
  [398, 399, 'GA'],
  [386, 397, 'MS'],
  [400, 427, 'KY'],
  [430, 459, 'OH'],
  [460, 479, 'IN'],
  [480, 499, 'MI'],
  [500, 528, 'IA'],
  [530, 549, 'WI'],
  [550, 567, 'MN'],
  [570, 577, 'SD'],
  [580, 588, 'ND'],
  [590, 599, 'MT'],
  [600, 629, 'IL'],
  [630, 658, 'MO'],
  [660, 679, 'KS'],
  [680, 693, 'NE'],
  [700, 714, 'LA'],
  [716, 729, 'AR'],
  [733, 733, 'TX'], // Austin carve-out inside OK block
  [730, 749, 'OK'],
  [750, 799, 'TX'],
  [800, 816, 'CO'],
  [820, 831, 'WY'],
  [832, 838, 'ID'],
  [840, 847, 'UT'],
  [850, 865, 'AZ'],
  [870, 884, 'NM'],
  [885, 885, 'TX'], // El Paso
  [889, 898, 'NV'],
  [900, 961, 'CA'],
  [962, 966, 'AP'], // military
  [967, 968, 'HI'],
  [969, 969, 'GU'],
  [970, 979, 'OR'],
  [980, 994, 'WA'],
  [995, 999, 'AK'],
];

/** Prefixes that resolve somewhere but have no state Navigator config. */
const NON_STATE = new Set(['AE', 'AA', 'AP', 'GU', 'VI', 'PR']);

export function stateForZip(zip: string): string | null {
  const cleaned = zip.trim().slice(0, 5);
  if (!/^\d{5}$/.test(cleaned)) return null;
  const prefix = parseInt(cleaned.slice(0, 3), 10);
  for (const [start, end, state] of RANGES) {
    if (prefix >= start && prefix <= end) {
      return NON_STATE.has(state) ? null : state;
    }
  }
  return null;
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim().slice(0, 5)) && zip.trim().length === 5;
}
