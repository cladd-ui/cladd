import {
  useRef,
  ElementType,
  Ref,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';

import { cn } from '../shared/cn';

interface LinkOwnProps<C extends ElementType = 'button'> {
  /** Link content. */
  children?: ReactNode;
  /** Extra classes for the link element. */
  className?: string;
  /** Native `disabled` attribute. */
  disabled?: boolean;
  /** Native `readOnly` attribute. */
  readOnly?: boolean;
  /**
   * Polymorphic element. When omitted, defaults to `'a'` if `href` is provided, otherwise `'button'`. Pass an explicit value to override (e.g. a router `Link` component).
   */
  as?: C;
  /** Reserved for focus-ring styling hooks. Default `true`. */
  focusable?: boolean;
  /** Click handler. */
  onClick?: () => void;
  /** Native `href` - when provided, the polymorphic default switches from `'button'` to `'a'`. */
  href?: string;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type LinkProps<C extends ElementType = 'button'> = LinkOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof LinkOwnProps<C>>;

export const Link = <C extends ElementType = 'button'>({
  children,
  className = '',
  disabled = false,
  readOnly = false,
  as,
  focusable = true,
  onClick,
  href,
  ref,
  ...rest
}: LinkProps<C>) => {
  const elRef = useRef(null);

  const Component = (
    typeof as === 'undefined' ? (typeof href === 'string' ? 'a' : 'button') : as
  ) as ElementType;

  return (
    <Component
      ref={(el: any) => {
        elRef.current = el;
        if (ref && typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        'group/cladd-link cladd-link relative cursor-pointer appearance-none duration-200 select-none focus:ring-0 focus:outline-0 active:opacity-50 active:duration-0',
        className,
      )}
      readOnly={readOnly}
      disabled={disabled}
      onClick={onClick}
      href={href}
      {...rest}
    >
      {children}
    </Component>
  );
};
