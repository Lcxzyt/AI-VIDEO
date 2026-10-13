import { formatCounter } from "../counter";
import { FONTS } from "../fonts";
import { COLORS, TOP_BAR } from "../theme";

// Measured left ink edges (frame 1000) of each suffix glyph group.
const SUFFIX: readonly [string, number, boolean][] = [
  ["帧", 1040, false],
  ["/", 1071, true],
  ["共", 1095, false],
  ["4410", 1127, true],
  ["帧", 1188, false],
];

type Props = {
  value: number;
  /** Translation and scale applied around the counter's left edge. */
  dx?: number;
  dy?: number;
  scale?: number;
  opacity?: number;
};

// "第 NNNN 帧 / 共 4410 帧" laid out on the measured x positions.
export const FrameCounter: React.FC<Props> = ({ value, dx = 0, dy = 0, scale = 1, opacity = 1 }) => {
  const c = TOP_BAR.counter;
  const top = c.baselineY - c.fontSize;
  const label: React.CSSProperties = {
    position: "absolute",
    top: 0,
    fontFamily: FONTS.sans,
    fontSize: c.fontSize,
    lineHeight: `${c.fontSize}px`,
    whiteSpace: "pre",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: c.labelX,
        top,
        width: 1205 - c.labelX,
        height: c.fontSize + 4,
        opacity,
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        transformOrigin: "0 0",
      }}
    >
      <span style={{ ...label, left: 0, color: COLORS.counterLabel }}>第</span>
      <span
        style={{
          ...label,
          left: c.digitsX - c.labelX,
          color: COLORS.counterDigits,
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: c.digitFontSize,
          letterSpacing: c.digitAdvance - c.digitFontSize * 0.6,
        }}
      >
        {formatCounter(value)}
      </span>
      {SUFFIX.map(([text, x, mono]) => (
        <span
          key={x}
          style={{
            ...label,
            left: x - c.labelX,
            color: COLORS.counterTotal,
            fontFamily: mono ? FONTS.mono : FONTS.sans,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};
