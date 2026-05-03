import { ReactNode, Ref, ElementType, FC } from 'react';

import { cn } from '../shared/cn';
import { Color } from '../types';
import { Button, ButtonProps, buttonIconSizes, ButtonSize } from './Button';
import { SurfaceVariant } from './Surface';

interface ListButtonOwnProps<C extends ElementType = 'button'> {
  /** Title content of the row (the main text/element on the row). */
  children?: ReactNode;
  /** Extra classes for the row's surface root. */
  className?: string;
  /** Extra classes for the row's inner content area. */
  contentClassName?: string;
  /** Extra classes for the inner column (the wrapper around `header`/title/`footer`). */
  innerContentClassName?: string;
  /** Icon node rendered on the left, before the inner content column. */
  icon?: ReactNode;
  /** Extra classes for the icon wrapper. */
  iconClassName?: string;
  /** Small text rendered above the title. Typically a category, date, or eyebrow label. */
  header?: ReactNode;
  headerClassName?: string;
  /** Small text rendered below the title. Typically secondary metadata. */
  footer?: ReactNode;
  footerClassName?: string;
  /** Extra classes for the title row (the wrapper around `children`). */
  titleClassName?: string;

  /** Visually dim the row and disable pointer events. */
  disabled?: boolean;
  /** Block clicks while keeping the row visually enabled. */
  readOnly?: boolean;
  /** Default `'lg'` (vs Button's `'md'`) - list rows usually want more vertical space. */
  size?: ButtonSize;
  /** Polymorphic root element. Defaults to `'button'`. Pass `'a'` for navigation list rows. */
  as?: C;
  /** Accent color token. Forwarded to `Button.color`. */
  color?: Color;

  /**
   * Marks this list row as selected. When `true`, forces `variant` to `'gradient'` and
   * `outline` to `true` regardless of the props passed - used for the active row in a list.
   */
  selected?: boolean;

  /** Forwarded to the underlying `Button`'s polymorphic root. */
  ref?: Ref<HTMLElement>;
  /** Slot rendered right-aligned at the end of the row (e.g. badge, chevron). */
  after?: ReactNode;
  /**
   * Surface variant. Default `'transparent'` so rows blend into the list surface.
   * Overridden to `'gradient'` when `selected` is `true`.
   */
  variant?: SurfaceVariant;
  /**
   * Outline ring on the row. Default `false`. Effective value is `outline || selected`,
   * so a selected row always shows the ring.
   */
  outline?: boolean;
  /** Default `true`. Forwarded to the underlying `Button`. */
  rounded?: boolean;
}

export type ListButtonProps<C extends ElementType = 'button'> =
  ListButtonOwnProps<C> & Omit<ButtonProps<C>, keyof ListButtonOwnProps<C>>;

export const ListButton = <C extends ElementType = 'button'>(
  props: ListButtonProps<C>,
) => {
  const {
    children,
    className = '',
    contentClassName = '',
    innerContentClassName = '',
    disabled = false,
    readOnly = false,
    size = 'lg',
    as: Component = 'button',
    color = '',
    icon,
    iconClassName = '',
    header,
    headerClassName = '',
    footer,
    footerClassName = '',
    selected = false,
    titleClassName = '',
    after,
    ref,
    variant = 'transparent',
    outline = false,
    rounded = true,
    ...rest
  } = props;

  const ButtonEl = Button as FC<ButtonProps<ElementType>>;

  return (
    <ButtonEl
      as={Component}
      data-selected={selected || undefined}
      rounded={rounded}
      className={cn('cladd-list-button z-10 w-full', className)}
      contentClassName={cn('gap-4 px-2', contentClassName)}
      variant={selected ? 'gradient' : variant}
      outline={outline || selected}
      disabled={disabled}
      readOnly={readOnly}
      ref={ref}
      color={color}
      size={size}
      multiline
      {...rest}
    >
      {icon && (
        <div
          className={cn(
            'relative shrink-0 [&>svg]:shrink-0',
            buttonIconSizes[size],
            iconClassName,
          )}
        >
          {icon}
        </div>
      )}
      {(children || footer || header) && (
        <div
          className={cn(
            'relative flex w-full min-w-0 shrink flex-col gap-1',
            innerContentClassName,
          )}
        >
          {header && (
            <div
              className={cn(
                'text-xs leading-tight font-normal text-cladd-fg-soft',
                headerClassName,
              )}
            >
              {header}
            </div>
          )}
          <div
            className={cn(
              'flex items-center gap-4 [&>svg]:shrink-0',
              buttonIconSizes[size],
              titleClassName,
            )}
          >
            {children}
          </div>
          {footer && (
            <div
              className={cn(
                'text-xs leading-tight font-normal text-cladd-fg-softer',
                footerClassName,
              )}
            >
              {footer}
            </div>
          )}
        </div>
      )}
      {after && (
        <div
          className={cn(
            'ml-auto shrink-0 [&>svg]:shrink-0',
            buttonIconSizes[size],
          )}
        >
          {after}
        </div>
      )}
    </ButtonEl>
  );
};
