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
   * Surface depth level (1–5). Drives the background tone via `cladd-surface-level="N"` class
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
   *
   * - `transparent` - no background; children render at the parent level (used for nested groupings).
   * - `solid` - flat surface fill (default).
   * - `gradient` - diagonal highlight→surface gradient.
   * - `solid-fill` - flat primary/accent fill (text inverts to `text-cladd-on-primary`).
   * - `gradient-fill` - diagonal accent gradient (text inverts).
   */
  variant?: SurfaceVariant;
  /**
   * Polymorphic root element. Defaults to `'div'`. Use `'button'`, `'a'`, etc. when the surface is itself the interactive target (forwarding props of that element).
   */
  as?: C;
  /** Enables active/pressed visual states (scale + pressed background). Combine with `hoverable`. */
  clickable?: boolean;
  /** Force the pressed visual state regardless of pointer activity (controlled press). */
  pressed?: boolean;
  /** Enables hover background overlay. For `variant="transparent"`, also reveals the surface fill on hover. */
  hoverable?: boolean;
  /**
   * Where to stack the hover/press overlay:
   * - `'below'` (default) - inside the background layer, behind content (overlay tints only the bg).
   * - `'above'` - on top of content as a separate sibling layer (overlay tints content too).
   */
  overlayPosition?: 'below' | 'above';
  /** Extra classes for the hover/press overlay layer. */
  overlayClassName?: string;
  /** Accent color token. Sets the surface's `cladd-color-{name}` class - drives accent-aware borders, fills, and text colors. */
  color?: Color;
  /**
   * Slot rendered between the background layer and the content wrapper, **outside** the `SurfaceContent` flex layout (e.g. `FocusableLayer`, decorative overlays).
   */
  beforeContent?: ReactNode;
  /**
   * When `true` (default), `children` are rendered inside a `SurfaceContent` flex wrapper styled by `contentClassName`.
   *
   * Set to `false` to render `children` directly - useful when the surface is the layout root and you want full control of the inner DOM.
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
    overlayPosition = 'above',
    overlayClassName = '',
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

  const overlay = (hoverable || clickable) && (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 duration-200',
        hoverable &&
          !pressed &&
          cn(
            'cladd-surface-hover:opacity-100',
            isFill
              ? 'cladd-surface-hover:bg-cladd-surface-hover-fill'
              : 'cladd-surface-hover:bg-cladd-surface-hover',
          ),
        clickable &&
          (pressed
            ? 'bg-cladd-surface-pressed opacity-100'
            : 'cladd-surface-press:bg-cladd-surface-pressed cladd-surface-press:opacity-100'),
        overlayClassName,
      )}
    />
  );

  return (
    <Component
      className={cn(
        'cladd-surface relative',
        `cladd-surface-level-${currentLevel}`,
        color && `cladd-color-${color}`,
        isFill ? 'text-cladd-on-primary' : 'text-cladd-fg',
        hoverable && 'cladd-hoverable',
        clickable && 'cladd-clickable',
        className,
      )}
      ref={ref}
      {...rest}
    >
      {/* bg */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit]',
          variant === 'solid' && 'bg-cladd-surface',
          variant === 'solid-fill' && 'bg-cladd-primary',
          variant === 'gradient' &&
            'bg-linear-to-br from-cladd-surface-highlight to-cladd-surface',
          variant === 'gradient-fill' &&
            'bg-linear-to-br from-cladd-primary to-cladd-primary/85 light:from-cladd-primary/80 light:to-cladd-primary',

          outline &&
            cn(isFill ? 'shadow-cladd-outline-fill' : 'shadow-cladd-outline'),
          variant === 'transparent' &&
            hoverable &&
            'duration-200 cladd-surface-hover:bg-cladd-surface',
          variant === 'transparent' &&
            hoverable &&
            clickable &&
            'cladd-surface-press:bg-cladd-surface',
          bgClassName,
        )}
      />
      {overlayPosition === 'below' && overlay}

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
                'cladd-surface-press:scale-95 cladd-surface-press:opacity-75',
              contentClassName,
            )}
          >
            {children}
          </SurfaceContent>
        ) : (
          children
        )}
        {overlayPosition === 'above' && overlay}
      </SurfaceContextProvider>
    </Component>
  );
};
