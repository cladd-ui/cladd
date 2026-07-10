import { ReactNode, Ref, ElementType, ComponentPropsWithoutRef } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { useSurface, useSurfaceColor } from '../hooks/use-surface';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { SurfaceContextProvider } from './SurfaceContext';
import { SurfaceCutContent } from './SurfaceCutContent';

export interface SurfaceCutOwnProps<C extends ElementType = 'div'> {
  /** Surface-cut content. */
  children?: ReactNode;
  /** Extra classes for the root element. */
  className?: string;
  /** Extra classes for the absolutely-positioned background layer (the cut fill behind content). */
  bgClassName?: string;
  /** Render the inset outline ring. Default `true`. */
  outline?: boolean;
  /** Accent color token. Sets the surface's `cladd-color-{name}` class. */
  color?: Color;
  /**
   * Slot rendered between the background layer and the content wrapper, **outside** the `SurfaceCutContent` flex layout (e.g. `FocusableLayer`, decorative overlays).
   */
  beforeContent?: ReactNode;
  /** Show hover overlay on the cut surface. Default `false`. */
  hoverable?: boolean;
  /**
   * Where to stack the hover/press overlay:
   * - `'below'` (default) - inside the background layer, behind content (overlay tints only the bg).
   * - `'above'` - on top of content as a separate sibling layer (overlay tints content too).
   */
  overlayPosition?: 'below' | 'above';
  /** Extra classes for the hover/press overlay layer. */
  overlayClassName?: string;
  /** Enable active/pressed visual states (scale + pressed background). Default `false`. */
  clickable?: boolean;
  /** Force the pressed visual state regardless of pointer activity. */
  pressed?: boolean;
  /** Polymorphic root element. Defaults to `'div'`. */
  as?: C;
  /**
   * When `true` (default), `children` are wrapped in `SurfaceCutContent`.
   *
   * Set to `false` to render `children` directly when you need full layout control of the inner DOM.
   */
  wrapContent?: boolean;
  /** Extra classes for the inner `SurfaceCutContent` wrapper. Ignored when `wrapContent` is `false`. */
  contentClassName?: string;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type SurfaceCutProps<C extends ElementType = 'div'> =
  SurfaceCutOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof SurfaceCutOwnProps<C>>;

/** Shape of `SurfaceCut` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SurfaceCutDefaultProps = Partial<
  Omit<SurfaceCutOwnProps, 'as' | 'ref' | 'children' | 'beforeContent'>
>;

export const SurfaceCut = <C extends ElementType = 'div'>(
  props: SurfaceCutProps<C>,
) => {
  const {
    children,
    className = '',
    bgClassName = '',
    outline = true,
    color,
    beforeContent,
    hoverable = false,
    clickable = false,
    pressed = false,
    overlayPosition = 'above',
    overlayClassName = '',
    as: asProp = 'div',
    wrapContent = true,
    contentClassName = '',
    ref,
    ...rest
  } = useComponentDefaults('SurfaceCut', props);

  const Component = asProp as ElementType;

  const contextLevel = useSurface();
  const inheritedColor = useSurfaceColor();

  const overlay = (hoverable || clickable) && (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 duration-200',
        hoverable &&
          'cladd-surface-hover:bg-cladd-surface-hover cladd-surface-hover:opacity-100',
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
        'cladd-surface-cut relative',
        color && `cladd-color-${color}`,
        hoverable && 'cladd-hoverable',
        clickable && 'cladd-clickable',
        className,
      )}
      {...rest}
      ref={ref}
    >
      {/* bg */}
      <div
        className={cn(
          `pointer-events-none absolute inset-0 rounded-[inherit] bg-cladd-surface-cut`,
          outline && 'shadow-cladd-cut-outline',
          bgClassName,
        )}
      />
      {overlayPosition === 'below' && overlay}
      <SurfaceContextProvider
        level={contextLevel - 1}
        color={color || inheritedColor}
      >
        {beforeContent}
        {wrapContent ? (
          <SurfaceCutContent
            className={cn(
              clickable &&
                'duration-200 cladd-surface-press:scale-95 cladd-surface-press:opacity-75',
              contentClassName,
            )}
          >
            {children}
          </SurfaceCutContent>
        ) : (
          children
        )}
        {overlayPosition === 'above' && overlay}
      </SurfaceContextProvider>
    </Component>
  );
};
