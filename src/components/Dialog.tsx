import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  ReactNode,
  Ref,
  MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';

import { useAccentColor } from '../hooks/use-accent-color';
import { useDevice } from '../hooks/use-device';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { useModalUtils } from '../hooks/use-modal-utils';
import { useTheme } from '../hooks/use-theme';
import { cn } from '../shared/cn';
import { nextTick } from '../shared/next-tick';
import { Color } from '../types';
import { Backdrop } from './Backdrop';
import { Button } from './Button';
import { Input } from './Input';
import { ModalController, ModalPhase } from './ModalController';
import { Surface, SurfaceVariant } from './Surface';

type DialogRootContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogRootContext = createContext<DialogRootContextValue | null>(null);

/**
 * State container for the `Dialog` + `DialogTrigger` + `Dialog` compound. Use when you want
 * the trigger and the dialog to be siblings in JSX:
 *
 * ```tsx
 * <DialogRoot>
 *   <DialogTrigger><Button>Confirm</Button></DialogTrigger>
 *   <Dialog title="..." />
 * </DialogRoot>
 * ```
 *
 * Skip this and pass `open`/`onOpenChange` directly to `<Dialog>` if you'd rather control state.
 */
export const DialogRoot = ({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: {
  children: ReactNode;
  /** Initial open state (uncontrolled). Default `false`. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. When provided, internal state is bypassed. */
  open?: boolean;
  /** Fires whenever the open state should change (trigger click, outside click, escape, button press). */
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DialogRootContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogRootContext.Provider>
  );
};

/**
 * Wraps a single child element to act as the dialog trigger. **Clones** the child to attach
 * an `onClick` handler that toggles the surrounding `DialogRoot`'s open state (composed with
 * any existing `onClick` on the child).
 *
 * No-ops (renders the child as-is) when used outside a `DialogRoot`. Unlike `PopoverTrigger`,
 * this does **not** register an anchor ref - dialogs are centered on the viewport, not anchored.
 */
export const DialogTrigger = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(DialogRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(!ctx.open);
  };

  return cloneElement(child, { onClick });
};

/**
 * Wraps a single child element to close the surrounding dialog when clicked. **Clones** the
 * child to attach an `onClick` handler that flips the surrounding `DialogRoot`'s open state
 * to `false` (composed with any existing `onClick` on the child).
 *
 * ```tsx
 * <DialogRoot>
 *   <DialogTrigger><Button>Open</Button></DialogTrigger>
 *   <Dialog title="...">
 *     ...
 *     <DialogClose><Button>Dismiss</Button></DialogClose>
 *   </Dialog>
 * </DialogRoot>
 * ```
 *
 * No-ops (renders the child as-is) when used outside a `DialogRoot`.
 */
export const DialogClose = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(DialogRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(false);
  };

  return cloneElement(child, { onClick });
};

