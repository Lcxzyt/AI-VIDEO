import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { TopBar } from "./components/TopBar";
import { useGlobalFrame } from "./hooks/useGlobalFrame";
import { Placeholder } from "./scenes/Placeholder";
import { SCENES, durationOf } from "./timeline";

// Layer order (bottom → top):
//   1. Background                         global
//   2. Scenes, sorted by `layer`          local frames inside each <Sequence>
//   3. TopBar (logo, title, counter)      global
// No <Audio>: the reference soundtrack is not embedded until usage rights are
// confirmed.
export const RainorbFilm: React.FC = () => {
  const globalFrame = useGlobalFrame();
  const ordered = [...SCENES].sort((a, b) => a.layer - b.layer);
  return (
    <AbsoluteFill>
      <Background />
      {ordered.map((scene) => (
        <Sequence
          key={scene.id}
          name={`${scene.id} ${scene.name} (TEMP)`}
          from={scene.from}
          durationInFrames={durationOf(scene)}
        >
          <Placeholder scene={scene} />
        </Sequence>
      ))}
      <TopBar globalFrame={globalFrame} />
    </AbsoluteFill>
  );
};
