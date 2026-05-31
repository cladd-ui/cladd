import { createContext, useContext, ReactNode } from 'react';

/**
 * Selection state published by `ToggleGroup` to its descendant `ToggleButton`s.
 * Each reads it via `useToggleGroupContext()` to derive its pressed state and to
 * toggle itself on click.
 */
interface ToggleGroupContextValue {
  /**
   * Current selection. A single value (or `undefined`) in single-select mode, an array in `multiple` mode.
   */
  value: string | string[] | undefined;
  /** Whether the group allows more than one selected value at a time. */
  multiple: boolean;
  /**
   * Toggle a value's membership in the selection.
   *
   * In single mode, re-toggling the active value clears the selection; in `multiple` mode it adds/removes.
   */
  toggleValue: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

/**
 * Returns the surrounding `ToggleGroup`'s selection state, or `null` when a
 * `ToggleButton` is used standalone (outside any group).
 */
export function useToggleGroupContext(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext);
}

export function ToggleGroupContextProvider(props: {
  value: ToggleGroupContextValue;
  children: ReactNode;
}) {
  return (
    <ToggleGroupContext.Provider value={props.value}>
      {props.children}
    </ToggleGroupContext.Provider>
  );
}
