import { cloneElement, useEffect, useRef, useState, ReactNode } from 'react';

import { useDevice } from '../hooks/use-device';
import {
  TooltipPrimitive,
  TooltipPrimitiveProps,
  TooltipPosition,
} from './TooltipPrimitive';

export type { TooltipPosition };

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

export interface TooltipProps extends Omit<
  TooltipPrimitiveProps,
  'children' | 'ref'
> {
  /**
   * When provided, the component acts as a wrapper around `children` (a single element)
   * and shows this content as a tooltip on hover/focus/touch. When omitted, the component
   * forwards all props to the underlying `TooltipPrimitive` and `children` is rendered as
   * the tooltip content (controlled mode via `open`/`anchorRef`).
   */
  tooltip?: ReactNode;
  /**
   * Wrapper mode: the single element to attach the tooltip to.
   * Primitive mode: the tooltip content.
   */
  children?: ReactNode;
  /**
   * Wrapper mode only. When `true` (default), delays showing the tooltip (500ms on touch,
   * 1000ms on mouse) and uses a shared global timer so successive hovers feel snappier -
   * same UX as system tooltips. When `false`, the tooltip appears immediately on pointer enter.
   */
  timeout?: boolean;
  /** Wrapper mode only. Composed onto the wrapped child element's `onClick`. */
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Wrapper mode: composed onto the wrapped child's ref (alongside the internal anchor ref).
   * Primitive mode: forwarded to the tooltip surface root.
   */
  ref?: React.Ref<any>;
}

const TooltipWrapper = ({
  tooltip,
  children: originalChild,
  timeout = true,
  onClick: forwardedOnClick,
  ref: forwardedRef,
  ...primitiveProps
}: TooltipProps) => {
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
        <TooltipPrimitive
          {...primitiveProps}
          open={modalState}
          onOpenChange={setModalState}
          anchorRef={elRef}
        >
          {tooltip}
        </TooltipPrimitive>
      )}
    </>
  );
};

export const Tooltip = (props: TooltipProps) => {
  if (props.tooltip === undefined) {
    const {
      tooltip: _t,
      timeout: _to,
      onClick: _oc,
      ...primitiveProps
    } = props;
    return <TooltipPrimitive {...(primitiveProps as TooltipPrimitiveProps)} />;
  }
  return <TooltipWrapper {...props} />;
};
