import { ReactNode, Ref, HTMLAttributes } from 'react';

import { cn } from '../shared/cn';

export interface ListDividerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export const ListDivider = (props: ListDividerProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'list-divider -mx-2 my-2 h-px bg-surface-outline',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
