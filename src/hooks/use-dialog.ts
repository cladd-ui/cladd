import { ReactNode } from 'react';

import { useDialogsPortalContext } from '../components/DialogsPortalContext';
import { Color } from '../types';
import { useAccentColor } from './use-accent-color';

export interface UseDialogOptions {
  /** Set to `true` when the dialog is rendered inside a React `lazy()` + `Suspense` boundary so it opens on the next tick (after the lazy chunk has resolved and mounted). Default `false`. */
  lazy?: boolean;
}

export interface UseDialogConfirmOptions {
  /** Dialog title — auto-wired to `aria-labelledby`. */
  title?: string;
  /** Dialog body text — auto-wired to `aria-describedby`. */
  text?: string | ReactNode;
  /**
   * Type-to-confirm guard. When set, renders an `Input` and disables the confirm button until the user types this exact value verbatim — used for irreversible destructive actions.
   */
  requireConfirmText?: boolean | string | ReactNode;
  /** Stop click propagation on backdrop and surface. Useful when the dialog is rendered inside a clickable parent. */
  stopPropagationOnClick?: boolean;
  /** Cancel button label. Default `'Cancel'`. */
  cancelButtonText?: ReactNode;
  /** Confirm button label. Default `'Confirm'`. */
  confirmButtonText?: ReactNode;
  /** Cancel button color. Default `'neutral'`. */
  cancelButtonColor?: Color;
  /** Confirm button color. Default: theme accent color. */
  confirmButtonColor?: Color;
  /** Fires when the confirm button is pressed (and the `requireConfirmText` guard passes). Always called with `true`. */
  onConfirm?: (confirmed: boolean) => void;
  /** Fires when the cancel button is pressed. Always called with `false`. */
  onCancel?: (cancelled: boolean) => void;
  /** Fires after the close transition completes — use for unmount cleanup. */
  onClosed?: (closed: boolean) => void;
}

export interface UseDialogAlertOptions {
  /** Dialog title — auto-wired to `aria-labelledby`. */
  title?: string;
  /** Dialog body text — auto-wired to `aria-describedby`. */
  text?: string | ReactNode;
  /** Stop click propagation on backdrop and surface. Useful when the dialog is rendered inside a clickable parent. */
  stopPropagationOnClick?: boolean;
  /** Confirm button label. Default `'Ok'`. */
  confirmButtonText?: ReactNode;
  /** Fires when the confirm button is pressed. Always called with `true`. */
  onConfirm?: (confirmed: boolean) => void;
  /** Fires after the close transition completes — use for unmount cleanup. */
  onClosed?: (closed: boolean) => void;
}

export const useDialog = ({ lazy }: UseDialogOptions = {}) => {
  const { setState, setData } = useDialogsPortalContext();
  const accentColor = useAccentColor();
  return {
    confirm({
      title,
      text,
      requireConfirmText = false,
      stopPropagationOnClick = false,
      cancelButtonText = 'Cancel',
      confirmButtonText = 'Confirm',
      cancelButtonColor = 'neutral',
      confirmButtonColor = accentColor,
      onConfirm = () => {},
      onCancel = () => {},
      onClosed = () => {},
    }: UseDialogConfirmOptions) {
      setData({
        title: title!,
        text: text!,
        requireConfirmText,
        stopPropagationOnClick,
        cancelButtonColor,
        confirmButtonColor,
        onConfirm,
        onCancel,
        onClosed,
        cancelButtonText,
        confirmButtonText,
        lazy,
      });
      setState(true);
    },
    alert({
      title,
      text,
      stopPropagationOnClick = false,
      confirmButtonText = 'Ok',
      onConfirm = () => {},
      onClosed = () => {},
    }: UseDialogAlertOptions) {
      setData({
        title: title!,
        text: text!,
        stopPropagationOnClick,
        onConfirm,
        onClosed,
        confirmButtonText,
        lazy,
      });
      setState(true);
    },
  };
};
