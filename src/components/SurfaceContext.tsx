import { createContext, ReactNode, useContext } from 'react';

import { Color } from '../types';

/**
 * Tracks the surface depth of the current React subtree. Each `Surface` publishes its own
 * level (or `currentLevel - 1` for `variant="transparent"`) so nested surfaces can resolve
 * relative levels (e.g. `"+1"`/`"-1"`) and pick appropriate background tones.
 */
interface SurfaceContextValue {
  /** Current surface depth (1–5). `0` outside any `Surface`. */
  level: number;
  /**
   * Accent color of the nearest enclosing colored surface, mirroring the
   * `cladd-color-{name}` CSS cascade so descendants can read the region color in
   * JS (e.g. `Segmented` picks its active color from it). `''` when no surface up
   * the tree set a color.
   */
  color: Color;
}

interface SurfaceContextProviderProps {
  /** Surface depth published to descendants. */
  level: number;
  /** Region color published to descendants. Defaults to `''` (no region color). */
  color?: Color;
  /** Subtree to publish the values to. */
  children: ReactNode;
}

export const SurfaceContext = createContext<SurfaceContextValue>({
  level: 0,
  color: '',
});

export function SurfaceContextProvider(props: SurfaceContextProviderProps) {
  return (
    <SurfaceContext.Provider
      value={{ level: props.level, color: props.color ?? '' }}
    >
      {props.children}
    </SurfaceContext.Provider>
  );
}

/**
 * Resets the region `color` to `''` while preserving the surface `level`, for use at
 * portal boundaries. React context crosses portals but the `cladd-color-{name}` CSS
 * cascade does not — without this, a portaled overlay would inherit a colored
 * ancestor's region color through context while its DOM renders neutral.
 */
export function SurfaceColorReset(props: { children: ReactNode }) {
  const { level } = useContext(SurfaceContext);
  return (
    <SurfaceContext.Provider value={{ level, color: '' }}>
      {props.children}
    </SurfaceContext.Provider>
  );
}
