// Counter ink bbox while it leaves the top bar, global frames [4033, 4059).
// Measured with scripts/analysis/col_profile.py (lum > 45). At rest (≤4032) the
// ink is x 948–1205 (width 257), top y 44, max lum 231. It vanishes at 4059.
// [frame, inkLeft, inkTop, inkWidth, maxLum]
export const COUNTER_MOVE_REST = { left: 948, top: 44, width: 257, lum: 231 } as const;
export const COUNTER_MOVE: readonly (readonly [number, number, number, number, number])[] = [
  [4033, 941, 51, 252, 234],
  [4038, 939, 51, 251, 233],
  [4042, 930, 54, 248, 227],
  [4044, 919, 55, 246, 227],
  [4046, 899, 56, 242, 217],
  [4048, 868, 56, 237, 210],
  [4050, 822, 54, 231, 207],
  [4052, 756, 51, 223, 206],
  [4054, 668, 44, 213, 181],
  [4056, 552, 33, 204, 180],
  [4057, 484, 27, 199, 173],
  [4058, 409, 18, 193, 164],
];
