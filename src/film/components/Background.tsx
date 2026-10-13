import { AbsoluteFill } from "remotion";
import { BACKGROUND, COLORS } from "../theme";

// Warm dark base with a wide elliptical glow (measured, verification_p2.md §4).
export const Background: React.FC = () => {
  const { centerX, centerY, radiusX, radiusY } = BACKGROUND;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgEdge,
        backgroundImage: `radial-gradient(${radiusX}px ${radiusY}px at ${centerX}px ${centerY}px, ${COLORS.bgCenter} 0%, ${COLORS.bgCenter} 18%, ${COLORS.bgMid} 45%, ${COLORS.bgEdge} 100%)`,
      }}
    />
  );
};
