import {
  useRef,
  ReactNode,
  Ref,
  ElementType,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { cn } from '../shared/cn';
import { Color } from '../types';
import { Surface } from './Surface';

export type ChipSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ChipOwnProps<C extends ElementType = 'span'> {
  /** Chip content - typically a short label, optionally with an icon. */
  children?: ReactNode;
  /** Currently unused in styling - reserved for future "disabled chip" state. */
  disabled?: boolean;
  /** Extra classes for the chip surface root. */
  className?: string;
  /** Extra classes for the inner content row. */
  contentClassName?: string;
  /** Apply `rounded-full` (pill) corners. When `false` (default), uses size-specific corner radii. */
  rounded?: boolean;
  size?: ChipSize;
  /**
   * Polymorphic root element. Defaults to `'span'`. When set to `'a'` or `'button'`, the chip
   * becomes interactive automatically (see `clickable`).
   */
  as?: C;
  /**
   * Render an outline ring. When `true`, also forces the underlying surface variant to
   * `'transparent'`; when `false`/omitted, the surface is `'gradient'`.
   */
  outline?: boolean;
  /** Show hover affordance. Implicitly enabled when the chip is clickable. */
  hoverable?: boolean;
  /**
   * Make the chip react to pointer activity (active/pressed state, hover overlay).
   * Auto-computed when omitted: `true` if `as === 'a'` or `'button'`, otherwise `false`.
   * Set explicitly to override (e.g. force a `<span>` to be clickable, or suppress the
   * default for an `<a>` used purely as a navigation anchor).
   */
  clickable?: boolean;
  /** Accent color token. Sets the chip's `color-{name}` class - drives text and ring colors. */
  color?: Color;
  /** Icon component rendered before `children`. Receives `iconProps`. */
  icon?: ElementType<any>;
  /** Props forwarded to the `icon` component. */
  iconProps?: Record<string, unknown>;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type ChipProps<C extends ElementType = 'span'> = ChipOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ChipOwnProps<C>>;

export const Chip = <C extends ElementType = 'span'>(props: ChipProps<C>) => {
  const elRef = useRef<HTMLElement | null>(null);
  const {
    children,
    disabled,
    className = '',
    contentClassName = '',
    rounded = false,
    size = 'md',
    as: Component = 'span',
    outline,
    hoverable,
    clickable,
    color = '',
    icon: IconComponent,
    iconProps = {},
    ref,
    ...rest
  } = props;
  const heights: Record<ChipSize, string> = {
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-7',
    xl: 'h-8',
    '2xl': 'h-10',
  };
  const paddings: Record<ChipSize, string> = {
    sm: 'px-2 [&:has(>svg)]:pl-1',
    md: 'px-2 [&:has(>svg)]:pl-1',
    lg: 'px-2.5 [&:has(>svg)]:pl-1.5',
    xl: 'px-1.5',
    '2xl': 'px-2',
  };
  const fontSizes: Record<ChipSize, string> = {
    sm: 'text-[10px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
    '2xl': 'text-sm',
  };
  const iconSizes: Record<ChipSize, string> = {
    sm: '[&>svg]:size-3',
    md: '[&>svg]:size-4',
    lg: '[&>svg]:size-4',
    xl: '[&>svg]:size-4',
    '2xl': '[&>svg]:size-4',
  };

  const roundedClasses = {
    sm: 'rounded-[5px]',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-lg',
    '2xl': 'rounded-lg',
  };

  let clickableComputed =
    clickable === true ||
    (typeof clickable === 'undefined' &&
      (Component === 'a' || Component === 'button'));

  const SurfaceComponent = Surface as ElementType;

  return (
    <SurfaceComponent
      as={Component}
      hoverable={hoverable || clickableComputed}
      clickable={clickableComputed}
      outline={outline}
      variant={outline ? 'transparent' : 'gradient'}
      contentClassName={cn(
        'relative flex items-center justify-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap [&>svg]:shrink-0',
        iconSizes[size],
        paddings[size],
        contentClassName,
      )}
      className={cn(
        `chip group/chip relative inline-flex font-semibold text-primary select-none focus:ring-0 focus:outline-0 focus:outline-none`,
        rounded ? 'rounded-full' : roundedClasses[size],
        clickableComputed && 'duration-200',
        clickableComputed && Component === 'a'
          ? 'cursor-pointer'
          : 'cursor-auto',
        heights[size],
        fontSizes[size],
        color && `color-${color}`,
        className,
      )}
      ref={(el: HTMLElement | null) => {
        elRef.current = el;
        if (ref) (ref as React.RefObject<HTMLElement | null>).current = el;
      }}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      {...rest}
    >
      {IconComponent && <IconComponent {...(iconProps || {})} />}
      {children}
    </SurfaceComponent>
  );
};
