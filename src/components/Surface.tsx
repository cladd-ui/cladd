import { ReactNode, Ref, ElementType, ComponentPropsWithoutRef } from 'react';

import { useSurface } from '../hooks/use-surface';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { SurfaceContent } from './SurfaceContent';
import { SurfaceContextProvider } from './SurfaceContext';

export type SurfaceVariant =
  | 'transparent'
  | 'solid'
  | 'gradient'
  | 'solid-fill'
  | 'gradient-fill';

interface SurfaceOwnProps<C extends ElementType = 'div'> {
  /**
   * Surface depth level (1–5). Drives the background tone via `surface-level-N` classes
   * and propagates to nested surfaces through `SurfaceContext`.
   *
   * Accepts:
   * - An absolute number/string (e.g. `2`, `"3"`).
   * - A relative offset against the parent context level (e.g. `"+1"`, `"-1"`).
   * - `undefined` (default): one level deeper than the parent context.
   *
   * Result is clamped to `[1, 5]`. For `variant="transparent"`, children inherit
   * `currentLevel - 1` so they appear at the same depth as this surface.
   */
  level?: number | string;
  /** Surface content. */
  children?: ReactNode;
  /** Extra classes for the root element. */
  className?: string;
  /** Extra classes for the absolutely-positioned background layer (the tinted/outlined fill behind content). */
  bgClassName?: string;
  /** Extra classes for the inner `SurfaceContent` wrapper. Ignored when `wrapContent` is `false`. */
  contentClassName?: string;
  /** Render a 1px outline ring around the surface. Uses fill-aware token when `variant` ends in `-fill`. */
  outline?: boolean;
  /**
   * Visual treatment of the surface background:
   * - `transparent` - no background; children render at the parent level (used for nested groupings).
   * - `solid` - flat surface fill (default).
   * - `gradient` - diagonal highlight→surface gradient.
   * - `solid-fill` - flat primary/accent fill (text inverts to `text-on-primary`).
   * - `gradient-fill` - diagonal accent gradient (text inverts).
   */
  variant?: SurfaceVariant;
  /**
   * Polymorphic root element. Defaults to `'div'`. Use `'button'`, `'a'`, etc. when the
   * surface is itself the interactive target (forwarding props of that element).
   */
  as?: C;
  /** Enables active/pressed visual states (scale + pressed background). Combine with `hoverable`. */
  clickable?: boolean;
  /** Force the pressed visual state regardless of pointer activity (controlled press). */
  pressed?: boolean;
  /** Enables hover background overlay. For `variant="transparent"`, also reveals the surface fill on hover. */
  hoverable?: boolean;
  /** Accent color token. Sets the surface's `color-{name}` class - drives accent-aware borders, fills, and text colors. */
  color?: Color;
  /**
   * Slot rendered between the background layer and the content wrapper, **outside** the
   * `SurfaceContent` flex layout (e.g. `FocusableLayer`, decorative overlays).
   */
  beforeContent?: ReactNode;
  /**
   * When `true` (default), `children` are rendered inside a `SurfaceContent` flex wrapper
   * styled by `contentClassName`. Set to `false` to render `children` directly - useful
   * when the surface is the layout root and you want full control of the inner DOM.
   */
  wrapContent?: boolean;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type SurfaceProps<C extends ElementType = 'div'> = SurfaceOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof SurfaceOwnProps<C>>;

export const Surface = <C extends ElementType = 'div'>(
  props: SurfaceProps<C>,
) => {
  const MAX_LEVEL = 5;

  const {
    level,
    children,
    className = '',
    contentClassName = '',
    bgClassName = '',
    outline = false,
    variant = 'solid',
    as: asProp = 'div',
    clickable = false,
    pressed,
    hoverable = false,
    color = '',
    wrapContent = true,
    beforeContent,
    ref,
    ...rest
  } = props;

  const contextLevel = useSurface();
  let levelProp: number | string | undefined = level;
  if (
    typeof levelProp === 'string' &&
    (levelProp.includes('+') || levelProp.includes('-'))
  ) {
    if (levelProp.includes('+'))
      levelProp = contextLevel + parseInt(levelProp, 10);
    else levelProp = contextLevel + parseInt(levelProp, 10);
  }
  const currentLevel = Math.max(
    1,
    Math.min(
      typeof levelProp === 'undefined' ? contextLevel + 1 : Number(levelProp),
      MAX_LEVEL,
    ),
  );

  const Component = asProp as ElementType;
  const isFill = variant === 'solid-fill' || variant === 'gradient-fill';

  return (
    <Component
      className={cn(
        'cladd-surface relative',
        isFill ? 'text-on-primary' : 'text-on-surface',
        (clickable || hoverable) && 'group/cladd-surface',
        `surface-level-${currentLevel}`,
        color && `color-${color}`,
        className,
      )}
      ref={ref}
      {...rest}
    >
      {/* bg */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit]',
          variant === 'solid' && 'bg-surface',
          variant === 'solid-fill' && 'bg-primary',
          variant === 'gradient' &&
            'bg-linear-to-br from-surface-highlight to-surface',
          variant === 'gradient-fill' &&
            'bg-linear-to-br from-primary to-primary/85 light:from-primary/80 light:to-primary',

          outline &&
            cn(
              isFill ? 'shadow-surface-outline-fill' : 'shadow-surface-outline',
            ),
          variant === 'transparent' &&
            hoverable &&
            'duration-200 group-hover/cladd-surface:bg-surface',
          hoverable && clickable && 'group-active/cladd-surface:bg-surface',
          bgClassName,
        )}
      >
        {/* Hoverable/Clickable */}
        {(hoverable || clickable) && (
          <div
            className={cn(
              'absolute inset-0 rounded-[inherit] opacity-0 duration-200',
              hoverable &&
                !pressed &&
                cn(
                  'group-hover/cladd-surface:opacity-100',
                  isFill
                    ? 'group-hover/cladd-surface:bg-surface-hover-fill'
                    : 'group-hover/cladd-surface:bg-surface-hover',
                ),
              clickable &&
                (pressed
                  ? 'bg-surface-pressed opacity-100'
                  : 'group-active/cladd-surface:bg-surface-pressed group-active/cladd-surface:opacity-100'),
            )}
          />
        )}
      </div>

      <SurfaceContextProvider
        level={variant === 'transparent' ? currentLevel - 1 : currentLevel}
      >
        {beforeContent}
        {/* content */}
        {wrapContent ? (
          <SurfaceContent
            className={cn(
              'duration-200',
              clickable &&
                'group-active/cladd-surface:scale-95 group-active/cladd-surface:opacity-75',
              contentClassName,
            )}
          >
            {children}
          </SurfaceContent>
        ) : (
          children
        )}
      </SurfaceContextProvider>
    </Component>
  );
};
