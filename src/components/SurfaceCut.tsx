import { ReactNode, Ref, ElementType, ComponentPropsWithoutRef } from 'react';

import { useSurface } from '../hooks/use-surface';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { SurfaceContextProvider } from './SurfaceContext';
import { SurfaceCutContent } from './SurfaceCutContent';

export interface SurfaceCutOwnProps<C extends ElementType = 'div'> {
  /** Surface-cut content. */
  children?: ReactNode;
  /** Extra classes for the root element. */
  className?: string;
  /** Render the inset outline ring. Default `true`. */
  outline?: boolean;
  /** Accent color token. Sets the surface's `cladd-color-{name}` class. */
  color?: Color;
  /** Show hover overlay on the cut surface. Default `false`. */
  hoverable?: boolean;
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

export const SurfaceCut = <C extends ElementType = 'div'>(
  props: SurfaceCutProps<C>,
) => {
  const {
    children,
    className = '',
    outline = true,
    color,
    hoverable = false,
    clickable = false,
    pressed = false,
    as: asProp = 'div',
    wrapContent = true,
    contentClassName = '',
    ref,
    ...rest
  } = props;

  const Component = asProp as ElementType;

  const contextLevel = useSurface();

  return (
    <Component
      className={cn(
        'cladd-surface-cut group/cladd-surface-cut relative',
        color && `cladd-color-${color}`,
        hoverable && 'group/cladd-surface-cut-hoverable',
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
        )}
      >
        {/* Hoverable/Clickable */}
        {(hoverable || clickable) && (
          <div
            className={cn(
              'absolute inset-0 rounded-[inherit] opacity-0 duration-200',
              hoverable &&
                'group-hover/cladd-surface-cut-hoverable:bg-cladd-surface-hover group-hover/cladd-surface-cut-hoverable:opacity-100',
              clickable &&
                (pressed
                  ? 'bg-cladd-surface-pressed opacity-100'
                  : 'group-active/cladd-surface-cut:bg-cladd-surface-pressed group-active/cladd-surface-cut:opacity-100'),
            )}
          />
        )}
      </div>
      <SurfaceContextProvider level={contextLevel - 1}>
        {wrapContent ? (
          <SurfaceCutContent
            className={cn(
              clickable &&
                'duration-200 group-active/cladd-surface-cut:scale-95 group-active/cladd-surface-cut:opacity-75',
              contentClassName,
            )}
          >
            {children}
          </SurfaceCutContent>
        ) : (
          children
        )}
      </SurfaceContextProvider>
    </Component>
  );
};
