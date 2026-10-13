import { Composition } from "remotion";
import { NovaPromo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NovaPromo"
      component={NovaPromo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
