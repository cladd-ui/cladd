import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { useModalUtils } from '../hooks/use-modal-utils';
import { useOverlaysRoot } from '../hooks/use-overlays-root';
import { useTheme } from '../hooks/use-theme';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { Backdrop } from './Backdrop';
import { ModalController, ModalPhase } from './ModalController';
import { Surface, SurfaceProps, SurfaceVariant } from './Surface';

type PopoverContextValue = {
  register: (closeFn: () => void) => () => void;
};

const PopoverContext = createContext<PopoverContextValue | null>(null);

// Tracks every currently-mounted top-level popover (one whose React tree has no
// surrounding popover). When a new one mounts, it closes the others so opening
// an unrelated popover collapses the existing chain instead of leaving stale
// parents behind. Nested popovers stay handled by parent→child cascade below.
const openTopLevelPopovers = new Set<() => void>();

type PopoverRootContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
};

const PopoverRootContext = createContext<PopoverRootContextValue | null>(null);

export interface PopoverRootProps {
  /** Trigger + popover (+ optional close) elements. */
  children: ReactNode;
  /** Initial open state (uncontrolled). Default `false`. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. When provided, internal state is bypassed. */
  open?: boolean;
  /** Fires whenever the open state should change (clicks on trigger, outside-clicks, escape). */
  onOpenChange?: (open: boolean) => void;
}

/**
 * State container for the `Popover` + `PopoverTrigger` + `Popover` compound. Holds the open
 * state and the anchor ref so a `PopoverTrigger` can register the anchor element and a sibling
 * `Popover` can read both via context.
 *
 * Use this when you want the trigger and the popover to be siblings in JSX (Radix-style):
 *
 * ```tsx
 * <PopoverRoot>
 *   <PopoverTrigger><Button>Open</Button></PopoverTrigger>
 *   <Popover>...</Popover>
 * </PopoverRoot>
 * ```
 *
 * Skip this and pass `open`/`onOpenChange`/`anchorRef` directly to `<Popover>` if you'd rather
 * control state yourself.
 */
export const PopoverRoot = ({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: PopoverRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const anchorRef = useRef<HTMLElement | null>(null);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverRootContext.Provider value={{ open, setOpen, anchorRef }}>
      {children}
    </PopoverRootContext.Provider>
  );
};

export interface PopoverTriggerProps {
  /** Single React element to use as the trigger. Must accept `ref` and `onClick`. */
  children: ReactNode;
}

/**
 * Wraps a single child element to act as the popover trigger. **Clones** the child to attach:
 * - a `ref` callback that registers the element as the popover's anchor (composed with any
 *   existing ref on the child),
 * - an `onClick` handler that toggles the surrounding `PopoverRoot`'s open state (composed
 *   with any existing `onClick`).
 *
 * No-ops (renders the child as-is) when used outside a `PopoverRoot`. Expects exactly one
 * React element child that accepts `ref` and `onClick`.
 */
