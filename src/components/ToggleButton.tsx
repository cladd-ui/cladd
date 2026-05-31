import { ElementType, FC, MouseEvent, useState } from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { useComponentDefaults } from '../hooks/use-component-defaults';
import { Color } from '../types';
import { SegmentedButton, SegmentedButtonProps } from './SegmentedButton';
import {
  SegmentedContextProvider,
  useSegmentedContext,
} from './SegmentedContext';
import { SurfaceVariant } from './Surface';
import { useToggleGroupContext } from './ToggleGroupContext';
import { useToolbarContext } from './ToolbarContext';

interface ToggleButtonOwnProps {
  /**
   * Identifies this button inside a `ToggleGroup` - matched against the group's selection.
   *
   * Omit when using the button standalone.
   */
  value?: string;
  /** Controlled pressed state for **standalone** use. Ignored inside a `ToggleGroup`. */
  selected?: boolean;
  /** Initial pressed state for **standalone** use (uncontrolled). Ignored inside a `ToggleGroup`. */
  defaultSelected?: boolean;
  /**
   * Fires with the next pressed state on click. Standalone only - inside a `ToggleGroup` use the group's `onValueChange` instead.
   */
  onChange?: (selected: boolean, event: MouseEvent) => void;
  /** Accent color applied while **pressed**. Default: theme accent (or the group's `activeColor`). */
  activeColor?: Color;
  /** `Surface` variant applied while **pressed**. Default `'gradient'`. */
  activeVariant?: SurfaceVariant;
  /** Outline ring while **pressed**. Default `true`. */
  activeOutline?: boolean;
}

export type ToggleButtonProps<C extends ElementType = 'button'> =
  ToggleButtonOwnProps &
    Omit<SegmentedButtonProps<C>, 'active' | keyof ToggleButtonOwnProps>;

/** Shape of `ToggleButton` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ToggleButtonDefaultProps = Partial<
  Omit<
    ToggleButtonProps,
    'as' | 'ref' | 'children' | 'value' | 'selected' | 'defaultSelected'
  >
>;

/**
 * A two-state (pressed / not) button. Looks like a single `SegmentedButton` -
 * transparent when idle, accent gradient when pressed - and exposes
 * `aria-pressed`.
 *
 * Works both ways:
 * - **Inside a `ToggleGroup`**: identify it with `value`; the group owns the
 *   selection and the button derives its pressed state and styling from it.
 * - **Standalone**: owns its own state (controlled via `selected`/`onChange` or
 *   uncontrolled via `defaultSelected`) - handy for toolbar controls like
 *   bold/italic/pin.
 */
export const ToggleButton = <C extends ElementType = 'button'>(
  props: ToggleButtonProps<C>,
) => {
  const accentColor = useAccentColor();
  const { size: toolbarSize, rounded: toolbarRounded } = useToolbarContext();
  const group = useToggleGroupContext();
  const seg = useSegmentedContext();
  const {
    value,
    selected: selectedProp,
    defaultSelected = false,
    onChange,
    activeColor,
    activeVariant,
    activeOutline,
    color,
    variant,
    outline,
    size,
    rounded,
    onClick,
    ...rest
  } = useComponentDefaults('ToggleButton', props) as ToggleButtonProps;

  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const selected = group
    ? group.multiple
      ? Array.isArray(group.value) &&
        value != null &&
        group.value.includes(value)
      : group.value === value
    : selectedProp !== undefined
      ? selectedProp
      : internalSelected;

  // Resolve styling from this button's props, then the surrounding `Segmented`
  // (set up by `ToggleGroup`), then toggle defaults. Routed through context -
  // not passed to `SegmentedButton` directly - so its active/inactive switch
  // keeps working (props passed to it would override the context-derived look).
  const styling = {
    size: size ?? seg.size ?? toolbarSize ?? 'md',
    rounded: rounded ?? seg.rounded ?? toolbarRounded ?? true,
    color: color ?? seg.color ?? '',
    variant: variant ?? seg.variant ?? 'transparent',
    outline: outline ?? seg.outline ?? false,
    activeColor: activeColor ?? seg.activeColor ?? accentColor,
    activeVariant: activeVariant ?? seg.activeVariant ?? 'gradient',
    activeOutline: activeOutline ?? seg.activeOutline ?? true,
  };

  const SegmentedButtonEl = SegmentedButton as FC<SegmentedButtonProps>;

  return (
    <SegmentedContextProvider value={styling}>
      <SegmentedButtonEl
        {...rest}
        active={selected}
        readOnly={false}
        aria-pressed={selected}
        data-value={value}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          onClick?.(e);
          if (group) {
            if (value != null) group.toggleValue(value);
          } else {
            const next = !selected;
            if (selectedProp === undefined) setInternalSelected(next);
            onChange?.(next, e);
          }
        }}
      />
    </SegmentedContextProvider>
  );
};
