import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FeatureCard } from "./FeatureCard";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.22, 1, 0.36, 1);

const OpeningLine = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(
          frame,
          [0, 0.15 * fps, 3.5 * fps, 4 * fps],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      <div
        style={{
          width: 1080,
          height: 3,
          borderRadius: 99,
          background:
            "linear-gradient(90deg, transparent, #3987ff 18%, #b9e6ff 50%, #7066ff 82%, transparent)",
          boxShadow: "0 0 14px #468cff, 0 0 45px #466bff, 0 0 100px #335dff",
          scale: `${interpolate(frame, [0, 1.8 * fps], [0, 1], { ...clamp, easing: smooth })} 1`,
          translate: `0 ${interpolate(frame, [2 * fps, 3.8 * fps], [0, 52], { ...clamp, easing: smooth })}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const ClosingTagline = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 918,
        width: "100%",
        textAlign: "center",
        fontSize: 54,
        fontWeight: 400,
        letterSpacing: 2,
        color: "#edf0ff",
        opacity: interpolate(frame, [0, 0.18 * fps], [0, 1], clamp),
        translate: `0 ${interpolate(spring({ frame, fps, config: { damping: 22, stiffness: 130 } }), [0, 1], [18, 0])}px`,
        filter: `blur(${interpolate(frame, [0, 0.2 * fps], [8, 0], clamp)}px)`,
      }}
    >
      Beyond Imagination
    </div>
  );
};

// The same title and cards form the final interface in one continuous reveal.
export const NovaPromo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const titleSpring = spring({
    frame: frame - 2 * fps,
    fps,
    config: { damping: 22, stiffness: 100, mass: 1.1 },
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030409",
        color: "white",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: interpolate(
            frame,
            [0, 2 * fps, 4 * fps],
            [0.12, 0.5, 1],
            clamp,
          ),
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1300,
            height: 900,
            left: 30,
            top: 50,
            background:
              "radial-gradient(ellipse, rgba(22,72,204,0.24), transparent 68%)",
            translate: `${interpolate(frame, [0, 10 * fps], [0, 100], clamp)}px 0`,
            filter: "blur(65px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 1200,
            height: 950,
            right: -100,
            top: 100,
            background:
              "radial-gradient(ellipse, rgba(104,41,214,0.23), transparent 65%)",
            translate: `${interpolate(frame, [0, 10 * fps], [0, -90], clamp)}px 0`,
            filter: "blur(65px)",
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(rgba(158,175,245,0.16) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            opacity: 0.3,
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 65%)",
          }}
        />
      </AbsoluteFill>
      <Sequence
        name="01 · Luminous line"
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <OpeningLine />
      </Sequence>
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [7 * fps, 9 * fps], [1, 0.86], {
            ...clamp,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            output: "perceptual-scale",
          }),
          transformOrigin: "960px 520px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 205,
            width: 1500,
            height: 660,
            borderRadius: 30,
            border: "1px solid rgba(145,166,255,0.24)",
            background:
              "linear-gradient(140deg, rgba(39,56,102,0.25), rgba(11,14,28,0.62) 55%, rgba(65,31,115,0.2))",
            boxShadow:
              "0 45px 100px #0008, inset 0 1px 0 #c4d7ff14, 0 0 70px #6551f510",
            opacity: interpolate(frame, [7 * fps, 8 * fps], [0, 1], {
              ...clamp,
              easing: smooth,
            }),
            scale: interpolate(frame, [7 * fps, 8.5 * fps], [1.04, 1], {
              ...clamp,
              easing: smooth,
            }),
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 123,
              left: 44,
              right: 44,
              height: 1,
              background: "linear-gradient(90deg, #7b9cff30, #7b9cff10)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 68,
              right: 60,
              display: "flex",
              gap: 40,
              fontSize: 23,
              color: "#818aa6",
            }}
          >
            <span style={{ color: "#e4e9ff" }}>Overview</span>
            <span>Intelligence</span>
            <span>Activity</span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 30,
              left: 60,
              right: 60,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              letterSpacing: 2,
              color: "#828fae",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#79e9d4",
                  boxShadow: "0 0 12px #79e9d4",
                  marginRight: 13,
                }}
              />
              ALL SYSTEMS CONNECTED
            </span>
            <span>NOVA OS / 01</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 720,
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            translate: `${interpolate(frame, [7 * fps, 9 * fps], [600, 25], { ...clamp, easing: smooth })}px ${interpolate(frame, [3.5 * fps, 4.5 * fps], [330, 165], { ...clamp, easing: smooth })}px`,
            scale:
              interpolate(
                frame,
                [3.5 * fps, 4.5 * fps, 7 * fps, 9 * fps],
                [1, 0.55, 0.55, 0.36],
                { ...clamp, easing: smooth },
              ) * interpolate(titleSpring, [0, 1], [0.86, 1]),
            opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], clamp),
            filter: `blur(${interpolate(frame, [2 * fps, 2.85 * fps], [22, 0], { ...clamp, easing: smooth })}px)`,
          }}
        >
          <span
            style={{
              fontSize: 210,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: 22,
              paddingLeft: 22,
              background:
                "linear-gradient(115deg, #ffffff 20%, #c0d9ff 60%, #a699ff)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 75px #679bff30",
            }}
          >
            NOVA
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 407,
            left: 270,
            width: 1380,
            height: 375,
            translate: `0 ${interpolate(frame, [7 * fps, 9 * fps], [0, -34], { ...clamp, easing: smooth })}px`,
          }}
        >
          <Sequence
            name="03 · Intelligence / left"
            from={4 * fps}
            premountFor={fps}
          >
            <FeatureCard
              title="Intelligence"
              subtitle="Ideas, amplified."
              kind="intelligence"
              accent="#79aaff"
              left={0}
              direction="left"
            />
          </Sequence>
          <Sequence
            name="04 · Performance / below"
            from={4.6 * fps}
            premountFor={fps}
          >
            <FeatureCard
              title="Performance"
              subtitle="Built for your flow."
              kind="performance"
              accent="#a192ff"
              left={470}
              direction="bottom"
            />
          </Sequence>
          <Sequence
            name="05 · Security / right"
            from={5.2 * fps}
            premountFor={fps}
          >
            <FeatureCard
              title="Security"
              subtitle="Confidence, by design."
              kind="security"
              accent="#81dce8"
              left={940}
              direction="right"
            />
          </Sequence>
        </div>
      </AbsoluteFill>
      <Sequence name="07 · Beyond Imagination" from={9 * fps} premountFor={fps}>
        <ClosingTagline />
      </Sequence>
      <AbsoluteFill
        style={{
          backgroundColor: "#030409",
          pointerEvents: "none",
          opacity: interpolate(
            frame,
            [9.55 * fps, durationInFrames - 1],
            [0, 1],
            { ...clamp, easing: Easing.inOut(Easing.quad) },
          ),
        }}
      />
    </AbsoluteFill>
  );
};