export interface DialogProps {
  /** Controlled open state. When omitted, falls back to the surrounding `DialogRoot` state, then `false`. */
  open?: boolean;
  /** Fires whenever the open state should change. When omitted, falls back to the `DialogRoot` setter. */
  onOpenChange?: (open: boolean) => void;
  /** Portal target selector. Default `'#app, #__next, #root'` (first match wins). */
  root?: string;
  /**
   * Selector for the container made `inert` while the dialog is open. Default `'.app-container'`.
   * Used to block focus/interaction with the rest of the app while the modal is shown.
   */
  inertContainer?: string;
  /** Fires after the close transition completes - use for unmount or post-dismiss cleanup. */
  onClosed?: () => void;
  /** Extra classes applied to the dialog root `Surface`. */
  className?: string;
  /** Extra classes applied to the inner content area. Default includes `space-y-4 p-4`. */
  contentClassName?: string;
  /** Title slot. Rendered as `<div>` with `text-base font-semibold`. Auto-wired to `aria-labelledby`. */
  title?: ReactNode;
  /** Body text slot. Rendered as `<div>` with `text-sm leading-relaxed`. Auto-wired to `aria-describedby`. */
  text?: ReactNode;
  /** Defer rendering until first opened, and unmount after close. */
  lazy?: boolean;
  /** Custom button row. Rendered after the auto-generated cancel/confirm buttons (if any). */
  buttons?: ReactNode;
  /**
   * "Type to confirm" guard. When set, renders an `Input` and disables the confirm button until
   * the user types this exact string - used for destructive actions (e.g. type the project name to delete).
   */
  requireConfirmText?: string;
  /** Stop click propagation on backdrop and surface. Useful when the dialog is rendered inside a clickable parent. */
  stopPropagationOnClick?: boolean;
  cancelButtonText?: ReactNode;
  confirmButtonText?: ReactNode;
  /** Color for the cancel button. Default `'neutral'`. */
  cancelButtonColor?: Color;
  /** Color for the confirm button. Default: theme accent color. */
  confirmButtonColor?: Color;
  /** Forwarded to the underlying `Surface` as `level`. Default `1`. */
  surfaceLevel?: string | number;
  /** Surface variant. Default depends on theme: `'solid'` for light, `'gradient'` for dark. */
  variant?: SurfaceVariant;
  /** Outline ring on the dialog surface. Default `true` for dark, `false` for light. */
  outline?: boolean;
  /** Fires after the cancel button is pressed (the dialog also closes). */
  onCancel?: () => void;
  /** Fires after the confirm button is pressed and the `requireConfirmText` guard (if any) is satisfied. */
  onConfirm?: () => void;
  /** Forwarded to the dialog surface root. */
  ref?: Ref<HTMLDivElement>;
  /** ARIA label fallback when no `aria-labelledby`/`title` is set. */
  'aria-label'?: string;
  /** Override the auto-wired label id. By default this is the `title` element's id. */
  'aria-labelledby'?: string;
  /** Override the auto-wired description id. By default this is the `text` element's id. */
  'aria-describedby'?: string;
  /** Custom content rendered between `text` and the optional confirm-input/buttons row. */
  children?: ReactNode;
}

type DialogInnerProps = Omit<DialogProps, 'open' | 'onOpenChange'> & {
  phase?: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
};

