import { createContext, ReactNode } from 'react';

import { Color } from '../types';
import type { ButtonDefaultProps } from './Button';
import type { CheckboxDefaultProps } from './Checkbox';
import type { ChipDefaultProps } from './Chip';
import type { InputDefaultProps } from './Input';
import type { LinkDefaultProps } from './Link';
import type { NumberFieldDefaultProps } from './NumberField';
import type { NumberScrubberDefaultProps } from './NumberScrubber';
import type { OTPFieldDefaultProps } from './OTPField';
import type { OTPFieldInputDefaultProps } from './OTPFieldInput';
import type { OTPFieldSeparatorDefaultProps } from './OTPFieldSeparator';
import type { RadioDefaultProps } from './Radio';
import type { SearchFieldDefaultProps } from './SearchField';
import type { SelectDefaultProps } from './Select';
import type { ShortcutDefaultProps } from './Shortcut';
import type { SliderDefaultProps } from './Slider';
import type { SpinnerDefaultProps } from './Spinner';
import type { SwitchDefaultProps } from './Switch';
import type { TextareaDefaultProps } from './Textarea';

/**
 * Registry of per-component default props that can be supplied to
 * `CladdProvider` via the `defaults` prop.
 *
 * Each entry is `Partial<ComponentProps>` (with polymorphic and per-instance
 * props excluded — see each component's `*DefaultProps` type).
 *
 * Add new entries here as additional components opt into context defaults.
 */
export interface ComponentDefaults {
  Button?: ButtonDefaultProps;
  Checkbox?: CheckboxDefaultProps;
  Chip?: ChipDefaultProps;
  Input?: InputDefaultProps;
  Link?: LinkDefaultProps;
  NumberField?: NumberFieldDefaultProps;
  NumberScrubber?: NumberScrubberDefaultProps;
  OTPField?: OTPFieldDefaultProps;
  OTPFieldInput?: OTPFieldInputDefaultProps;
  OTPFieldSeparator?: OTPFieldSeparatorDefaultProps;
  Radio?: RadioDefaultProps;
  SearchField?: SearchFieldDefaultProps;
  Select?: SelectDefaultProps;
  Shortcut?: ShortcutDefaultProps;
  Slider?: SliderDefaultProps;
  Spinner?: SpinnerDefaultProps;
  Switch?: SwitchDefaultProps;
  Textarea?: TextareaDefaultProps;
}

type ThemeContextValue = {
  theme: 'dark' | 'light';
  accentColor: Color;
  overlaysRoot: string;
  defaults: ComponentDefaults;
};
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  accentColor: 'brand',
  overlaysRoot: '#app, #__next, #root',
  defaults: {},
});

/**
 * Provides `{ theme, accentColor }` to the rest of the tree via `ThemeContext`.
 * Most apps use `CladdProvider` instead, which wraps this together with the dialog/toast portals.
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
  defaults,
}: {
  /** App subtree to expose theme context to. */
  children: ReactNode;
  /** Color scheme to expose to descendants. */
  theme: 'dark' | 'light';
  /** App-wide accent color token used as the default for interactive components. */
  accentColor: string;
  /** The root element(s) to insert overlays to. Default `'#app, #__next, #root'`. */
  overlaysRoot?: string;
  /** Per-component default props, read via `useComponentDefaults`. */
  defaults?: ComponentDefaults;
}) => {
  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        overlaysRoot: overlaysRoot ?? '#app, #__next, #root',
        defaults: defaults ?? {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
