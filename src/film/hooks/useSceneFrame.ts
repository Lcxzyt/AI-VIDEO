import { useCurrentFrame } from "remotion";
import { getScene, type SceneId } from "../timeline";

/**
 * For components rendered inside the <Sequence> of scene `id`: returns the
 * local frame (0 at scene.from) and the corresponding global frame.
 */
export const useSceneFrame = (id: SceneId) => {
  const local = useCurrentFrame();
  return { local, global: local + getScene(id).from };
};
