import { createContext } from 'react';

import { Color } from '../types';

type ThemeContextValue = {
  theme: 'dark' | 'light';
  accentColor: Color;
  overlaysRoot: string;
};
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  accentColor: 'brand',
  overlaysRoot: '#app, #__next, #root',
});

/**
 * Provides `{ theme, accentColor }` to the rest of the tree via `ThemeContext`.
 * Most apps use `UIProvider` instead, which wraps this together with the dialog/toast portals.
 *
 * Components read these values via `useTheme()` and `useAccentColor()` to pick:
 * - per-theme defaults (Dialog/Popover/Tooltip variant, outline, surfaceLevel),
 * - the default `color` for interactive components (Button/Switch/Checkbox/Radio default to `accentColor`).
 */
export const ThemeProvider = ({
  children,
  theme,
  accentColor,
  overlaysRoot,
}: {
  children: React.ReactNode;
  /** Color scheme to expose to descendants. */
  theme: 'dark' | 'light';
  /** App-wide accent color token used as the default for interactive components. */
  accentColor: string;
  /** The root element(s) to insert overlays to. Default `'#app, #__next, #root'`. */
  overlaysRoot?: string;
}) => {
  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        overlaysRoot: overlaysRoot ?? '#app, #__next, #root',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
