import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface ListSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export const ListSeparator = (props: ListSeparatorProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'list-separator -mx-2 my-2 h-px bg-surface-outline',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
