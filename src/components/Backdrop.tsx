import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export const Backdrop = (props: BackdropProps) => {
  const { className = '', children, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-backdrop fixed inset-0 z-50 bg-backdrop/90',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
