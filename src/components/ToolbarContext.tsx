import { createContext, useContext, ReactNode } from 'react';

import { ButtonSize } from './Button';
import { SurfaceVariant } from './Surface';

/**
 * Defaults applied to every `ToolbarButton` inside a `Toolbar`. Each field overrides the
 * corresponding `Button` default - individual `ToolbarButton` props still take precedence.
 */
interface ToolbarContextValue {
  /** Default `size` for buttons in this toolbar. */
  size?: ButtonSize;
  /** Default `rounded` (pill) for buttons in this toolbar. */
  rounded?: boolean;
  /** Default `variant` for buttons in this toolbar. */
  variant?: SurfaceVariant;
  /** Default `outline` for buttons in this toolbar. */
  outline?: boolean;
}

interface ToolbarContextProviderProps {
  /** Defaults to publish to descendant `ToolbarButton`s. */
  value: ToolbarContextValue;
  /** Subtree that should read these defaults. */
  children: ReactNode;
}

export const ToolbarContext = createContext<ToolbarContextValue>({});

export function useToolbarContext(): ToolbarContextValue {
  return useContext(ToolbarContext);
}

export function ToolbarContextProvider(props: ToolbarContextProviderProps) {
  return (
    <ToolbarContext.Provider value={props.value}>
      {props.children}
    </ToolbarContext.Provider>
  );
}
