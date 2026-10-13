// Fonts via @remotion/google-fonts. Provisional choice (P2): to be compared
// against reference keyframes and possibly replaced in later phases.
import { loadFont as loadNotoSansMono } from "@remotion/google-fonts/NotoSansMono";
import { loadFont as loadNotoSansSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadNotoSerifSC } from "@remotion/google-fonts/NotoSerifSC";

// CJK fonts are split into many unicode-range files; only the slices that the
// rendered text actually uses are downloaded by the browser.
const serif = loadNotoSerifSC("normal", {
  weights: ["400"],
  subsets: ["chinese-simplified", "latin"],
  ignoreTooManyRequestsWarning: true,
});
const sans = loadNotoSansSC("normal", {
  weights: ["400", "500", "700"],
  subsets: ["chinese-simplified", "latin"],
  ignoreTooManyRequestsWarning: true,
});
const mono = loadNotoSansMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  serif: `"${serif.fontFamily}", serif`,
  sans: `"${sans.fontFamily}", sans-serif`,
  mono: `"${mono.fontFamily}", monospace`,
} as const;
