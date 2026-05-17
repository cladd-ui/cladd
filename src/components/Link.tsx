import {
  useRef,
  ElementType,
  Ref,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';

interface LinkOwnProps<C extends ElementType = 'button'> {
  /** Accent color token */
  color?: Color;
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
  /** Renders a `FocusableLayer` ring on keyboard focus. Defaults to `true`. */
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

/** Shape of `Link` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type LinkDefaultProps = Partial<
  Omit<LinkOwnProps, 'as' | 'ref' | 'children'>
>;

export const Link = <C extends ElementType = 'button'>(props: LinkProps<C>) => {
  const {
    children,
    className = '',
    disabled = false,
    readOnly = false,
    as,
    color,
    focusable = true,
    onClick,
    href,
    ref,
    ...rest
  } = useComponentDefaults('Link', props);
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
      tabIndex={focusable && !disabled && !readOnly ? 0 : -1}
      className={cn(
        'group/cladd-link cladd-link relative appearance-none outline-0 select-none focus:ring-0 focus:outline-0',
        (disabled || readOnly) && 'pointer-events-none',
        !disabled &&
          !readOnly &&
          'cursor-pointer duration-200 active:opacity-50 active:duration-0',
        disabled && 'opacity-50',
        color && `cladd-color-${color} text-cladd-primary`,
        className,
      )}
      readOnly={readOnly}
      disabled={disabled}
      onClick={onClick}
      href={href}
      {...rest}
    >
      {children}
      {focusable && !disabled && !readOnly && (
        <FocusableLayer group="link" color={color} className="rounded-cladd" />
      )}
    </Component>
  );
};
