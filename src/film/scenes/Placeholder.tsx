import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONTS } from "../fonts";
import { durationOf, type Scene } from "../timeline";

// TEMP TEST VISUAL — NOT A REPLICATION. Shows which scene renders, with its
// local and global frame, so the timeline can be scrubbed in Studio before
// the real scenes exist. Overlapping scenes stack their cards vertically.
export const Placeholder: React.FC<{ scene: Scene }> = ({ scene }) => {
  const local = useCurrentFrame();
  const global = local + scene.from;
  const slot = scene.layer % 2; // alternate rows so overlaps stay readable
  const progress = local / Math.max(1, durationOf(scene) - 1);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 240 + slot * 170,
          width: 800,
          height: 150,
          border: "3px dashed #ff00ff",
          backgroundColor: "rgba(255, 0, 255, 0.08)",
          color: "#ff66ff",
          fontFamily: FONTS.mono,
          padding: "14px 20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700 }}>TEMP — NOT REPLICATED</div>
        <div style={{ fontSize: 28, marginTop: 6 }}>
          {scene.id} {scene.name}  [{scene.from}, {scene.to})
        </div>
        <div style={{ fontSize: 20, marginTop: 6 }}>
          local {local} / global {global}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 6,
            width: `${progress * 100}%`,
            backgroundColor: "#ff00ff",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
