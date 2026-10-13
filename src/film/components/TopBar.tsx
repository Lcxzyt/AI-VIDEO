import { Easing, interpolate } from "remotion";
import { counterState } from "../counter";
import { COUNTER_MOVE, COUNTER_MOVE_REST } from "../data/counterMove";
import { FONTS } from "../fonts";
import { COLORS, TITLE_WINDOWS, TOP_BAR } from "../theme";
import { FrameCounter } from "./FrameCounter";

const inWin = (f: number, w: { from: number; to: number }) => f >= w.from && f < w.to;

// The top bar is a GLOBAL layer: it receives the global frame explicitly and
// must be mounted outside every scene <Sequence>.
export const TopBar: React.FC<{ globalFrame: number }> = ({ globalFrame: f }) => {
  const counter = counterState(f);

  // Title: slides up from y+5 over [701,708) (measured ink y 67→47).
  let titleOpacity = 0;
  let titleDy = 0;
  if (inWin(f, TITLE_WINDOWS.slideIn)) {
    const t = interpolate(f, [TITLE_WINDOWS.slideIn.from, TITLE_WINDOWS.slideIn.to - 1], [0, 1], {
      easing: Easing.out(Easing.cubic),
    });
    titleOpacity = 1;
    titleDy = (1 - t) * 20;
  } else if (inWin(f, TITLE_WINDOWS.shown) || inWin(f, TITLE_WINDOWS.shownEnd)) {
    titleOpacity = 1;
  }

  const t = TOP_BAR.title;
  const lg = TOP_BAR.logo;
  const bb = TOP_BAR.bilibili;
  return (
    <>
      {/* Logo: visible for the whole film. */}
      <div
        style={{
          position: "absolute",
          left: lg.x,
          top: lg.baselineY - lg.fontSize,
          fontFamily: FONTS.sans,
          fontWeight: 700,
          fontSize: lg.fontSize,
          lineHeight: `${lg.fontSize}px`,
          color: COLORS.logo,
          whiteSpace: "pre",
        }}
      >
        雨落星环Rainorb
      </div>
      {/* TEMP: the bilibili wordmark is a bitmap logotype; text stand-in until a traced SVG exists. */}
      <div
        style={{
          position: "absolute",
          left: bb.x,
          top: bb.y,
          width: bb.width,
          height: bb.height,
          fontFamily: FONTS.sans,
          fontWeight: 700,
          fontSize: 28,
          lineHeight: `${bb.height}px`,
          color: COLORS.logo,
          letterSpacing: -1,
        }}
      >
        bilibili
      </div>
      {titleOpacity > 0 ? (
        <div style={{ position: "absolute", left: 0, top: titleDy, opacity: titleOpacity }}>
          <div
            style={{
              position: "absolute",
              left: t.x,
              top: t.baselineY - t.fontSize,
              fontFamily: FONTS.serif,
              fontSize: t.fontSize,
              lineHeight: `${t.fontSize}px`,
              color: COLORS.title,
              whiteSpace: "pre",
            }}
          >
            {t.text}
          </div>
          <div
            style={{
              position: "absolute",
              left: TOP_BAR.titleCursor.x,
              top: TOP_BAR.titleCursor.y,
              width: TOP_BAR.titleCursor.width,
              height: TOP_BAR.titleCursor.height,
              backgroundColor: COLORS.titleCursor,
            }}
          />
        </div>
      ) : null}
      {counter.kind === "count" || counter.kind === "rewind" ? (
        <FrameCounter value={counter.value} />
      ) : null}
      {counter.kind === "moving" ? <MovingCounter globalFrame={f} value={counter.value} /> : null}
    </>
  );
};

// Follows the measured ink bbox keyframes over [4033, 4059).
const MovingCounter: React.FC<{ globalFrame: number; value: number }> = ({ globalFrame, value }) => {
  const frames = COUNTER_MOVE.map((k) => k[0]);
  const at = (i: number) =>
    interpolate(globalFrame, frames, COUNTER_MOVE.map((k) => k[i]), {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const r = COUNTER_MOVE_REST;
  const scale = at(3) / r.width;
  return (
    <FrameCounter
      value={value}
      dx={at(1) - r.left}
      dy={at(2) - r.top}
      scale={scale}
      opacity={at(4) / r.lum}
    />
  );
};
