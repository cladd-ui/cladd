import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

interface SurfaceContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export const SurfaceContent = (props: SurfaceContentProps) => {
  const { children, className = '', ref, ...rest } = props;
  return (
    <div ref={ref} className={cn(`relative h-full`, className)} {...rest}>
      {children}
    </div>
  );
};
