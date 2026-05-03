import {
  cloneElement,
  createContext,
  useContext,
  useState,
  ElementType,
  MouseEvent,
  ReactNode,
  Ref,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { useModalUtils } from '../hooks/use-modal-utils';
import { useTheme } from '../hooks/use-theme';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { Button } from './Button';
import { CloseIcon } from './icons/CloseIcon';
import { ModalController, ModalPhase } from './ModalController';
import { Surface, SurfaceVariant } from './Surface';

type ToastRootContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ToastRootContext = createContext<ToastRootContextValue | null>(null);

/**
 * State container for the `Toast` + `ToastTrigger` + `Toast` compound. Less commonly used than
 * the imperative `useToasts()` portal API - prefer the portal for app-wide notifications and
 * use this only when you need a toast tied to a specific trigger element in JSX.
 */
export const ToastRoot = ({
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
  /** Fires whenever the open state should change (trigger click, close button, auto-timeout). */
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
    <ToastRootContext.Provider value={{ open, setOpen }}>
      {children}
    </ToastRootContext.Provider>
  );
};

/**
 * Wraps a single child element to act as the toast trigger. **Clones** the child to attach
 * an `onClick` handler that toggles the surrounding `ToastRoot`'s open state (composed with
 * any existing `onClick` on the child).
 *
 * No-ops (renders the child as-is) when used outside a `ToastRoot`.
 */
export const ToastTrigger = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(ToastRootContext);
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
 * Wraps a single child element to close the surrounding toast when clicked. **Clones** the
 * child to attach an `onClick` handler that flips the surrounding `ToastRoot`'s open state
 * to `false` (composed with any existing `onClick` on the child).
 *
 * ```tsx
 * <ToastRoot>
 *   <ToastTrigger><Button>Notify</Button></ToastTrigger>
 *   <Toast title="...">
 *     <ToastClose><Button>Dismiss</Button></ToastClose>
 *   </Toast>
 * </ToastRoot>
 * ```
 *
 * No-ops (renders the child as-is) when used outside a `ToastRoot`.
 */
export const ToastClose = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(ToastRootContext);
  if (!ctx) return <>{children}</>;

  const child = children as React.ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: React.MouseEvent) => {
    if (originalOnClick) originalOnClick(e);
    ctx.setOpen(false);
  };

  return cloneElement(child, { onClick });
};

export interface ToastProps {
  /** Controlled open state. When omitted, falls back to the surrounding `ToastRoot` state, then `false`. */
  open?: boolean;
  /** Fires whenever the open state should change (close button, auto-timeout, etc.). */
  onOpenChange?: (open: boolean) => void;
  /** Portal target selector. Default `'#app, #__next, #root'`. */
  root?: string;
  /** Fires after the close transition completes - use for unmount or post-dismiss cleanup. */
  onClosed?: () => void;
  /** Extra classes applied to the toast root `Surface`. */
  className?: string;
  /** Title slot. Rendered as a bold line above `text`. */
  title?: ReactNode;
  /** Body text slot. Rendered as a smaller line under `title`. */
  text?: ReactNode;
  /** Icon node rendered before the text content. Pre-rendered. */
  icon?: ReactNode;
  /** Icon component rendered before the text content. Instantiated as `<IconComponent />` (no props). */
  iconComponent?: ElementType<any>;
  /** Stop click propagation on the toast surface. Use when the toast renders inside a clickable parent. */
  stopPropagationOnClick?: boolean;
  /** Render the auto close button on the right. Default `true`. */
  closeButton?: boolean;
  /**
   * Forwarded to the underlying `Surface` as `level`. Default depends on theme:
   * `3` for dark theme, `1` for light theme - keeps the toast visually elevated above page content.
   */
  surfaceLevel?: string | number;
  /** Default `'neutral'`. */
  color?: Color;
  /** Surface variant. Default `'gradient'`. */
  variant?: SurfaceVariant;
  /** Outline ring on the toast surface. Default `true`. */
  outline?: boolean;
  /** Auto-close after this many ms. Pass `0` to disable auto-close. Default `5000`. */
  timeout?: number;
  /** Forwarded to the toast surface root. */
  ref?: Ref<HTMLDivElement>;
  /** Custom content rendered after the title/text block, before the close button. */
  children?: ReactNode;
}

