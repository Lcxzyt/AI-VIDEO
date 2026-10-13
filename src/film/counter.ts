// Top-bar frame counter state as a pure function of the GLOBAL frame.
// Evidence: reference/analysis/counter_reference.tsv, verification_p2.md §2.
import { COUNTER_REWIND, COUNTER_REWIND_FROM } from "./data/counterRewind";
import { TOTAL_FRAMES, isGlobalFrame } from "./timeline";

/** All intervals half-open [from, to), global frames. */
export const COUNTER_PHASES = {
  countUp: { from: 0, to: 3745 },
  rewind: { from: COUNTER_REWIND_FROM, to: COUNTER_REWIND_FROM + COUNTER_REWIND.length },
  // Slides to the upper left and shrinks with the content (data/counterMove.ts),
  // still showing the last rewind value; vanishes at 4059.
  moving: { from: 4033, to: 4059 },
  hidden: { from: 4059, to: 4320 },
  countUpEnd: { from: 4320, to: TOTAL_FRAMES },
} as const;

export type CounterState =
  | { kind: "count"; value: number }
  | { kind: "rewind"; value: number }
  | { kind: "moving"; value: number }
  | { kind: "hidden" };

const inRange = (f: number, r: { from: number; to: number }) =>
  f >= r.from && f < r.to;

export const counterState = (globalFrame: number): CounterState => {
  if (!isGlobalFrame(globalFrame)) {
    throw new RangeError(`Global frame ${globalFrame} outside [0, ${TOTAL_FRAMES})`);
  }
  const p = COUNTER_PHASES;
  if (inRange(globalFrame, p.countUp) || inRange(globalFrame, p.countUpEnd)) {
    return { kind: "count", value: globalFrame + 1 };
  }
  if (inRange(globalFrame, p.rewind)) {
    return { kind: "rewind", value: COUNTER_REWIND[globalFrame - p.rewind.from] };
  }
  if (inRange(globalFrame, p.moving)) {
    return {
      kind: "moving",
      value: COUNTER_REWIND[COUNTER_REWIND.length - 1],
    };
  }
  return { kind: "hidden" };
};

/** Displayed number, or null when the counter is not legible. */
export const counterValue = (globalFrame: number): number | null => {
  const s = counterState(globalFrame);
  return s.kind === "count" || s.kind === "rewind" ? s.value : null;
};

// tsconfig lib is es2015, so no String.prototype.padStart.
export const formatCounter = (value: number): string =>
  ("0000" + String(value)).slice(-4);
