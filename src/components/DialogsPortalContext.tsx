import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';

import { Color } from '../types';

/**
 * Shape of the currently open dialog in the imperative dialog portal. The portal renders at
 * most one dialog at a time; opening a new one replaces the previous via the context setter.
 * Mirrors `DialogProps` for the props that the portal-rendered Dialog forwards.
 */
export type DialogsPortalData = {
  /** Dialog title - auto-wired to `aria-labelledby`. */
  title: string;
  /** Dialog body text - auto-wired to `aria-describedby`. */
  text: string | ReactNode;
  /**
   * Type-to-confirm guard. If string-coercible (truthy), the confirm button is disabled
   * until the user types this exact value. Forwarded to `Dialog.requireConfirmText` after
   * `String(...)` coercion.
   */
  requireConfirmText?: boolean | string | ReactNode;
  /** Stop click propagation on backdrop and surface. */
  stopPropagationOnClick?: boolean;
  /** Label for the cancel button. When omitted, the cancel button is not rendered. */
  cancelButtonText?: ReactNode;
  /** Label for the confirm button. When omitted, the confirm button is not rendered. */
  confirmButtonText?: ReactNode;
  /** Color for the cancel button. Default `'neutral'`. */
  cancelButtonColor?: Color;
  /** Color for the confirm button. Default: theme accent color. */
  confirmButtonColor?: Color;
  /** Fires when the confirm button is pressed (and the `requireConfirmText` guard passes). Always called with `true`. */
  onConfirm?: (confirmed: boolean) => void;
  /** Fires when the cancel button is pressed. Always called with `false`. */
  onCancel?: (cancelled: boolean) => void;
  /** Fires after the close transition completes - use for unmount cleanup. */
  onClosed?: (closed: boolean) => void;
  /** Defer rendering until first opened, and unmount after close. */
  lazy?: boolean;
};

type DialogsPortalDataValue = {
  data: DialogsPortalData | null;
  state: boolean;
};

type DialogsPortalApiValue = {
  setData: React.Dispatch<React.SetStateAction<DialogsPortalData | null>>;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DialogsPortalDataContext = createContext<DialogsPortalDataValue>({
  data: null,
  state: false,
});

export const DialogsPortalApiContext = createContext<DialogsPortalApiValue>({
  setData: () => {},
  setState: () => {},
});

export const DialogsPortalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<null | DialogsPortalData>(null);
  const [state, setState] = useState<boolean>(false);
  const api = useMemo(() => ({ setData, setState }), []);
  const dataValue = useMemo(() => ({ data, state }), [data, state]);
  return (
    <DialogsPortalApiContext.Provider value={api}>
      <DialogsPortalDataContext.Provider value={dataValue}>
        {children}
      </DialogsPortalDataContext.Provider>
    </DialogsPortalApiContext.Provider>
  );
};

export const useDialogsPortalData = () => useContext(DialogsPortalDataContext);
export const useDialogsPortalApi = () => useContext(DialogsPortalApiContext);
