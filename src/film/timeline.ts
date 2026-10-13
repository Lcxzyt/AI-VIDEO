// Single source of truth for RainorbFilm timing.
//
// Every interval in this file is HALF-OPEN: [from, to) — `from` is the first
// global frame a scene renders, `to` is the first global frame it no longer
// renders. Duration = to - from. Global frames run 0..TOTAL_FRAMES-1.
//
// Scenes are logical segments of the replica, not cuts in the reference (the
// reference has no hard cuts at scene boundaries, see
// reference/analysis/verification_p2.md §1). Overlaps are where two scenes
// render simultaneously during a morph; the later scene (higher `layer`) is
// drawn on top.

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;
export const TOTAL_FRAMES = 4410;

export type SceneId =
  | "S01"
  | "S02"
  | "S03"
  | "S04"
  | "S05"
  | "S06"
  | "S07"
  | "S08"
  | "S09"
  | "S10"
  | "S11"
  | "S12"
  | "S13"
  | "S14"
  | "S15";

export type Scene = {
  readonly id: SceneId;
  readonly name: string;
  /** First global frame (inclusive). */
  readonly from: number;
  /** First global frame after the scene (exclusive). */
  readonly to: number;
  /** Paint order; higher is drawn later (on top). */
  readonly layer: number;
  /** Measured evidence for the boundaries (global frames). */
  readonly evidence: string;
};

// Boundaries are taken from reference/analysis/motion_diff.txt (d = diff of
// frame n vs n-1) and the counter OCR. Ordered by `from`.
export const SCENES: readonly Scene[] = [
  { id: "S01", name: "ChatAsk", from: 0, to: 128, layer: 1, evidence: "send morph 117–127" },
  { id: "S02", name: "ChatReply", from: 117, to: 286, layer: 2, evidence: "fade-out 275–285 (d peak 1.13 @283)" },
  { id: "S03", name: "Manifesto", from: 275, to: 523, layer: 3, evidence: "exit 506–522, settles @523 (d 0.03)" },
  { id: "S04", name: "TitleCard", from: 506, to: 722, layer: 4, evidence: "jump @519; title→top bar 684–707" },
  { id: "S05", name: "FiveSteps", from: 721, to: 1024, layer: 5, evidence: "activity starts @721 (d 0.40)" },
  { id: "S06", name: "MusicMap", from: 1013, to: 1328, layer: 6, evidence: "collapse 1013–1025" },
  { id: "S07", name: "CodeWrite", from: 1316, to: 1591, layer: 7, evidence: "instant switch @1585 (d 5.05)" },
  { id: "S08", name: "SceneMontage", from: 1585, to: 2067, layer: 8, evidence: "starts with the 1585 switch; split 2017–2066" },
  { id: "S09", name: "CloneSplit", from: 2017, to: 2536, layer: 9, evidence: "split starts @2017 (d 5.19)" },
  { id: "S10", name: "ComposeCards", from: 2536, to: 3025, layer: 10, evidence: "card settles ~2536" },
  { id: "S11", name: "PreviewPlay", from: 3025, to: 3196, layer: 11, evidence: "jump @3025 (d 1.62)" },
  { id: "S12", name: "ReviewTimeline", from: 3196, to: 3745, layer: 12, evidence: "counter freezes @3745" },
  { id: "S13", name: "Rewind", from: 3745, to: 4047, layer: 13, evidence: "counter 3744 @3745; content shrink 4033–4058" },
  { id: "S14", name: "PixelTitle", from: 4033, to: 4332, layer: 14, evidence: "shrink-in from 4033; switch @4320" },
  { id: "S15", name: "ChatOutro", from: 4320, to: TOTAL_FRAMES, layer: 15, evidence: "counter resumes f+1 @4320" },
];

export const durationOf = (s: Pick<Scene, "from" | "to">): number =>
  s.to - s.from;

export const getScene = (id: SceneId): Scene => {
  for (const s of SCENES) {
    if (s.id === id) {
      return s;
    }
  }
  throw new Error(`Unknown scene ${id}`);
};

export const isGlobalFrame = (frame: number): boolean =>
  Number.isInteger(frame) && frame >= 0 && frame < TOTAL_FRAMES;

/** Scenes that render at a global frame, in paint order (bottom first). */
export const scenesAt = (frame: number): Scene[] => {
  if (!isGlobalFrame(frame)) {
    throw new RangeError(`Global frame ${frame} outside [0, ${TOTAL_FRAMES})`);
  }
  return SCENES.filter((s) => frame >= s.from && frame < s.to).sort(
    (a, b) => a.layer - b.layer,
  );
};

/** Converts a global frame into a scene's local frame (0 at scene.from). */
export const toLocal = (id: SceneId, globalFrame: number): number =>
  globalFrame - getScene(id).from;

/** Converts a scene's local frame back into a global frame. */
export const toGlobal = (id: SceneId, localFrame: number): number =>
  localFrame + getScene(id).from;

/** Overlap windows between consecutive scenes, half-open. */
export const overlaps = (): { a: SceneId; b: SceneId; from: number; to: number }[] => {
  const out: { a: SceneId; b: SceneId; from: number; to: number }[] = [];
  for (let i = 1; i < SCENES.length; i++) {
    const a = SCENES[i - 1];
    const b = SCENES[i];
    if (b.from < a.to) {
      out.push({ a: a.id, b: b.id, from: b.from, to: a.to });
    }
  }
  return out;
};
