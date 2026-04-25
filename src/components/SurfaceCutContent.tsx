import { ReactNode, Ref, ElementType, ComponentPropsWithoutRef } from 'react';

import { cn } from '../shared/cn';

interface SurfaceCutContentOwnProps<C extends ElementType = 'div'> {
  children?: ReactNode;
  /** Stretch the content to `h-full`. Default `true`. Set `false` for content sized by intrinsic height. */
  fullHeight?: boolean;
  /** Polymorphic root element. Defaults to `'div'`. */
  component?: C;
  /** Extra classes for the wrapper. */
  className?: string;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type SurfaceCutContentProps<C extends ElementType = 'div'> =
  SurfaceCutContentOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof SurfaceCutContentOwnProps<C>>;

export const SurfaceCutContent = <C extends ElementType = 'div'>(
  props: SurfaceCutContentProps<C>,
) => {
  const {
    children,
    fullHeight = true,
    component = 'div',
    className = '',
    ref,
    ...rest
  } = props;
  const Component = component as ElementType;
  return (
    <Component
      ref={ref}
      className={cn(`relative`, fullHeight && 'h-full', className)}
      {...rest}
    >
      {children}
    </Component>
  );
};
