import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  /** Extra classes for the backdrop root. */
  className?: string;
  /** Optional content rendered above the backdrop tint (rarely needed - backdrops are usually empty). */
  children?: ReactNode;
  /** Forwarded to the underlying `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export const Backdrop = (props: BackdropProps) => {
  const { className = '', children, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      data-part="backdrop"
      className={cn(
        'cladd-backdrop fixed inset-0 z-50 bg-cladd-backdrop/90',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
