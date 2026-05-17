import { createContext, ReactNode } from 'react';

import { Color } from '../types';
import type { BackdropDefaultProps } from './Backdrop';
import type { ButtonDefaultProps } from './Button';
import type { CheckboxDefaultProps } from './Checkbox';
import type { ChipDefaultProps } from './Chip';
import type { DialogDefaultProps } from './Dialog';
import type { InputDefaultProps } from './Input';
import type { LinkDefaultProps } from './Link';
import type { ListDefaultProps } from './List';
import type { ListButtonDefaultProps } from './ListButton';
import type { ListItemDefaultProps } from './ListItem';
import type { ListSeparatorDefaultProps } from './ListSeparator';
import type { ListTitleDefaultProps } from './ListTitle';
import type { NumberFieldDefaultProps } from './NumberField';
import type { NumberScrubberDefaultProps } from './NumberScrubber';
import type { OTPFieldDefaultProps } from './OTPField';
import type { OTPFieldInputDefaultProps } from './OTPFieldInput';
import type { OTPFieldSeparatorDefaultProps } from './OTPFieldSeparator';
import type { PopoverDefaultProps } from './Popover';
import type { PopupDefaultProps } from './Popup';
import type { PopupContentDefaultProps } from './PopupContent';
import type { RadioDefaultProps } from './Radio';
import type { SearchFieldDefaultProps } from './SearchField';
import type { SectionTitleDefaultProps } from './SectionTitle';
import type { SegmentedDefaultProps } from './Segmented';
import type { SegmentedButtonDefaultProps } from './SegmentedButton';
import type { SelectDefaultProps } from './Select';
import type { ShortcutDefaultProps } from './Shortcut';
import type { SliderDefaultProps } from './Slider';
import type { SpinnerDefaultProps } from './Spinner';
import type { SurfaceDefaultProps } from './Surface';
import type { SurfaceContentDefaultProps } from './SurfaceContent';
import type { SurfaceCutDefaultProps } from './SurfaceCut';
import type { SurfaceCutContentDefaultProps } from './SurfaceCutContent';
import type { SwitchDefaultProps } from './Switch';
import type { TextareaDefaultProps } from './Textarea';
import type { ToastDefaultProps } from './Toast';
import type { ToolbarDefaultProps } from './Toolbar';
import type { ToolbarButtonDefaultProps } from './ToolbarButton';
import type { ToolbarSeparatorDefaultProps } from './ToolbarSeparator';
import type { TooltipDefaultProps } from './Tooltip';
import type { TooltipPrimitiveDefaultProps } from './TooltipPrimitive';

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
  Backdrop?: BackdropDefaultProps;
  Button?: ButtonDefaultProps;
  Checkbox?: CheckboxDefaultProps;
  Chip?: ChipDefaultProps;
  Dialog?: DialogDefaultProps;
  Input?: InputDefaultProps;
  Link?: LinkDefaultProps;
  List?: ListDefaultProps;
  ListButton?: ListButtonDefaultProps;
  ListItem?: ListItemDefaultProps;
  ListSeparator?: ListSeparatorDefaultProps;
  ListTitle?: ListTitleDefaultProps;
  NumberField?: NumberFieldDefaultProps;
  NumberScrubber?: NumberScrubberDefaultProps;
  OTPField?: OTPFieldDefaultProps;
  OTPFieldInput?: OTPFieldInputDefaultProps;
  OTPFieldSeparator?: OTPFieldSeparatorDefaultProps;
  Popover?: PopoverDefaultProps;
  Popup?: PopupDefaultProps;
  PopupContent?: PopupContentDefaultProps;
  Radio?: RadioDefaultProps;
  SearchField?: SearchFieldDefaultProps;
  SectionTitle?: SectionTitleDefaultProps;
  Segmented?: SegmentedDefaultProps;
  SegmentedButton?: SegmentedButtonDefaultProps;
  Select?: SelectDefaultProps;
  Shortcut?: ShortcutDefaultProps;
  Slider?: SliderDefaultProps;
  Spinner?: SpinnerDefaultProps;
  Surface?: SurfaceDefaultProps;
  SurfaceContent?: SurfaceContentDefaultProps;
  SurfaceCut?: SurfaceCutDefaultProps;
  SurfaceCutContent?: SurfaceCutContentDefaultProps;
  Switch?: SwitchDefaultProps;
  Textarea?: TextareaDefaultProps;
  Toast?: ToastDefaultProps;
  Toolbar?: ToolbarDefaultProps;
  ToolbarButton?: ToolbarButtonDefaultProps;
  ToolbarSeparator?: ToolbarSeparatorDefaultProps;
  Tooltip?: TooltipDefaultProps;
  TooltipPrimitive?: TooltipPrimitiveDefaultProps;
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
