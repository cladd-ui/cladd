import React, { createContext, useContext, useState } from 'react';

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
  text: string | React.ReactNode;
  /**
   * Type-to-confirm guard. If string-coercible (truthy), the confirm button is disabled
   * until the user types this exact value. Forwarded to `Dialog.requireConfirmText` after
   * `String(...)` coercion.
   */
  requireConfirmText?: boolean | string | React.ReactNode;
  /** Stop click propagation on backdrop and surface. */
  stopPropagationOnClick?: boolean;
  cancelButtonText?: React.ReactNode;
  confirmButtonText?: React.ReactNode;
  cancelButtonColor?: Color;
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

export const DialogsPortalContext = createContext<{
  data: DialogsPortalData | null;
  setData: React.Dispatch<React.SetStateAction<DialogsPortalData | null>>;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  data: null,
  setData: () => {},
  state: false,
  setState: () => {},
});

export const DialogsPortalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<null | DialogsPortalData>(null);
  const [state, setState] = useState<boolean>(false);
  return (
    <DialogsPortalContext.Provider value={{ data, setData, state, setState }}>
      {children}
    </DialogsPortalContext.Provider>
  );
};

export const useDialogsPortalContext = () => {
  return useContext(DialogsPortalContext);
};
