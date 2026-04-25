import { useEffect, useRef, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../shared/cn';
import { useModalUtils } from '../shared/use-modal-utils';
import { useTheme } from '../shared/use-theme';
import { Color } from '../types';
import { ModalPhase, ModalController } from './ModalController';
import { Surface, SurfaceProps } from './Surface';

type OffsetValue = number | string;

export type TooltipPosition = 'top' | 'bottom';

const resolveOffset = (value: OffsetValue): string => {
  if (typeof value === 'number') return `${value}px`;
  if (value.endsWith('%')) {
    const fraction = parseFloat(value) / 100;
    return `calc(anchor-size(height) * ${fraction})`;
  }
  return value;
};

interface TooltipOwnProps {
  /** Controlled open state. Default `false`. Pair with `onOpenChange`. */
  open?: boolean;
  /** Fires whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Tailwind z-index utility for the tooltip surface. Default `'z-50'`. */
  zIndex?: string;
  /** Extra classes applied to the tooltip root `Surface`. */
  className?: string;
  /** Extra classes applied to the inner content area. Default includes `px-2 py-1`. */
  contentClassName?: string;
  /** Ref to the element the tooltip should anchor against (CSS anchor positioning). */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Portal target selector. Default `'#app, #__next, #root'`. */
  root?: string;
  /** Anchor side. Default `'top'`. */
  position?: TooltipPosition;
  /**
   * Forwarded to the underlying `Surface` as `level`. Default depends on theme:
   * `1` for light theme, `5` for dark theme - so the tooltip pops on top of any surface.
   */
  surfaceLevel?: number;
  /** Distance from anchor in pixels (number) or any CSS length (`'8px'`, `'50%'`). Default `4`. */
  offset?: OffsetValue;
  /** Accent color token. Sets the tooltip's `color-{name}` class. */
  color?: Color;
  /** Tooltip content. */
  children?: ReactNode;
  /** Fires when the open transition begins. */
  onOpen?: () => void;
  /** Fires after the open transition completes. */
  onOpened?: () => void;
  /** Fires when the close transition begins. */
  onClose?: () => void;
  /** Fires after the close transition completes. */
  onClosed?: () => void;
  /** Forwarded to the tooltip surface root. */
  ref?: Ref<HTMLDivElement>;
}

export type TooltipProps = TooltipOwnProps &
  Omit<SurfaceProps, keyof TooltipOwnProps>;

type TooltipRootProps = Omit<TooltipProps, 'open' | 'onOpenChange'> & {
  phase?: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
};

const TooltipRoot = (props: TooltipRootProps) => {
  const theme = useTheme();
  const {
    phase = 'closed',
    onPhaseChange = () => {},
    zIndex = 'z-50',
    className = '',
    contentClassName = '',
    anchorRef,
    root = '#app, #__next, #root',
    position = 'top',
    offset = 4,
    surfaceLevel = theme === 'light' ? 1 : 5,
    color,
    children,
    onOpen = () => {},
    onOpened = () => {},
    onClose = () => {},
    onClosed = () => {},
    ref,
    ...rest
  } = props;

  const anchorNameRef = useRef('');

  // Reuse existing anchor-name if target already has one (e.g. from Popover),
  // otherwise generate a shared one
  if (anchorRef?.current) {
    const existing = anchorRef.current.style.getPropertyValue('anchor-name');
    if (existing) {
      anchorNameRef.current = existing;
    } else if (!anchorNameRef.current) {
      anchorNameRef.current = `--anchor-${Math.random().toString(36).slice(2, 8)}`;
    }
  }
  const anchorName = anchorNameRef.current;

  const elRef = useRef<HTMLDivElement | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);

  const { opened, open, close } = useModalUtils({
    phase,
    onPhaseChange,
    onOpen,
    onOpened,
    onClose,
    onClosed,
    transitionEndElRef: elRef,
    closeOnEscape() {
      if (containerElRef.current && containerElRef.current.nextElementSibling) {
        const nextEl = containerElRef.current.nextElementSibling;
        if (nextEl.matches('.popover, .dialog')) {
          return false;
        }
      }
      return true;
    },
  });

  // Set anchor-name on target element if not already set
  useEffect(() => {
    const anchorEl = anchorRef?.current;
    if (!anchorEl || !anchorName) return;
    if (!anchorEl.style.getPropertyValue('anchor-name')) {
      anchorEl.style.setProperty('anchor-name', anchorName);
    }
  }, [anchorRef, anchorName]);

  useEffect(() => {
    requestAnimationFrame(() => {
      open();
    });
  }, []);

  useEffect(() => {
    if (containerElRef.current) {
      (containerElRef.current as any).__Tooltip = { close };
    }
  }, []);

  const isTop = position === 'top';

  const tooltipStyle = {
    positionAnchor: anchorName,
    positionArea: isTop ? 'top center' : 'bottom center',
    positionTryFallbacks: 'flip-block',
    ...(offset
      ? { [isTop ? 'marginBottom' : 'marginTop']: resolveOffset(offset) }
      : {}),
  } as React.CSSProperties;

  const content = (
    <div className="tooltip pointer-events-none" ref={containerElRef}>
      <Surface
        ref={(el: any) => {
          elRef.current = el;
          if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        style={tooltipStyle}
        level={surfaceLevel}
        outline
        variant="gradient"
        contentClassName={cn('px-2 py-1', contentClassName)}
        className={cn(
          'pointer-events-none fixed max-h-[50vh] w-max max-w-50 overflow-auto rounded-xl text-xs leading-normal font-medium transition-[opacity,transform,scale]',
          color && `color-` + color,

          opened ? 'scale-100 opacity-100' : '',
          phase === 'opened' && 'duration-200',
          phase === 'closing' && 'duration-200',
          (phase === 'closing' || !opened) && 'scale-50 opacity-0',
          zIndex,
          isTop ? 'origin-bottom' : 'origin-top',
          className,
        )}
        {...rest}
      >
        {children}
      </Surface>
    </div>
  );

  return root ? createPortal(content, document.querySelector(root)!) : content;
};

export const Tooltip = ({
  open = false,
  onOpenChange = () => {},
  ...rest
}: TooltipProps) => (
  <ModalController open={open} onOpenChange={onOpenChange}>
    <TooltipRoot {...rest} />
  </ModalController>
);
