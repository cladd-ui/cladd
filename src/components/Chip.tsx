import {
  useRef,
  ReactNode,
  Ref,
  ElementType,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { cn } from '../shared/cn';
import { nestedSizeClasses } from '../shared/size-utls';
import { Color } from '../types';
import { Surface } from './Surface';

export type ChipSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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
  /** Chip size token. Drives height, padding, and font size. Default `'md'`. */
  size?: ChipSize;
  /**
   * Polymorphic root element. Defaults to `'span'`. When set to `'a'` or `'button'`, the chip becomes interactive automatically (see `clickable`).
   */
  as?: C;
  /**
   * Render an outline ring. When `true`, also forces the underlying surface variant to `'transparent'`; when `false`/omitted, the surface is `'gradient'`.
   */
  outline?: boolean;
  /** Show hover affordance. Implicitly enabled when the chip is clickable. */
  hoverable?: boolean;
  /**
   * Make the chip react to pointer activity (active/pressed state, hover overlay).
   *
   * Auto-computed when omitted: `true` if `as === 'a'` or `'button'`, otherwise `false`.
   *
   * Set explicitly to override (e.g. force a `<span>` to be clickable, or suppress the default for an `<a>` used purely as a navigation anchor).
   */
  clickable?: boolean;
  /** Accent color token. Sets the chip's `cladd-color-{name}` class - drives text and ring colors. */
  color?: Color;
  /** Icon component rendered before `children`. Receives `iconProps`. */
  icon?: ElementType<any>;
  /** Props forwarded to the `icon` component. */
  iconProps?: Record<string, unknown>;
  /** Forwarded to the underlying `Surface` as `level` - see `SurfaceProps.level` for the relative-offset (`"+1"`/`"-1"`) syntax. */
  surfaceLevel?: string | number;
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
    surfaceLevel,
    ref,
    ...rest
  } = props;
  const height = nestedSizeClasses(size, 'height');
  const paddings: Record<ChipSize, string> = {
    '2xs': 'px-1 [&:has(>svg:first-child)]:pl-1 [&:has(>svg:last-child)]:pr-1',
    xs: 'px-1 [&:has(>svg:first-child)]:pl-1 [&:has(>svg:last-child)]:pr-1',
    sm: 'px-2 [&:has(>svg:first-child)]:pl-1.5 [&:has(>svg:last-child)]:pr-1.5',
    md: 'px-2 [&:has(>svg:first-child)]:pl-1.5 [&:has(>svg:last-child)]:pr-1.5',
    lg: 'px-2.5 [&:has(>svg:first-child)]:pl-2 [&:has(>svg:last-child)]:pr-2',
    xl: 'px-2.5 [&:has(>svg:first-child)]:pl-2 [&:has(>svg:last-child)]:pr-2',
    '2xl': 'px-2.5',
  };
  const fontSizes: Record<ChipSize, string> = {
    '2xs': 'text-cladd-4xs',
    xs: 'text-cladd-3xs',
    sm: 'text-cladd-2xs',
    md: 'text-cladd-2xs',
    lg: 'text-cladd-xs',
    xl: 'text-cladd-xs',
    '2xl': 'text-cladd-xs',
  };
  const iconSizes: Record<ChipSize, string> = {
    '2xs': '[&>svg]:size-1.5',
    xs: '[&>svg]:size-2.5',
    sm: '[&>svg]:size-3',
    md: '[&>svg]:size-3.5',
    lg: '[&>svg]:size-4',
    xl: '[&>svg]:size-4',
    '2xl': '[&>svg]:size-4',
  };

  const roundedClasses = {
    '2xs': 'rounded-cladd-3xs',
    xs: 'rounded-cladd-3xs',
    sm: 'rounded-cladd-xs',
    md: 'rounded-cladd-sm',
    lg: 'rounded-cladd-md',
    xl: 'rounded-cladd-lg',
    '2xl': 'rounded-cladd-xl',
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
      level={surfaceLevel}
      contentClassName={cn(
        'relative flex items-center justify-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap [&>svg]:shrink-0',
        iconSizes[size],
        paddings[size],
        contentClassName,
      )}
      color={color}
      className={cn(
        `cladd-chip group/cladd-chip relative inline-flex font-semibold text-cladd-primary select-none focus:ring-0 focus:outline-0 focus:outline-none`,
        rounded ? 'rounded-full' : roundedClasses[size],
        clickableComputed && 'duration-200',
        clickableComputed && Component === 'a'
          ? 'cursor-pointer'
          : 'cursor-auto',
        height,
        fontSizes[size],
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
