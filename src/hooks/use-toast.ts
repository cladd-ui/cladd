import { ElementType, ReactNode } from 'react';

import { useToastsPortalContext } from '../components/ToastsPortalContext';
import { Color } from '../types';

export interface UseToastOptions {
  /** Toast title — bold line above `text`. At least one of `title` / `text` is expected. */
  title?: string;
  /** Toast body text — smaller line under `title`. At least one of `title` / `text` is expected. */
  text?: string | ReactNode;
  /** Accent color token (`Color` enum). Default `'neutral'`. */
  color?: Color;
  /** Render the auto close button on the right. Default `true`. */
  closeButton?: boolean;
  /** Icon component rendered before the text content. Receives `iconProps`. */
  icon?: ElementType<any>;
  /** Props forwarded to the `icon` component. */
  iconProps?: Record<string, unknown>;
  /** Auto-close after this many ms. Pass `0` to disable auto-close. Default `5000`. */
  timeout?: number;
  /** Extra classes applied to the toast root `Surface`. */
  className?: string;
  /** Fires after the close transition completes — use for unmount cleanup. */
  onClosed?: (closed: boolean) => void;
}

export const useToast = () => {
  const { setState, state, setData, data } = useToastsPortalContext();
  return ({
    title,
    text,
    color,
    closeButton,
    icon,
    iconProps,
    timeout,
    className,
    onClosed,
  }: UseToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    data.push({
      id,
      title: title!,
      text: text!,
      color,
      closeButton,
      icon,
      iconProps,
      timeout,
      className,
      onClosed,
    });
    setData([...data]);
    state[id] = true;
    setState({ ...state });
  };
};
