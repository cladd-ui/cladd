import {
  createContext,
  useContext,
  useState,
  ElementType,
  ReactNode,
} from 'react';

import { Color } from '../types';

/**
 * Shape of a queued toast in the imperative toast portal. Mirrors `ToastProps` but adds an
 * `id` (used as React key + lifecycle handle) and an internal `removed` flag.
 */
export type ToastsPortalData = {
  /** Stable identifier - also used as the React key when rendering the toast list. */
  id: string;
  /** Toast title (bold line). */
  title: string;
  /** Toast body text. */
  text: string | ReactNode;
  /** Render the auto close button. Default `true` (in `Toast`). */
  closeButton?: boolean;
  /** Icon component rendered before the text content. Receives `iconProps`. */
  icon?: ElementType<any>;
  /** Props forwarded to the `icon` component. */
  iconProps?: Record<string, unknown>;
  /** Accent color token. */
  color?: Color;
  /** Internal flag set after `onClosed` fires once - prevents double-removal from the queue. */
  removed?: boolean;
  /** Auto-close timeout in ms (`0` disables). */
  timeout?: number;
  /** Extra classes for the toast surface. */
  className?: string;
  /** Fires after the close transition completes. */
  onClosed?: (closed: boolean) => void;
};

export const ToastsPortalContext = createContext<{
  data: ToastsPortalData[];
  setData: React.Dispatch<React.SetStateAction<ToastsPortalData[]>>;
  state: Record<string, boolean>;
  setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}>({
  data: [],
  setData: () => {},
  state: {},
  setState: () => {},
});

export const ToastsPortalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ToastsPortalData[]>([]);
  const [state, setState] = useState<Record<string, boolean>>({});
  return (
    <ToastsPortalContext.Provider value={{ data, setData, state, setState }}>
      {children}
    </ToastsPortalContext.Provider>
  );
};

export const useToastsPortalContext = () => {
  return useContext(ToastsPortalContext);
};
