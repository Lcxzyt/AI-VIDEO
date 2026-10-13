// Music grid. Tempo is measured (100 BPM → 18 frames per beat, 245 beats in
// 147 s). The PHASE IS NOT CONFIRMED: audio onset folding peaks at ≈3.2 frames
// (secondary 2.2), while visual beat hits disagree with each other (1441 mod 18
// = 1, 1472…1562 mod 18 = 14, 2592 mod 18 = 0). Scenes must align to their own
// measured hit frames; use these helpers only for spacing, not absolute timing.
// See reference/analysis/verification_p2.md §5.
import { FPS } from "./timeline";

export const BPM = 100;
export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 18
export const TOTAL_BEATS = 245;

/** Provisional, unconfirmed beat phase in frames. */
export const BEAT_PHASE_PROVISIONAL = 3;

/** Global frame of beat n relative to an anchor hit frame. */
export const beatFrame = (n: number, anchorFrame: number): number =>
  anchorFrame + n * FRAMES_PER_BEAT;

/** Frames since the most recent beat at or before `frame` (0..17). */
export const framesSinceBeat = (frame: number, anchorFrame: number): number => {
  const d = (frame - anchorFrame) % FRAMES_PER_BEAT;
  return d < 0 ? d + FRAMES_PER_BEAT : d;
};

/** Measured sections where picture changes lock to the beat (global, half-open). */
export const BEAT_LOCKED_SECTIONS = [
  { from: 1441, to: 1586, anchor: 1441, note: "S07 code pulses; 1472…1562 suggest anchor ≡14 mod 18" },
  { from: 2592, to: 2730, anchor: 2592, note: "S10 card flips" },
] as const;
