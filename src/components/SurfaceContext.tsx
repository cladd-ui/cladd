import { createContext, ReactNode } from 'react';

/**
 * Tracks the surface depth of the current React subtree. Each `Surface` publishes its own
 * level (or `currentLevel - 1` for `variant="transparent"`) so nested surfaces can resolve
 * relative levels (e.g. `"+1"`/`"-1"`) and pick appropriate background tones.
 */
interface SurfaceContextValue {
  /** Current surface depth (1–5). `0` outside any `Surface`. */
  level: number;
}

interface SurfaceContextProviderProps {
  /** Surface depth published to descendants. */
  level: number;
  /** Subtree to publish the depth to. */
  children: ReactNode;
}

export const SurfaceContext = createContext<SurfaceContextValue>({
  level: 0,
});

export function SurfaceContextProvider(props: SurfaceContextProviderProps) {
  return (
    <SurfaceContext.Provider value={{ level: props.level }}>
      {props.children}
    </SurfaceContext.Provider>
  );
}
