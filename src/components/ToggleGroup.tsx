import { ElementType, FC, useState } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { Segmented, SegmentedProps } from './Segmented';
import { ToggleGroupContextProvider } from './ToggleGroupContext';

interface ToggleGroupOwnProps {
  /**
   * Controlled selection. A single value in single-select mode, an array when `multiple`.
   *
   * When provided, internal state is bypassed.
   */
  value?: string | string[];
  /** Initial selection (uncontrolled). Ignored when `value` is provided. */
  defaultValue?: string | string[];
  /**
   * Fires whenever the selection changes.
   *
   * Receives a single value (or `undefined` when nothing is selected) in single-select mode, or the full array in `multiple` mode.
   */
  onValueChange?: (value: string | string[] | undefined) => void;
  /**
   * Allow more than one selected value. Selection becomes an array and every `ToggleButton` toggles independently. Default `false`.
   */
  multiple?: boolean;
}

export type ToggleGroupProps<C extends ElementType = 'div'> =
  ToggleGroupOwnProps & Omit<SegmentedProps<C>, keyof ToggleGroupOwnProps>;

/** Shape of `ToggleGroup` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ToggleGroupDefaultProps = Partial<
  Omit<
    ToggleGroupProps,
    'as' | 'ref' | 'children' | 'value' | 'defaultValue' | 'onValueChange'
  >
>;

/**
 * A group of `ToggleButton`s that owns the selected value(s) - the
 * self-managing counterpart to wiring `Segmented`/`SegmentedButton` by hand.
 * Renders a `Segmented` (so it inherits the full segmented look and all its
 * `color`/`variant`/`active*` knobs) and publishes the selection to its
 * children through context.
 *
 * Unlike `Segmented`, the active button stays pressable: clicking it deselects
 * (single mode collapses to no selection, `multiple` removes it from the set).
 *
 * @example
 * <ToggleGroup defaultValue="grid" activeColor="neutral">
 *   <ToggleButton value="grid">Grid</ToggleButton>
 *   <ToggleButton value="list">List</ToggleButton>
 * </ToggleGroup>
 *
 * @example
 * <ToggleGroup multiple defaultValue={['bold']}>
 *   <ToggleButton value="bold">Bold</ToggleButton>
 *   <ToggleButton value="italic">Italic</ToggleButton>
 * </ToggleGroup>
 */
export const ToggleGroup = <C extends ElementType = 'div'>(
  props: ToggleGroupProps<C>,
) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    multiple = false,
    children,
    ...segmentedProps
  } = useComponentDefaults('ToggleGroup', props) as ToggleGroupProps;

  const [internalValue, setInternalValue] = useState(defaultValue);
  // Controlled when the `value` prop is supplied at all - not when it's
  // currently defined. An empty selection is `undefined`, a valid value, so
  // inferring from `valueProp !== undefined` would flip the group to
  // uncontrolled whenever the selection clears and resurface stale state.
  const isControlled = 'value' in props;
  const value = isControlled ? valueProp : internalValue;

  const setValue = (next: string | string[] | undefined) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const toggleValue = (itemValue: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : value != null ? [value] : [];
      setValue(
        arr.includes(itemValue)
          ? arr.filter((v) => v !== itemValue)
          : [...arr, itemValue],
      );
    } else {
      const current = Array.isArray(value) ? value[0] : value;
      setValue(current === itemValue ? undefined : itemValue);
    }
  };

  const SegmentedEl = Segmented as FC<SegmentedProps>;

  return (
    <SegmentedEl {...segmentedProps}>
      <ToggleGroupContextProvider value={{ value, multiple, toggleValue }}>
        {children}
      </ToggleGroupContextProvider>
    </SegmentedEl>
  );
};