export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
  const ctx = useContext(PopoverRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalRef = child?.props?.ref;
  const originalOnClick = child?.props?.onClick;

  const setRef = (el: HTMLElement | null) => {
    ctx.anchorRef.current = el;
    if (typeof originalRef === 'function') originalRef(el);
    else if (
      originalRef &&
      typeof originalRef === 'object' &&
      'current' in originalRef
    ) {
      (originalRef as React.RefObject<any>).current = el;
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(!ctx.open);
  };

  return cloneElement(child, { ref: setRef, onClick });
};

export interface PopoverCloseProps {
  /** Single React element to use as the close affordance. Must accept `onClick`. */
  children: ReactNode;
}

/**
 * Wraps a single child element to close the surrounding popover when clicked. **Clones** the
 * child to attach an `onClick` handler that flips the surrounding `PopoverRoot`'s open state
 * to `false` (composed with any existing `onClick` on the child).
 *
 * ```tsx
 * <PopoverRoot>
 *   <PopoverTrigger><Button>Open</Button></PopoverTrigger>
 *   <Popover>
 *     ...
 *     <PopoverClose><Button>Done</Button></PopoverClose>
 *   </Popover>
 * </PopoverRoot>
 * ```
 *
 * No-ops (renders the child as-is) when used outside a `PopoverRoot`.
 */
export const PopoverClose = ({ children }: PopoverCloseProps) => {
  const ctx = useContext(PopoverRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(false);
  };

  return cloneElement(child, { onClick });
};

export type PopoverPosition =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'right-start'
  | 'right'
  | 'right-end';
export type PopoverOffset = OffsetValue | [OffsetValue, OffsetValue];
interface PositionConfig {
  area: string;
  justifySelf?: string;
  alignSelf?: string;
  origin: string;
  // [mainAxis, crossAxis] - main pushes away from anchor, cross shifts along anchor edge
  offsetProperties: [string, string];
}

const POSITIONS: Record<PopoverPosition, PositionConfig> = {
  'top-start': {
    area: 'top center',
    justifySelf: 'start',
    origin: 'origin-bottom-left',
    offsetProperties: ['marginBottom', 'marginLeft'],
  },
  top: {
    area: 'top center',
    origin: 'origin-bottom',
    offsetProperties: ['marginBottom', 'marginLeft'],
  },
  'top-end': {
    area: 'top center',
    justifySelf: 'end',
    origin: 'origin-bottom-right',
    offsetProperties: ['marginBottom', 'marginRight'],
  },
  'bottom-start': {
    area: 'bottom center',
    justifySelf: 'start',
    origin: 'origin-top-left',
    offsetProperties: ['marginTop', 'marginLeft'],
  },
  bottom: {
    area: 'bottom center',
    origin: 'origin-top',
    offsetProperties: ['marginTop', 'marginLeft'],
  },
  'bottom-end': {
    area: 'bottom center',
    justifySelf: 'end',
    origin: 'origin-top-right',
    offsetProperties: ['marginTop', 'marginRight'],
  },
  'left-start': {
    area: 'center left',
    alignSelf: 'start',
    origin: 'origin-top-right',
    offsetProperties: ['marginRight', 'marginTop'],
  },
  left: {
    area: 'center left',
    origin: 'origin-right',
    offsetProperties: ['marginRight', 'marginTop'],
  },
  'left-end': {
    area: 'center left',
    alignSelf: 'end',
    origin: 'origin-bottom-right',
    offsetProperties: ['marginRight', 'marginBottom'],
  },
  'right-start': {
    area: 'center right',
    alignSelf: 'start',
    origin: 'origin-top-left',
    offsetProperties: ['marginLeft', 'marginTop'],
  },
  right: {
    area: 'center right',
    origin: 'origin-left',
    offsetProperties: ['marginLeft', 'marginTop'],
  },
  'right-end': {
    area: 'center right',
    alignSelf: 'end',
    origin: 'origin-bottom-left',
    offsetProperties: ['marginLeft', 'marginBottom'],
  },
};

type OffsetValue = number | string;

const resolveOffset = (value: OffsetValue, marginProp: string): string => {
  if (typeof value === 'number') return `${value}px`;
  if (value.endsWith('%')) {
    const fraction = parseFloat(value) / 100;
    const dim =
      marginProp === 'marginTop' || marginProp === 'marginBottom'
        ? 'height'
        : 'width';
    return `calc(anchor-size(${dim}) * ${fraction})`;
  }
  return value;
};

type PopoverOwnProps = {
  /** Controlled open state. When omitted, falls back to the surrounding `PopoverRoot` state, then `false`. */
  open?: boolean;
  /** Fires whenever the open state should change. When omitted, falls back to the `PopoverRoot` setter. */
  onOpenChange?: (open: boolean) => void;

  /** Extra classes applied to the popover root `Surface`. */
  className?: string;
  /** Extra classes applied to the inner scrollable content area. Default includes `max-h-[70vh] overflow-auto`. */
  contentClassName?: string;
  /**
   * Ref to the element the popover should anchor against. Defaults to the anchor registered by `PopoverRoot` + `PopoverTrigger`.
   *
   * CSS anchor positioning is used - an `anchor-name` is auto-applied to the element if it doesn't already have one.
   */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /**
   * Static rect (or ref to one) to anchor against when there's no DOM anchor element (e.g. for a context menu opened at a pointer position). Ignored if `anchorRef.current` exists.
   */
  anchorRect?: DOMRect | React.RefObject<DOMRect>;
  /**
   * Portal target. CSS selector string (default `'#app, #__next, #root'` - first match wins), or `false` to render inline without portalling.
   */
  root?: string | boolean;
  /** Anchor side + alignment. See `PopoverPosition`. Default `'bottom'`. */
  position?: PopoverPosition;
  /**
   * Spacing from anchor. Either a single value (main axis only) or `[main, cross]`.
   *
   * Numbers are pixels; strings pass through (e.g. `'8px'`, `'50%'` - `%` resolves against `anchor-size(width|height)` depending on the position).
   */
  offset?: OffsetValue | [OffsetValue, OffsetValue];
  /**
   * Minimum gap (px) the popover should keep from the viewport edge when it would otherwise be clamped there. Default `4`. Set to `0` to disable.
   */
  viewportMargin?: number;
  /** Render a backdrop behind the popover. Default `false`. */
  backdrop?: boolean;
  /** Make the backdrop transparent (still captures clicks for outside-close). */
  backdropTransparent?: boolean;
  /** Accent color token (`Color` enum). Sets the popover's `cladd-color-{name}` class - used by border/ring/text helpers. */
  color?: Color;
  /** Popover content. */
  children?: ReactNode;
  /**
   * Forwarded to the underlying `Surface` as `level`. Default depends on theme: `1` for light theme, `undefined` (parent + 1) for dark theme.
   */
  surfaceLevel?: number | string;
  /** Surface variant. Default depends on theme: `'gradient'` for dark, `'solid'` for light. */
  variant?: SurfaceVariant;
  /** Outline ring on the popover surface. Default `true` for non-light themes. */
  outline?: boolean;
  /** Set to `true` when the popover is rendered inside a React `lazy()` + `Suspense` boundary so it opens on the next tick (after the lazy chunk has resolved and mounted). */
  lazy?: boolean;
  /** Default `true`. */
  closeOnBackdropClick?: boolean;
  /** Default `true`. Suppressed automatically when this popover has a child popover/dialog open. */
  closeOnEscape?: boolean;
  /** Fires when the open transition begins (after `open` flips to `true`, before the animation). */
  onOpen?: () => void;
  /** Fires after the open transition completes (`transitionend` on the surface). */
  onOpened?: () => void;
  /** Fires when the close transition begins (after `open` flips to `false`, before the animation). */
  onClose?: () => void;
  /** Fires after the close transition completes - use for unmount/cleanup work tied to dismissal. */
  onClosed?: () => void;
  /** Forwarded to the popover surface root element. */
  ref?: React.Ref<HTMLElement>;
};

export type PopoverProps = PopoverOwnProps &
  Omit<SurfaceProps, keyof PopoverOwnProps>;

/** Shape of `Popover` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type PopoverDefaultProps = Partial<
  Omit<
    PopoverOwnProps,
    | 'open'
    | 'onOpenChange'
    | 'anchorRef'
    | 'anchorRect'
    | 'children'
    | 'ref'
    | 'onOpen'
    | 'onOpened'
    | 'onClose'
    | 'onClosed'
  >
>;

type PopoverInnerProps = Omit<PopoverProps, 'open' | 'onOpenChange'> & {
  phase?: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
};

const PopoverInner = (props: PopoverInnerProps) => {
  const theme = useTheme();
  const overlaysRoot = useOverlaysRoot();
  const {
    phase = 'closed',
    onPhaseChange = () => {},

    className = '',
    contentClassName = '',
    anchorRef,
    anchorRect,
    root = overlaysRoot,
    position = 'bottom',
    offset,
    viewportMargin = 4,
    backdrop = false,
    backdropTransparent = false,
    color,
    children,
    surfaceLevel = theme === 'light' ? 1 : undefined,
    variant = 'gradient',
    outline = theme === 'dark',
    lazy = false,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    onOpen = () => {},
    onOpened = () => {},
    onClose = () => {},
    onClosed = () => {},
    ref,
    ...rest
  } = props;

  const anchorNameRef = useRef('');

  // Reuse existing anchor-name if target already has one (e.g. from Tooltip),
  // otherwise generate a shared one
  if (anchorRef?.current) {
    const existing = anchorRef.current.style.getPropertyValue('anchor-name');
    if (existing) {
      anchorNameRef.current = existing;
    }
  }
  if (!anchorNameRef.current) {
    anchorNameRef.current = `--anchor-${Math.random().toString(36).slice(2, 8)}`;
  }
  const anchorName = anchorNameRef.current;

  const getAnchorRect = (): DOMRect | null => {
    if (!anchorRect) return null;
    if (typeof anchorRect === 'object' && 'current' in anchorRect)
      return (anchorRect as React.RefObject<DOMRect>).current;
    return anchorRect as DOMRect;
  };

  const elRef = useRef<HTMLElement>(null);
  const containerElRef = useRef<HTMLDivElement>(null);
  const wasPointerDown = useRef(false);
  // A press that starts inside must not dismiss on release outside (drag-out).
  const pointerDownInsideRef = useRef(false);

  const positionConfig = POSITIONS[position] || POSITIONS['right-start'];

  const { opened, open, close } = useModalUtils({
    lazy,
    phase,
    onPhaseChange,
    onOpen,
    onOpened,
    onClose,
    onClosed,
    transitionEndElRef: elRef as React.RefObject<HTMLElement>,
    closeOnEscape() {
      if (!closeOnEscape) return false;
      if (containerElRef.current && containerElRef.current.nextElementSibling) {
        const nextEl = containerElRef.current.nextElementSibling;
        if (nextEl.matches('.cladd-popover, .cladd-dialog')) {
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

  // Click-outside handling
  const onDocumentClick = (e: MouseEvent) => {
    if (!opened) return;
    const target = e.target as HTMLElement;
    if (containerElRef.current && containerElRef.current.contains(target))
      return;
    const targetPopoverEl = target.closest('.cladd-popover');
    if (targetPopoverEl) {
      const isParentPopoverClicked =
        targetPopoverEl &&
        containerElRef.current &&
        targetPopoverEl.nextElementSibling === containerElRef.current;
      if (!isParentPopoverClicked) {
        return;
      }
    }

    if (!wasPointerDown.current) return;
    if (pointerDownInsideRef.current) return;
    if (!target.closest('body')) return;
    if (!closeOnBackdropClick) return;
    if (
      containerElRef.current &&
      containerElRef.current.nextElementSibling &&
      containerElRef.current.nextElementSibling.classList.contains(
        'cladd-popover',
      )
    ) {
      return;
    }
    close();
  };

  const onPointerDown = (e: PointerEvent) => {
    wasPointerDown.current = true;
    const target = e.target as Node | null;
    pointerDownInsideRef.current = !!(
      target && containerElRef.current?.contains(target)
    );
  };

  useEffect(() => {
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('click', onDocumentClick);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('click', onDocumentClick);
    };
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      open();
    });
  }, []);

  // Track popovers that are React-tree children of this one
  const parentPopover = useContext(PopoverContext);
  const childCloseFns = useRef<Set<() => void>>(new Set());
  const popoverContextValue = useRef<PopoverContextValue>({
    register: (closeFn: () => void) => {
      childCloseFns.current.add(closeFn);
      return () => {
        childCloseFns.current.delete(closeFn);
      };
    },
  }).current;

  // Keep latest close in a ref so the registered callback always calls the current one
  const closeRef = useRef(close);
  closeRef.current = close;

  // Register this popover's close with its parent popover (if any)
  useEffect(() => {
    if (!parentPopover) return;
    return parentPopover.register(() => closeRef.current());
  }, [parentPopover]);

  // Top-level popovers (no parent popover in the React tree) are mutually
  // exclusive: mounting a new one closes any others, which cascades through
  // their nested chains via the parent→child registration above.
  useEffect(() => {
    if (parentPopover) return;
    const closeFn = () => closeRef.current();
    openTopLevelPopovers.forEach((other) => other());
    openTopLevelPopovers.add(closeFn);
    return () => {
      openTopLevelPopovers.delete(closeFn);
    };
  }, [parentPopover]);

  // Cascade close to registered child popovers when this one starts closing
  useEffect(() => {
    if (phase !== 'closing') return;
    childCloseFns.current.forEach((closeChild) => closeChild());
  }, [phase]);

  const [mainOffset, crossOffset] = Array.isArray(offset)
    ? offset
    : [offset || 0, 0];
  const [mainProp, crossProp] = positionConfig.offsetProperties;
  const oppositeMargin: Record<string, string> = {
    marginTop: 'marginBottom',
    marginBottom: 'marginTop',
    marginLeft: 'marginRight',
    marginRight: 'marginLeft',
  };
  const isCentered = !positionConfig.justifySelf && !positionConfig.alignSelf;
  const vm = viewportMargin > 0 ? `${viewportMargin}px` : undefined;

  const popoverStyle = {
    positionAnchor: anchorName,
    positionArea: positionConfig.area,
    positionTryFallbacks: 'flip-block, flip-inline, flip-block flip-inline',
    justifySelf: positionConfig.justifySelf,
    alignSelf: positionConfig.alignSelf,
    ...(vm
      ? {
          [oppositeMargin[mainProp]]: vm,
          [oppositeMargin[crossProp]]: vm,
          ...(isCentered ? { [crossProp]: vm } : {}),
        }
      : {}),
    ...(mainOffset ? { [mainProp]: resolveOffset(mainOffset, mainProp) } : {}),
    ...(crossOffset
      ? { [crossProp]: resolveOffset(crossOffset, crossProp) }
      : {}),
  } as React.CSSProperties;

  const content = (
    <PopoverContext.Provider value={popoverContextValue}>
      <div
        className="cladd-popover"
        ref={containerElRef as React.RefObject<HTMLDivElement>}
      >
        {backdrop && (
          <Backdrop
            onClick={() => {
              if (closeOnBackdropClick) close();
            }}
            className={cn(
              'duration-200',
              backdropTransparent ? 'bg-transparent' : 'bg-cladd-backdrop/50',
              opened ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
        {anchorRect &&
          !anchorRef?.current &&
          (() => {
            const rect = getAnchorRect();
            return rect ? (
              <div
                style={
                  {
                    position: 'fixed',
                    pointerEvents: 'none',
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    anchorName: anchorName,
                  } as React.CSSProperties
                }
              />
            ) : null;
          })()}
        <Surface
          data-part="content"
          data-open={opened || undefined}
          data-position={position}
          ref={(el: HTMLElement) => {
            elRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref && 'current' in ref)
              (ref as React.RefObject<HTMLElement | null>).current = el;
          }}
          style={popoverStyle}
          className={cn(
            'pointer-events-auto absolute z-50 flex w-40 max-w-[calc(100vw-16px)] rounded-cladd-popover shadow-cladd-popover transition-[opacity,transform,scale] duration-0',
            opened && 'scale-100 opacity-100 ease-[cubic-bezier(0,1,0,1.025)]',
            (phase === 'opened' || (phase === 'opening' && opened)) &&
              'duration-300',
            phase === 'closing' && 'duration-200 ease-in-out!',
            (phase === 'closing' || !opened) && 'scale-0 opacity-0',
            positionConfig.origin,
            className,
          )}
          color={color}
          level={surfaceLevel}
          variant={variant}
          outline={outline}
          contentClassName={cn(
            'h-auto max-h-[70vh] w-full overflow-auto',
            contentClassName,
          )}
          {...rest}
        >
          {children}
        </Surface>
      </div>
    </PopoverContext.Provider>
  );

  return root
    ? createPortal(content, document.querySelector(root as string) as Element)
    : content;
};

export const Popover = (props: PopoverProps) => {
  const { open, onOpenChange, anchorRef, ...rest } = useComponentDefaults(
    'Popover',
    props,
  );
  const ctx = useContext(PopoverRootContext);
  const effectiveOpen = open ?? ctx?.open ?? false;
  const effectiveOnOpenChange = onOpenChange ?? ctx?.setOpen ?? (() => {});
  const effectiveAnchorRef = anchorRef ?? ctx?.anchorRef;
  return (
    <ModalController open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <PopoverInner anchorRef={effectiveAnchorRef} {...rest} />
    </ModalController>
  );
};