const DialogInner = (props: DialogInnerProps) => {
  const theme = useTheme();
  const accentColor = useAccentColor();
  const {
    root = '#app, #__next, #root',
    inertContainer = '.app-container',
    phase = 'closed',
    onPhaseChange = () => {},
    onClosed = () => {},
    className = '',
    contentClassName = '',
    title,
    text,
    lazy,
    buttons,
    requireConfirmText = '',
    stopPropagationOnClick,
    cancelButtonText,
    confirmButtonText,
    cancelButtonColor = 'neutral',
    confirmButtonColor = accentColor,
    surfaceLevel = 1,
    variant = 'gradient',
    outline = theme === 'dark',
    onCancel,
    onConfirm,
    ref,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledByProp,
    'aria-describedby': ariaDescribedByProp,
  } = props;

  const elRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const titleId = `dialog-title-${reactId}`;
  const descId = `dialog-desc-${reactId}`;
  const ariaLabelledBy = ariaLabelledByProp ?? (title ? titleId : undefined);
  const ariaDescribedBy = ariaDescribedByProp ?? (text ? descId : undefined);
  const [inputText, setInputText] = useState('');
  const [_confirmButtonFocused, _setConfirmButtonFocused] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const { opened, open, close } = useModalUtils({
    phase,
    onPhaseChange,
    onClosed,
    lazy,
    transitionEndElRef: elRef,
    onOpen() {
      const device = useDevice();
      if (!requireConfirmText && confirmButtonRef.current && !device.mobile) {
        if (!confirmButtonRef.current) return;

        nextTick(() => {
          confirmButtonRef.current?.focus();
        });
      }
    },
    onOpened() {
      const container = document.querySelector(inertContainer);
      if (container) {
        (container as HTMLElement).inert = true;
      }
    },
    onClose() {
      const container = document.querySelector(inertContainer);
      const otherModals = document.querySelectorAll('.popover, .popup');
      if (container && otherModals.length === 0) {
        (container as HTMLElement).inert = false;
      }
    },
  });

  useEffect(() => {
    open();
  }, []);

  useFocusTrap({
    active: opened,
    containerRef,
    initialFocusRef: requireConfirmText ? undefined : confirmButtonRef,
  });

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref && typeof ref === 'object')
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  const content = (
    <div
      className="dialog"
      ref={setRefs}
      role="dialog"
      aria-modal="true"
      aria-label={!ariaLabelledBy ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <Backdrop
        className={cn('duration-200', opened ? 'opacity-100' : 'opacity-0')}
        onClick={(e: MouseEvent) => {
          if (stopPropagationOnClick) {
            e.stopPropagation();
          }
          close();
        }}
      />
      <Surface
        className={cn(
          `fixed top-1/2 left-1/2 z-50 w-80 max-w-full -translate-x-1/2 -translate-y-1/2 rounded-3xl`,
          !opened && 'scale-75 opacity-0 duration-200 ease-out!',
          opened &&
            'scale-100 opacity-100 duration-500 ease-[cubic-bezier(0,1,0.2,1.1)]',
          className,
        )}
        ref={elRef}
        level={surfaceLevel}
        variant={variant}
        outline={outline}
        contentClassName={cn('space-y-4 p-4', contentClassName)}
        onClick={(e: MouseEvent) => {
          if (stopPropagationOnClick) {
            e.stopPropagation();
          }
        }}
      >
        {title && (
          <div id={titleId} className="text-base font-semibold">
            {title}
          </div>
        )}
        {text && (
          <div id={descId} className="text-sm leading-relaxed">
            {text}
          </div>
        )}
        {children}
        {requireConfirmText && confirmButtonText && (
          <Input
            value={inputText}
            infoMessage={`Type ${requireConfirmText} to confirm`}
            color={confirmButtonColor}
            placeholder={`Type ${requireConfirmText} to confirm`}
            size="xl"
            onChange={(v: string) => setInputText(v)}
          />
        )}
        {(buttons || cancelButtonText || confirmButtonText) && (
          <div className="mt-8! flex flex-wrap items-center justify-end gap-2">
            {cancelButtonText && (
              <Button
                tabIndex={0}
                rounded
                size="lg"
                variant="transparent"
                color={cancelButtonColor}
                contentClassName="px-4"
                onClick={() => {
                  close();
                  onCancel?.();
                }}
              >
                {cancelButtonText}
              </Button>
            )}
            {confirmButtonText && (
              <Button
                ref={confirmButtonRef}
                tabIndex={0}
                color={
                  !(requireConfirmText && inputText !== requireConfirmText)
                    ? confirmButtonColor
                    : undefined
                }
                rounded
                size="lg"
                contentClassName="px-4"
                disabled={
                  !!(requireConfirmText && inputText !== requireConfirmText)
                }
                onClick={() => {
                  close();
                  onConfirm?.();
                }}
              >
                {confirmButtonText}
              </Button>
            )}
            {buttons}
          </div>
        )}
      </Surface>
    </div>
  );

  return root ? createPortal(content, document.querySelector(root)!) : content;
};

export const Dialog = ({ open, onOpenChange, ...rest }: DialogProps) => {
  const ctx = useContext(DialogRootContext);
  const effectiveOpen = open ?? ctx?.open ?? false;
  const effectiveOnOpenChange = onOpenChange ?? ctx?.setOpen ?? (() => {});
  return (
    <ModalController open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <DialogInner {...rest} />
    </ModalController>
  );
};
