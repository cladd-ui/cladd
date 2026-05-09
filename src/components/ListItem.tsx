import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export const ListItem = (props: ListItemProps, ref?: Ref<HTMLDivElement>) => {
  const { children, className = '', ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-list-item flex min-h-9 items-center gap-4 px-2 py-1 text-cladd-xs font-medium',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
