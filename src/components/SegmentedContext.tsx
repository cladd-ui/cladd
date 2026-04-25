import { createContext, useContext, ReactNode } from 'react';

import { Color } from '../types';
import { ButtonProps, ButtonSize } from './Button';

/**
 * Shape of the data published by `Segmented` to its child `SegmentedButton`s.
 * Each `SegmentedButton` reads this via `useSegmentedContext()` to pick its inactive vs active
 * styling - see `SegmentedButton.active`.
 */
interface SegmentedContextValue {
  /** Button size. */
  size?: ButtonSize;
  /** Pill-shape the segment buttons. */
  rounded?: boolean;
  /** Color applied to **inactive** buttons. */
  color?: Color;
  /** Variant applied to **inactive** buttons. */
  variant?: ButtonProps['variant'];
  /** Outline ring on **inactive** buttons. */
  outline?: boolean;
  /** Color applied to the **active** button. */
  activeColor?: Color;
  /** Variant applied to the **active** button. */
  activeVariant?: ButtonProps['variant'];
  /** Outline ring on the **active** button. */
  activeOutline?: boolean;
}

interface SegmentedContextProviderProps {
  /** Style values to publish to descendant `SegmentedButton`s. */
  value: SegmentedContextValue;
  children: ReactNode;
}

export const SegmentedContext = createContext<SegmentedContextValue>({});

export function useSegmentedContext(): SegmentedContextValue {
  return useContext(SegmentedContext);
}

export function SegmentedContextProvider(props: SegmentedContextProviderProps) {
  return (
    <SegmentedContext.Provider value={props.value}>
      {props.children}
    </SegmentedContext.Provider>
  );
}
