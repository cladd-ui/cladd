import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap } from '../hooks/use-focus-trap';
import { useModalUtils } from '../hooks/use-modal-utils';
import { useOverlaysRoot } from '../hooks/use-overlays-root';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { Backdrop } from './Backdrop';
import { Button } from './Button';
import { CloseIcon } from './icons/CloseIcon';
import { ModalController, ModalPhase } from './ModalController';
import { Surface } from './Surface';

type PopupRootContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const PopupRootContext = createContext<PopupRootContextValue | null>(null);

export interface PopupRootProps {
  /** Trigger + popup (+ optional close) elements. */
  children: ReactNode;
  /** Initial open state (uncontrolled). Default `false`. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. When provided, internal state is bypassed. */
  open?: boolean;
  /** Fires whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * State container for the `Popup` + `PopupTrigger` + `Popup` compound. Use when you want
 * the trigger and the popup to be siblings in JSX:
 *
 * ```tsx
 * <PopupRoot>
 *   <PopupTrigger><Button>Open</Button></PopupTrigger>
 *   <Popup>...</Popup>
 * </PopupRoot>
 * ```
 *
 * Skip this and pass `open`/`onOpenChange` directly to `<Popup>` if you'd rather control state.
 */
export const PopupRoot = ({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: PopupRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopupRootContext.Provider value={{ open, setOpen }}>
      {children}
    </PopupRootContext.Provider>
  );
};

export interface PopupTriggerProps {
  /** Single React element to clone as the trigger. Must accept `onClick`. */
  children: ReactNode;
}

/**
 * Wraps a single child element to act as the popup trigger. **Clones** the child to attach
 * an `onClick` handler that toggles the surrounding `PopupRoot`'s open state (composed with
 * any existing `onClick` on the child).
 *
 * No-ops (renders the child as-is) when used outside a `PopupRoot`.
 */
export const PopupTrigger = ({ children }: PopupTriggerProps) => {
  const ctx = useContext(PopupRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(!ctx.open);
  };

  return cloneElement(child, { onClick });
};

export interface PopupCloseProps {
  /** Single React element to clone as the close affordance. Must accept `onClick`. */
  children: ReactNode;
}

/**
 * Wraps a single child element to close the surrounding popup when clicked. **Clones** the
 * child to attach an `onClick` handler that flips the surrounding `PopupRoot`'s open state
 * to `false` (composed with any existing `onClick` on the child).
 *
 * ```tsx
 * <PopupRoot>
 *   <PopupTrigger><Button>Open</Button></PopupTrigger>
 *   <Popup>
 *     ...
 *     <PopupClose><Button>Close</Button></PopupClose>
 *   </Popup>
 * </PopupRoot>
 * ```
 *
 * No-ops (renders the child as-is) when used outside a `PopupRoot`.
 */
export const PopupClose = ({ children }: PopupCloseProps) => {
  const ctx = useContext(PopupRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(false);
  };

  return cloneElement(child, { onClick });
};

export interface PopupProps {
  /** Controlled open state. When omitted, falls back to the surrounding `PopupRoot` state, then `false`. */
  open?: boolean;
  /** Fires whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Fires when the open transition begins. */
  onOpen?: () => void;
  /** Fires after the open transition completes (`transitionend`). */
  onOpened?: () => void;
  /** Fires when the close transition begins. */
  onClose?: () => void;
  /** Fires after the close transition completes. */
  onClosed?: () => void;
  /** Extra classes applied to the outer popup container (positioning + overflow). */
  className?: string;
  /** Portal target selector. Default `'#app, #__next, #root'`. */
  root?: string;
  /** Selector for the container made `inert` while the popup is open. Default `'.app-container'`. */
  inertContainer?: string;
  /** Set to `true` when the popup is rendered inside a React `lazy()` + `Suspense` boundary so it opens on the next tick (after the lazy chunk has resolved and mounted). Default `false`. */
  lazy?: boolean;
  /** Extra classes for the inner content column (where children + header live). */
  contentClassName?: string;
  /** Extra classes for the scrollable wrap that holds the content column. */
  wrapClassName?: string;
  /** Render the top header (with close button + slots). Default `true`. */
  header?: boolean;
  /** Extra classes for the header row. */
  headerClassName?: string;
  /** Slot rendered on the left side of the header (e.g. title, breadcrumbs). */
  headerLeft?: ReactNode;
  /** Slot rendered on the right side of the header, before the auto-rendered close button. */
  headerRight?: ReactNode;
  /** Render the backdrop. Default `true`. */
  backdrop?: boolean;
  /** Extra classes for the backdrop element. */
  backdropClassName?: string;
  /** Default `true`. */
  closeOnBackdropClick?: boolean;
  /** Default `true`. Suppressed automatically when this popup contains another popover/dialog/popup, or task-edit overlays. */
  closeOnEscape?: boolean;
  /** Render the auto close button in the header. Default `true`. */
  closeButton?: boolean;
  /** Override the close-button glyph. Default is an inline SVG "X". */
  closeButtonContent?: ReactNode;
  /** Accent color token for the close button. */
  closeButtonColor?: Color;
  /** Fires before the popup closes from the close-button click. The popup also closes regardless. */
  onCloseButtonClick?: () => void;
  /**
   * Imperative escape hatch - assigned the popup's `close()` function so callers can dismiss it from outside the React tree (e.g. from a non-child callback).
   *
   * The ref's `.current` is set on mount.
   */
  closeRef?: React.RefObject<(() => void) | null>;
  /** ARIA label for the dialog role. Use when there's no visible title. */
  'aria-label'?: string;
  /** Id of the element labelling this popup. */
  'aria-labelledby'?: string;
  /** Id of the element describing this popup. */
  'aria-describedby'?: string;
  /** Popup content. Rendered inside the inner content column, after the header. */
  children?: ReactNode;
  /** Slot rendered above the header, inside the popup content wrapper. */
  beforeContent?: ReactNode;
}

type PopupInnerProps = Omit<PopupProps, 'open' | 'onOpenChange'> & {
  phase?: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
};

function PopupInner(props: PopupInnerProps) {
  const overlaysRoot = useOverlaysRoot();
  const {
    phase = 'closed',
    onPhaseChange = () => {},

    className = '',
    root = overlaysRoot,
    inertContainer = '.app-container',
    lazy = false,
    contentClassName = '',
    wrapClassName = '',
    header = true,
    headerClassName = '',
    headerLeft,
    headerRight,
    onOpen = () => {},
    onOpened = () => {},
    onClose = () => {},
    onClosed = () => {},
    backdrop = true,
    backdropClassName = '',
    closeOnBackdropClick = true,
    closeOnEscape = true,
    closeButton = true,
    closeButtonContent = <CloseIcon />,
    closeButtonColor,
    onCloseButtonClick = () => {},

    closeRef,
    children,
    beforeContent,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  } = props;

  const containerElRef = useRef<HTMLDivElement>(null);
  const transitionEndElRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({
    touched: false,
    moved: false,
    target: null as EventTarget | null,
    startPositions: [0, 0],
    distance: 0,
  });
  const { opened, open, close } = useModalUtils({
    phase,
    onPhaseChange,
    onOpen,
    onOpened,
    onClose,
    onClosed,
    transitionEndElRef: transitionEndElRef as React.RefObject<HTMLElement>,
    lazy,
    closeOnEscape() {
      if (!closeOnEscape) return false;
      if (containerElRef.current && containerElRef.current.nextElementSibling) {
        const nextEl = containerElRef.current.nextElementSibling;
        if (nextEl.matches('.cladd-popover, .cladd-dialog, .cladd-popup')) {
          return false;
        }
      }
      return true;
    },
  });

  if (closeRef && 'current' in closeRef) {
    closeRef.current = close;
  }

  const getPreviousPopups = () => {
    if (containerElRef.current) {
      const allPopups = [
        ...(containerElRef.current.parentElement as HTMLElement).children,
      ].filter((el) => el.classList.contains('cladd-popup'));
      const previousPopups = allPopups.slice(
        0,
        allPopups.indexOf(containerElRef.current),
      );
      return previousPopups;
    }
    return [];
  };
  useEffect(() => {
    open();
    return () => {
      if (!inertContainer) return;
      if (
        document.querySelector(inertContainer) &&
        document.querySelectorAll('.cladd-popup').length === 0
      ) {
        (document.querySelector(inertContainer) as HTMLElement).inert = false;
      }
    };
  }, []);

  useEffect(() => {
    if (containerElRef.current) {
      const previousPopups = getPreviousPopups();
      previousPopups.forEach((popupEl, index) => {
        const step = opened
          ? previousPopups.length - index
          : previousPopups.length - index - 1;
        const popupContentEl = popupEl.querySelector(
          '.cladd-popup-content',
        ) as HTMLElement;
        popupContentEl.style.transformOrigin = 'top';
        popupContentEl.style.transform = `translateY(-${16 * step}px) scale(${1 - 0.1 * step})`;
        popupContentEl.style.transitionDuration = '400ms';
      });
      if (inertContainer && document.querySelector(inertContainer)) {
        if (opened) {
          (document.querySelector(inertContainer) as HTMLElement).inert = true;
        } else if (previousPopups.length === 0) {
          (document.querySelector(inertContainer) as HTMLElement).inert = false;
        }
      }
    }
  }, [opened]);

  useFocusTrap({
    active: opened,
    setInitialFocus: false,
    containerRef: containerElRef,
  });

  const onPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (e.pointerType !== 'mouse') return;
    if (e.type === 'pointerdown') {
      pointer.touched = true;
      pointer.moved = false;
      pointer.target = e.target;
      pointer.startPositions = [e.pageX, e.pageY];
    }
    if (e.type === 'pointermove') {
      pointer.moved = true;
      const [x, y] = pointer.startPositions;
      const { pageX, pageY } = e;

      pointer.distance = ((pageX - x) ** 2 + (pageY - y) ** 2) ** 0.5;
    }
    if (e.type === 'pointerup') {
      if (pointer.distance < 10) {
        pointer.moved = false;
      }
    }
  };
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!e.target) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('.cladd-popup-content, .cladd-popover, .cladd-dialog') ||
      !document.documentElement.contains(target)
    ) {
      return;
    }
    const isInAnotherPopup =
      target.closest('.cladd-popup') &&
      containerElRef.current !== target.closest('.cladd-popup');
    if (isInAnotherPopup) return;
    const pointer = pointerRef.current;
    if (
      (pointer.target && pointer.target !== target) ||
      (pointer.target && pointer.moved)
    ) {
      return;
    }

    if (!closeOnBackdropClick) return;
    close();
  };

  const content = (
    <div
      className={cn(
        'cladd-popup fixed inset-0 z-50 flex flex-col justify-center overflow-hidden',
        opened && 'popup-opened',
        className,
      )}
      data-open={opened || undefined}
      ref={containerElRef}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
      onPointerUp={onPointer}
      onClick={onClick}
    >
      {backdrop && (
        <Backdrop
          className={cn(
            'pointer-events-none duration-200',
            opened ? 'opacity-100 duration-500' : 'opacity-0',
            backdropClassName,
          )}
        />
      )}

      <div
        data-part="wrapper"
        className={cn(
          'cladd-popup-wrapper absolute inset-0 z-50 h-fit max-h-full self-center overflow-auto pt-safe-12 pb-safe-12',
          opened && 'duration-500 ease-[cubic-bezier(0,1,0.2,1)]',
          !opened &&
            'translate-y-[100vh] scale-x-65 duration-200 ease-[ease-in]',
          wrapClassName,
        )}
        ref={transitionEndElRef}
      >
        <div
          data-part="content"
          data-open={opened || undefined}
          className={cn(
            'cladd-popup-content pointer-events-auto relative mx-auto flex min-h-full w-full max-w-162 flex-col justify-center gap-2',
            contentClassName,
          )}
        >
          {beforeContent}
          {/* TOP HEADER */}
          {header && (
            <div
              data-part="header"
              className={cn(
                'flex items-end justify-between px-4',
                headerClassName,
              )}
            >
              {/* HEADER LEFT */}
              <div
                data-part="header-left"
                className="flex min-w-0 shrink items-end gap-4"
              >
                {headerLeft}
              </div>
              {/* HEADER RIGHT */}
              {(headerRight || closeButton) && (
                <div
                  data-part="header-right"
                  className="flex items-center gap-2"
                >
                  {headerRight}
                  {closeButton && (
                    <Surface
                      data-part="close-wrapper"
                      className="rounded-full"
                      contentClassName="flex items-center p-1"
                      variant="gradient"
                      color={closeButtonColor}
                      outline
                      level={1}
                    >
                      {/* CLOSE BUTTON */}
                      <Button
                        data-part="close"
                        contentClassName="text-cladd-fg-soft"
                        rounded
                        variant="transparent"
                        outline={false}
                        onClick={() => {
                          onCloseButtonClick();
                          close();
                        }}
                      >
                        {closeButtonContent}
                      </Button>
                    </Surface>
                  )}
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );

  return root
    ? createPortal(content, document.querySelector(root) as HTMLElement)
    : content;
}

export const Popup = ({ open, onOpenChange, ...rest }: PopupProps) => {
  const ctx = useContext(PopupRootContext);
  const effectiveOpen = open ?? ctx?.open ?? false;
  const effectiveOnOpenChange = onOpenChange ?? ctx?.setOpen ?? (() => {});
  return (
    <ModalController open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <PopupInner {...rest} />
    </ModalController>
  );
};
