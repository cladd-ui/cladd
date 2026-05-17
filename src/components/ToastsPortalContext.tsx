import {
  createContext,
  useContext,
  useState,
  useMemo,
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

type ToastsPortalDataValue = {
  data: ToastsPortalData[];
  state: Record<string, boolean>;
};

type ToastsPortalApiValue = {
  setData: React.Dispatch<React.SetStateAction<ToastsPortalData[]>>;
  setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export const ToastsPortalDataContext = createContext<ToastsPortalDataValue>({
  data: [],
  state: {},
});

export const ToastsPortalApiContext = createContext<ToastsPortalApiValue>({
  setData: () => {},
  setState: () => {},
});

export const ToastsPortalProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ToastsPortalData[]>([]);
  const [state, setState] = useState<Record<string, boolean>>({});
  const api = useMemo(() => ({ setData, setState }), []);
  const dataValue = useMemo(() => ({ data, state }), [data, state]);
  return (
    <ToastsPortalApiContext.Provider value={api}>
      <ToastsPortalDataContext.Provider value={dataValue}>
        {children}
      </ToastsPortalDataContext.Provider>
    </ToastsPortalApiContext.Provider>
  );
};

export const useToastsPortalData = () => useContext(ToastsPortalDataContext);
export const useToastsPortalApi = () => useContext(ToastsPortalApiContext);
