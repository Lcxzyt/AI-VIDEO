import { useCurrentFrame } from "remotion";

/**
 * Global frame of the film. Only valid in components mounted at the ROOT of
 * RainorbFilm (outside every <Sequence>), where useCurrentFrame() is not
 * offset. Inside a scene, use useCurrentFrame() (local) or pass the global
 * frame down explicitly.
 */
export const useGlobalFrame = (): number => useCurrentFrame();
