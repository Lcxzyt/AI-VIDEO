import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type FeatureKind = "intelligence" | "performance" | "security";
type FeatureCardProps = {
  title: string;
  subtitle: string;
  accent: string;
  kind: FeatureKind;
  left: number;
  direction: "left" | "bottom" | "right";
};

// Original SVG artwork; no downloaded or remotely loaded assets.
const FeatureGlyph = ({
  kind,
  accent,
  frame,
}: {
  kind: FeatureKind;
  accent: string;
  frame: number;
}) => {
  const common: CSSProperties = {
    width: 160,
    height: 160,
    overflow: "visible",
    filter: `drop-shadow(0 0 15px ${accent}66)`,
  };
  if (kind === "intelligence") {
    return (
      <svg viewBox="0 0 160 160" style={common} fill="none">
        <g
          style={{ rotate: `${frame * 0.18}deg`, transformOrigin: "80px 80px" }}
        >
          <ellipse
            cx="80"
            cy="80"
            rx="65"
            ry="26"
            stroke={accent}
            strokeWidth="1.8"
          />
          <ellipse
            cx="80"
            cy="80"
            rx="65"
            ry="26"
            stroke={accent}
            strokeWidth="1.8"
            transform="rotate(60 80 80)"
          />
          <ellipse
            cx="80"
            cy="80"
            rx="65"
            ry="26"
            stroke={accent}
            strokeWidth="1.8"
            transform="rotate(120 80 80)"
          />
          <circle cx="145" cy="80" r="4" fill="#eaf3ff" />
        </g>
        <circle cx="80" cy="80" r="9" fill="#d8eaff" />
        <circle cx="80" cy="80" r="17" stroke={accent} opacity="0.3" />
      </svg>
    );
  }
  if (kind === "performance") {
    return (
      <svg viewBox="0 0 160 160" style={common} fill="none">
        <rect
          x="10"
          y="20"
          width="140"
          height="120"
          rx="18"
          stroke={accent}
          opacity="0.22"
        />
        {[0, 1, 2].map((row) => (
          <path
            key={row}
            d={`M 24 ${50 + row * 30} H 136`}
            stroke={accent}
            opacity="0.12"
          />
        ))}
        <path
          d="M24 98 L47 98 L62 63 L81 115 L103 43 L119 78 L136 78"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="103" cy="43" r="5" fill="#e7e0ff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 160" style={common} fill="none">
      <path
        d="M80 14 L131 34 V78 C131 110 109 133 80 148 C51 133 29 110 29 78 V34 Z"
        stroke={accent}
        strokeWidth="2"
        fill={`${accent}08`}
      />
      <path
        d="M80 28 L118 43 V78 C118 102 102 121 80 133 C58 121 42 102 42 78 V43 Z"
        stroke={accent}
        opacity="0.22"
      />
      <path
        d="M59 80 L74 95 L103 64"
        stroke="#d9fbff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const FeatureCard = ({
  title,
  subtitle,
  accent,
  kind,
  left,
  direction,
}: FeatureCardProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({
    frame,
    fps,
    config: { damping: 19, stiffness: 105, mass: 1.1 },
  });
  const startX = direction === "left" ? -760 : direction === "right" ? 760 : 0;
  const startY = direction === "bottom" ? 620 : 40;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 0,
        width: 440,
        height: 375,
        boxSizing: "border-box",
        borderRadius: 25,
        padding: "30px 34px",
        background: `linear-gradient(145deg, ${accent}19, rgba(20,25,43,0.75) 44%, rgba(16,18,34,0.88))`,
        border: `1px solid ${accent}40`,
        backdropFilter: "blur(24px)",
        boxShadow: `inset 0 1px 0 ${accent}22, 0 25px 70px #0005, 0 0 35px ${accent}08`,
        translate: `${interpolate(reveal, [0, 1], [startX, 0])}px ${interpolate(reveal, [0, 1], [startY, 0])}px`,
        scale: interpolate(reveal, [0, 1], [0.92, 1]),
        opacity: interpolate(frame, [0, 0.35 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 24,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <div
        style={{
          height: 194,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FeatureGlyph kind={kind} accent={accent} frame={frame} />
      </div>
      <div
        style={{
          width: 32,
          height: 2,
          background: accent,
          marginBottom: 18,
          boxShadow: `0 0 12px ${accent}88`,
        }}
      />
      <div
        style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: -0.5,
          marginBottom: 12,
          color: "#eef1ff",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 23, color: "#9faac6", letterSpacing: 0.2 }}>
        {subtitle}
      </div>
    </div>
  );
};
