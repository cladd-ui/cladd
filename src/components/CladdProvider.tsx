import { ReactNode } from 'react';

import { Color } from '../types';
import { DialogsPortal } from './DialogsPortal';
import { DialogsPortalProvider } from './DialogsPortalContext';
import { ThemeProvider } from './ThemeContext';
import { ToastsPortal } from './ToastsPortal';
import { ToastsPortalProvider } from './ToastsPortalContext';

export interface CladdProviderProps {
  /**
   * Color scheme. Default `'dark'`.
   *
   * Read by `useTheme` and used to switch surface defaults (e.g. Popover/Dialog/Tooltip pick different `variant`, `outline`, and `surfaceLevel` per theme).
   */
  theme?: 'dark' | 'light';
  /**
   * App-wide accent color.
   *
   * Default `'brand'`.
   *
   * Read by `useAccentColor` and used as the default `color` for interactive components (Button, Switch, Checkbox, Radio, etc.).
   */
  accentColor?: Color;
  /**
   * The root element(s) to insert overlays to.
   *
   * Default `'#app, #__next, #root'`.
   */
  overlaysRoot?: string;
  /** App tree wrapped by the provider. Overlays (Dialog, Toast) are portaled outside this subtree into `overlaysRoot`. */
  children?: ReactNode;
}

export const CladdProvider = (props: CladdProviderProps) => {
  const {
    theme = 'dark',
    accentColor = 'brand',
    overlaysRoot = '#app, #__next, #root',
    children,
  } = props;

  return (
    <ThemeProvider
      theme={theme}
      accentColor={accentColor}
      overlaysRoot={overlaysRoot}
    >
      <DialogsPortalProvider>
        <ToastsPortalProvider>
          {children}
          <DialogsPortal />
          <ToastsPortal />
        </ToastsPortalProvider>
      </DialogsPortalProvider>
    </ThemeProvider>
  );
};
