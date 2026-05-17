import { ReactNode, Ref, HTMLAttributes } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';

export interface SurfaceContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the surface's content layer (above tint/outline, below focus ring). */
  children?: ReactNode;
  /** Extra classes for the content wrapper. */
  className?: string;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

/** Shape of `SurfaceContent` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SurfaceContentDefaultProps = Partial<
  Omit<SurfaceContentProps, 'children' | 'ref'>
>;

export const SurfaceContent = (props: SurfaceContentProps) => {
  const { children, className = '', ref, ...rest } = useComponentDefaults(
    'SurfaceContent',
    props,
  );
  return (
    <div ref={ref} className={cn(`relative h-full`, className)} {...rest}>
      {children}
    </div>
  );
};
