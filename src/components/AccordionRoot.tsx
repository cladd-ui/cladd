import { ReactNode, useId, useState } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { AccordionContextProvider } from './AccordionContext';

interface AccordionRootOwnProps {
  /** `AccordionItem`s. */
  children?: ReactNode;
  /**
   * Controlled open item(s). A single value in single-open mode, an array when `multiple`.
   *
   * When provided, internal state is bypassed.
   */
  value?: string | string[];
  /** Initial open item(s) (uncontrolled). Ignored when `value` is provided. */
  defaultValue?: string | string[];
  /**
   * Fires whenever the open item(s) change.
   *
   * Receives a single value (or `undefined` when all closed) in single-open mode, or the full array in `multiple` mode.
   */
  onValueChange?: (value: string | string[] | undefined) => void;
  /** Allow more than one item open at once. Selection becomes an array. Default `false`. */
  multiple?: boolean;
  /** Disable the whole accordion - every item's trigger stops toggling. */
  disabled?: boolean;
}

export type AccordionRootProps = AccordionRootOwnProps;

/** Shape of `AccordionRoot` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type AccordionRootDefaultProps = Partial<
  Omit<
    AccordionRootOwnProps,
    'children' | 'value' | 'defaultValue' | 'onValueChange'
  >
>;

/**
 * Stateful, non-visual root for a set of disclosures. Owns the open value(s) -
 * controlled via `value`/`onValueChange` or uncontrolled via `defaultValue` -
 * and the single-vs-`multiple` mode, publishing them to `AccordionItem`s
 * through context. Renders no DOM of its own.
 *
 * Single-open mode collapses to nothing when you re-toggle the open item;
 * `multiple` mode toggles each item independently.
 *
 * @example
 * <AccordionRoot defaultValue="appearance">
 *   <AccordionItem value="appearance">
 *     <AccordionTrigger><button>Appearance</button></AccordionTrigger>
 *     <AccordionPanel><div className="pt-2">…</div></AccordionPanel>
 *   </AccordionItem>
 *   <AccordionItem value="layout">…</AccordionItem>
 * </AccordionRoot>
 */
export const AccordionRoot = (props: AccordionRootProps) => {
  const baseId = useId();
  const {
    children,
    value: valueProp,
    defaultValue,
    onValueChange,
    multiple = false,
    disabled = false,
  } = useComponentDefaults('AccordionRoot', props);

  const [internalValue, setInternalValue] = useState(defaultValue);
  // Controlled when the `value` prop is supplied at all - not when it's
  // currently defined. An empty selection is `undefined`, a valid value, so
  // inferring from `valueProp !== undefined` would flip to uncontrolled
  // whenever everything closes and resurface stale state.
  const isControlled = 'value' in props;
  const value = isControlled ? valueProp : internalValue;

  const setValue = (next: string | string[] | undefined) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const isItemOpen = (itemValue: string) =>
    Array.isArray(value) ? value.includes(itemValue) : value === itemValue;

  const toggleItem = (itemValue: string) => {
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

  return (
    <AccordionContextProvider
      value={{ isItemOpen, toggleItem, disabled, baseId }}
    >
      {children}
    </AccordionContextProvider>
  );
};
