import { createContext, useContext, ReactNode } from 'react';

import { ButtonSize } from './Button';
import { SurfaceVariant } from './Surface';

interface ToolbarContextValue {
  size?: ButtonSize;
  rounded?: boolean;
  variant?: SurfaceVariant;
  outline?: boolean;
}

interface ToolbarContextProviderProps {
  value: ToolbarContextValue;
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
