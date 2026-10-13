import { Composition } from "remotion";
import { NovaPromo } from "./Composition";
import { RainorbFilm } from "./film/RainorbFilm";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./film/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NovaPromo"
        component={NovaPromo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RainorbFilm"
        component={RainorbFilm}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
