import { cloneElement, useEffect, useRef, useState } from 'react';

import { useDevice } from '../hooks/use-device';
import { Color } from '../types';
import { Tooltip, TooltipPosition, TooltipProps } from './Tooltip';

let tooltipGlobalTimeout: number = 0;
let tooltipGlobalTimeoutId: number = 0;

const resetGlobalTimeout = () => {
  const device = useDevice();
  tooltipGlobalTimeout = device.mobile ? 500 : 1000;
};

const getGlobalTimeout = () => {
  if (tooltipGlobalTimeout === null) {
    resetGlobalTimeout();
  }
  return tooltipGlobalTimeout;
};

export interface WithTooltipProps {
  /** Single React element to attach the tooltip to. The tooltip anchors to this child's DOM element. */
  children: React.ReactNode;
  /** Tooltip content. When falsy, no tooltip is rendered or wired up - `WithTooltip` becomes a transparent wrapper. */
  tooltip?: React.ReactNode;
  /** Extra classes forwarded to the inner `Tooltip`'s root surface. */
  className?: string;
  /** Forwarded to `Tooltip.position`. */
  position?: TooltipPosition;
  /** Forwarded to `Tooltip.offset`. */
  offset?: TooltipProps['offset'];
  /** Accent color token, forwarded to `Tooltip.color`. */
  color?: Color;
  /**
   * When `true` (default), delays showing the tooltip (500ms on touch, 1000ms on mouse) and
   * uses a shared global timer so successive hovers feel snappier - same UX as system tooltips.
   * When `false`, the tooltip appears immediately on pointer enter.
   */
  timeout?: boolean;
  /** Fires when the tooltip's open transition begins. */
  onOpen?: () => void;
  /** Fires after the open transition completes. */
  onOpened?: () => void;
  /** Fires when the tooltip's close transition begins. */
  onClose?: () => void;
  /** Fires after the close transition completes. */
  onClosed?: () => void;
  /** Composed onto the child element's `ref` (alongside the internal anchor ref). */
  ref?: React.Ref<HTMLElement>;
  /** Composed onto the child element's `onClick` (called before the child's own handler, if any). */
  onClick?: (e: React.MouseEvent) => void;
}

export const WithTooltip = ({
  children: originalChild,
  tooltip = '',
  className,
  position,
  offset,
  color,
  timeout = true,
  onOpen,
  onOpened,
  onClose,
  onClosed,
  ref: forwardedRef,
  onClick: forwardedOnClick,
}: WithTooltipProps) => {
  const [modalState, setModalState] = useState<boolean>(false);
  const elRef = useRef<HTMLElement | null>(null);
  const tooltipVisibleRef = useRef(false);
  const preventContextMenuRef = useRef(false);
  const pointerTimeoutRef = useRef<number | null>(null);

  const newRef = (el: any) => {
    elRef.current = el;
    const originalChildRef = (originalChild as any)?.props?.ref as any;
    if (originalChildRef && typeof originalChildRef === 'function')
      originalChildRef(el);
    else if (
      originalChildRef &&
      Object.keys(originalChildRef).includes('current')
    ) {
      originalChildRef.current = el;
    }
    if (typeof forwardedRef === 'function') forwardedRef(el);
    else if (
      forwardedRef &&
      typeof forwardedRef === 'object' &&
      'current' in forwardedRef
    ) {
      (forwardedRef as React.RefObject<any>).current = el;
    }
  };

  const showTooltip = () => {
    if (!tooltip) return;
    clearTimeout(tooltipGlobalTimeoutId);
    pointerTimeoutRef.current = setTimeout(
      () => {
        tooltipVisibleRef.current = true;
        setModalState(true);
        if (timeout) {
          tooltipGlobalTimeout = 0;
        }
      },
      timeout ? getGlobalTimeout() : 0,
    ) as unknown as number;
  };
  const hideTooltip = () => {
    if (!tooltip) return;
    tooltipVisibleRef.current = false;
    setModalState(false);
    clearTimeout(pointerTimeoutRef.current as number);
    if (timeout) {
      tooltipGlobalTimeoutId = setTimeout(() => {
        resetGlobalTimeout();
      }, 1000) as unknown as number;
    }
  };
  const onContextMenu = (e: any) => {
    if (!tooltip) return;
    if (preventContextMenuRef.current) {
      e.preventDefault();
    }
  };
  const onClick = (_e: any) => {
    if (!tooltip) return;
    if (tooltipVisibleRef.current) {
      hideTooltip();
    }
  };
  const onPointer = (e: PointerEvent) => {
    if (!tooltip) return;
    const mouseEvents = ['pointerenter', 'pointerleave', 'pointercancel'];
    const touchEvents = ['pointerdown', 'pointerup', 'pointercancel'];

    if (
      (e.pointerType === 'mouse' && !mouseEvents.includes(e.type)) ||
      (e.pointerType === 'touch' && !touchEvents.includes(e.type))
    ) {
      return;
    }
    if (e.type === 'pointerenter') {
      showTooltip();
    }
    if (e.type === 'pointerleave' || e.type === 'pointercancel') {
      preventContextMenuRef.current = false;
      hideTooltip();
    }
    if (e.type === 'pointerdown' && !tooltipVisibleRef.current) {
      preventContextMenuRef.current = true;
      showTooltip();
    }
    if (e.type === 'pointerup') {
      preventContextMenuRef.current = false;
      hideTooltip();
    }
  };

  useEffect(() => {
    const el = elRef.current as HTMLElement;
    if (el) {
      el.addEventListener('click', onClick);
      el.addEventListener('contextmenu', onContextMenu);
      el.addEventListener('pointerenter', onPointer);
      el.addEventListener('pointerdown', onPointer);
      document.addEventListener('pointerup', onPointer);
      document.addEventListener('pointercancel', onPointer);
      el.addEventListener('pointerleave', onPointer);
    }
    return () => {
      if (el) {
        el.removeEventListener('click', onClick);
        el.removeEventListener('contextmenu', onContextMenu);
        el.removeEventListener('pointerenter', onPointer);
        el.removeEventListener('pointerdown', onPointer);
        document.removeEventListener('pointerup', onPointer);
        document.removeEventListener('pointercancel', onPointer);
        el.removeEventListener('pointerleave', onPointer);
      }
    };
  });

  const cloneProps: Record<string, any> = { ref: newRef };
  if (forwardedOnClick) {
    const originalOnClick = (originalChild as any)?.props?.onClick;
    cloneProps.onClick = (e: React.MouseEvent) => {
      forwardedOnClick(e);
      if (originalOnClick) originalOnClick(e);
    };
  }
  const newChild = cloneElement(
    originalChild as React.ReactElement<any>,
    cloneProps,
  );

  return (
    <>
      {newChild}
      {tooltip && (
        <Tooltip
          open={modalState}
          onOpenChange={setModalState}
          anchorRef={elRef}
          className={className}
          position={position}
          offset={offset}
          color={color}
          onOpen={onOpen}
          onOpened={onOpened}
          onClose={onClose}
          onClosed={onClosed}
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};