type ToastInnerProps = Omit<ToastProps, 'open' | 'onOpenChange'> & {
  phase?: ModalPhase;
  onPhaseChange?: (phase: ModalPhase) => void;
};

const ToastInner = (props: ToastInnerProps) => {
  const theme = useTheme();
  const {
    root = '#app, #__next, #root',
    phase = 'closed',
    onPhaseChange = () => {},
    onClosed = () => {},
    className = '',
    title,
    text,
    stopPropagationOnClick,
    closeButton = true,
    color = 'neutral',
    icon,
    iconComponent,
    surfaceLevel = theme === 'dark' ? 3 : 1,
    variant = 'gradient',
    outline = true,
    timeout = 5000,
    ref,
    children,
  } = props;

  const elRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<any>(null);
  const { opened, open, close } = useModalUtils({
    phase,
    onPhaseChange,
    onClosed,
    closeOnEscape: false,
    transitionEndElRef: elRef,
  });

  useEffect(() => {
    open();
    if (timeout && timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        close();
      }, timeout);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const IconComponent = iconComponent as ElementType<any>;

  const content = (
    <Surface
      data-open={opened || undefined}
      className={cn(
        `cladd-toast fixed right-safe-4 bottom-safe-4 z-50 max-w-full origin-bottom rounded-3xl`,
        !opened &&
          cn('translate-y-4 scale-75 opacity-0 duration-200 ease-out!'),
        opened &&
          'scale-100 opacity-100 duration-500 ease-[cubic-bezier(0,1,0.2,1.1)] has-[+.cladd-toast+.cladd-toast+.cladd-toast:not(.toast-closing)]:opacity-0 has-[+.cladd-toast+.cladd-toast:not(.toast-closing)]:-translate-y-8 has-[+.cladd-toast+.cladd-toast:not(.toast-closing)]:scale-80 has-[+.cladd-toast:not(.toast-closing)]:origin-top has-[+.cladd-toast:not(.toast-closing)]:-translate-y-4 has-[+.cladd-toast:not(.toast-closing)]:scale-90',
        phase === 'closing' && 'toast-closing',
        className,
      )}
      ref={(el: HTMLDivElement) => {
        elRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          (ref as React.RefObject<HTMLDivElement | null>).current = el;
        }
      }}
      level={surfaceLevel}
      variant={variant}
      outline={outline}
      color={color}
      contentClassName="flex items-center gap-4 pl-4 pr-2 py-2"
      onClick={(e: MouseEvent) => {
        if (stopPropagationOnClick) {
          e.stopPropagation();
        }
      }}
    >
      {icon ||
        (iconComponent && (
          <div
            data-part="icon"
            className="flex shrink-0 items-center [&>svg]:size-4 [&>svg]:shrink-0"
          >
            {icon}
            {iconComponent && <IconComponent />}
          </div>
        ))}
      {(title || text) && (
        <div data-part="content" className="flex flex-col gap-1">
          {title && (
            <div data-part="title" className="text-sm font-semibold">
              {title}
            </div>
          )}
          {text && (
            <div data-part="text" className="text-xs leading-relaxed">
              {text}
            </div>
          )}
        </div>
      )}

      {children}

      {closeButton && (
        <div className="ml-auto">
          <Button
            data-part="close"
            rounded
            outline={false}
            variant="transparent"
            onClick={() => {
              close();
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      )}
    </Surface>
  );

  return root ? createPortal(content, document.querySelector(root)!) : content;
};

export const Toast = ({ open, onOpenChange, ...rest }: ToastProps) => {
  const ctx = useContext(ToastRootContext);
  const effectiveOpen = open ?? ctx?.open ?? false;
  const effectiveOnOpenChange = onOpenChange ?? ctx?.setOpen ?? (() => {});
  return (
    <ModalController open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <ToastInner {...rest} />
    </ModalController>
  );
};
