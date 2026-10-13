// Visual tokens. Values marked "measured" are pixel samples from
// reference.mp4 (scripts/analysis/sample_pixels.py, col_profile.py);
// values marked "est." are still eyeballed and need checking in later phases.

export const COLORS = {
  bgEdge: "#14120e", // measured, corners
  bgMid: "#1b1613", // measured, x320/y100
  bgCenter: "#1d1815", // measured, ~(560–680, 240–360)
  logo: "#e2e0dc", // measured
  title: "#c1bcb5", // measured, top-bar title
  titleCursor: "#9f735e", // measured
  counterLabel: "#a49d98", // measured, "第"
  counterDigits: "#ffffff", // measured
  counterTotal: "#a9a49f", // measured, "帧 / 共 4410 帧"
  accent: "#e0785a", // est.
  text: "#ece4da", // est.
  textMuted: "#8a7a70", // est.
} as const;

// Background radial glow: ellipse centred slightly above mid-height.
export const BACKGROUND = {
  centerX: 640,
  centerY: 300,
  radiusX: 820,
  radiusY: 470,
} as const;

// Top bar geometry, global pixel coordinates (1280×720), measured at frame 1000.
export const TOP_BAR = {
  logo: {
    // "雨落星环" ink spans x 24–123, y 37–62; "Rainorb" x 127–229.
    x: 24,
    baselineY: 58,
    fontSize: 24,
  },
  bilibili: { x: 233, y: 24, width: 94, height: 41 }, // measured ink bbox
  title: {
    // Final ink bbox x 521–746, y 47–65; slides in over global [701, 708).
    x: 521,
    baselineY: 62,
    fontSize: 18,
    text: "一句话，怎么变成一条视频？",
  },
  titleCursor: { x: 758, y: 52, width: 2, height: 12 }, // measured, does not blink
  counter: {
    // "第" x 948–965; digits x 980–1025 (12 px advance); "帧" x 1040–1057;
    // "/" ~1072–1080; "共" 1095–1113; "4410" 1128–1172; "帧" 1188–1205.
    labelX: 948,
    digitsX: 980,
    digitAdvance: 12,
    baselineY: 61,
    fontSize: 18,
    digitFontSize: 20,
  },
} as const;

// Top-bar title visibility, global frames, half-open.
export const TITLE_WINDOWS = {
  slideIn: { from: 701, to: 708 }, // rises from y≈67 into place
  shown: { from: 708, to: 3926 }, // disappears instantly at 3926
  // Note: ink seen in the title area at 4050–4058 is the moving COUNTER, not the title.
  shownEnd: { from: 4320, to: 4410 },
} as const;
