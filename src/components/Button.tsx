import {
  useRef,
  ElementType,
  ReactNode,
  Ref,
  CSSProperties,
  ComponentPropsWithoutRef,
} from 'react';

import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { Surface, SurfaceVariant } from './Surface';
import { SurfaceCut } from './SurfaceCut';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ButtonSurface = 'surface' | 'cut';

interface ButtonOwnProps<C extends ElementType = 'button'> {
  /** Button content (label, icons, etc.). */
  children?: ReactNode;
  /** Extra classes for the button surface root. */
  className?: string;
  /** Visually dim the button (40% opacity) and disable pointer events. */
  disabled?: boolean;
  /** Block clicks while keeping the button visually enabled - useful for "selected" segmented buttons. */
  readOnly?: boolean;
  /** When `true`, applies fully rounded corners (`rounded-full`, or matching pill radius for `multiline`). Default size-specific corner radii are used when `false`. */
  rounded?: boolean;
  size?: ButtonSize;
  /**
   * Polymorphic element to render. Defaults to `'button'`. Pass `'a'` for links
   * (cursor switches to pointer automatically), or any custom component to retain
   * Button styling on a different DOM node. The component's own props become valid here.
   */
  component?: C;
  /** Underlying `Surface` variant - see `SurfaceVariant`. Defaults to `'gradient'`. */
  variant?: SurfaceVariant;
  /** Accent color token. Sets the button's `color-{name}` class - drives text and ring colors. */
  color?: Color;
  /** Render the surface outline ring. Defaults to `true`. */
  outline?: boolean;
  /** Extra classes for the inner content row. */
  contentClassName?: string;
  /** Native `style` forwarded to the surface root. */
  style?: CSSProperties;
  /** Force the focus ring on, regardless of actual keyboard focus. */
  focused?: boolean;
  /** Force the pressed visual state, regardless of pointer activity. */
  pressed?: boolean;
  /** Allow text to wrap onto multiple lines, switching height to `min-h-*` and using pill radii compatible with multi-line content. */
  multiline?: boolean;
  /**
   * Which surface primitive to wrap with:
   * - `'surface'` (default) - uses `Surface` (standard tinted/outlined panel).
   * - `'cut'` - uses `SurfaceCut` (inset/recessed look - for buttons that sit inside another surface).
   */
  surface?: ButtonSurface;
  /** Forwarded to the underlying surface. Defaults to `true`; suppressed automatically when `disabled` or `readOnly`. */
  clickable?: boolean;
  /** Forwarded to the underlying surface. Defaults to `true`; suppressed automatically when `disabled` or `readOnly`. */
  hoverable?: boolean;
  /** When `true` (default), renders a `FocusableLayer` ring on keyboard focus. Suppressed automatically when `disabled` or `readOnly`. */
  focusable?: boolean;
  /** Forwarded to the underlying `Surface` as `level` - see `SurfaceProps.level` for the relative-offset (`"+1"`/`"-1"`) syntax. */
  surfaceLevel?: string | number;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type ButtonProps<C extends ElementType = 'button'> = ButtonOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

export const buttonIconSizes: Record<ButtonSize, string> = {
  sm: '[&>svg]:size-4',
  md: '[&>svg]:size-4',
  lg: '[&>svg]:size-4',
  xl: '[&>svg]:size-4',
  '2xl': '[&>svg]:size-4',
};

export const Button = <C extends ElementType = 'button'>(
  props: ButtonProps<C>,
) => {
  const elRef = useRef<HTMLElement | null>(null);
  const {
    children,
    className = '',
    disabled = false,
    readOnly,
    rounded = false,
    size = 'md',
    component = 'button',
    color = '',
    outline = true,
    contentClassName = '',
    variant = 'gradient',
    style,
    focused = false,
    pressed,
    multiline,
    surface: propSurface = 'surface',
    clickable = true,
    hoverable = true,
    focusable = true,
    surfaceLevel,
    ref,
    ...rest
  } = props;

  let surface: ButtonSurface = propSurface || 'surface';

  const heights: Record<ButtonSize, string> = {
    sm: multiline ? 'min-h-[24px]' : 'h-6',
    md: multiline ? 'min-h-[28px]' : 'h-7',
    lg: multiline ? 'min-h-[32px]' : 'h-8',
    xl: multiline ? 'min-h-[40px]' : 'h-10',
    '2xl': multiline ? 'min-h-[48px]' : 'h-12',
  };

  const { itemRoundedClasses, focusRoundedClasses } = roundedClasses(
    size,
    rounded,
    multiline,
  );

  const paddings: Record<ButtonSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };
  const fontSizes: Record<ButtonSize, string> = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-xs',
    xl: 'text-xs',
    '2xl': 'text-xs',
  };

  const isSurfaceCut = surface === 'cut';

  const WrapComponent: ElementType = isSurfaceCut ? SurfaceCut : Surface;

  const isFill = variant === 'solid-fill' || variant === 'gradient-fill';

  return (
    <WrapComponent
      component={component}
      className={cn(
        `button group/button inline-block appearance-none text-left font-semibold outline-0 select-none focus:ring-0 focus:outline-0`,
        color &&
          color !== 'neutral' &&
          cn(isFill ? 'text-on-primary' : 'text-primary'),
        color && color === 'neutral' && isFill && 'text-on-primary',

        fontSizes[size],
        heights[size],
        disabled && 'pointer-events-none',
        !disabled && component === 'a' ? 'cursor-pointer' : 'cursor-auto',
        itemRoundedClasses,

        className,
      )}
      contentClassName={cn(
        'flex w-full items-center justify-center gap-2 py-1 [&>svg]:shrink-0',
        multiline && heights[size],
        buttonIconSizes[size],
        disabled && 'opacity-40',
        paddings[size],
        contentClassName,
      )}
      pressed={pressed}
      tabIndex={disabled || readOnly ? -1 : undefined}
      variant={variant}
      outline={outline}
      clickable={clickable && !disabled && !readOnly}
      hoverable={hoverable && !disabled && !readOnly}
      disabled={disabled || readOnly}
      level={surfaceLevel}
      // {...enabledDisabledProps}
      ref={(el: HTMLElement) => {
        elRef.current = el;
        if (ref && typeof ref === 'function') {
          ref(el as HTMLElement);
        } else if (ref) {
          (ref as React.RefObject<HTMLElement | null>).current = el;
        }
      }}
      onContextMenuCapture={(e: React.MouseEvent) => e.preventDefault()}
      color={color}
      style={style}
      beforeContent={
        focusable &&
        !readOnly &&
        !disabled && (
          <FocusableLayer group="button" className={cn(focusRoundedClasses)} />
        )
      }
      {...rest}
    >
      {children}
    </WrapComponent>
  );
};
