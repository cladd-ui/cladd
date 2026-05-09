import { ReactNode, Ref, ComponentPropsWithoutRef } from 'react';

import { cn } from '../shared/cn';

interface ListTitleOwnProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export type ListTitleProps = ListTitleOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ListTitleOwnProps>;

export const ListTitle = (props: ListTitleProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-list-title flex items-end gap-4 p-2 text-cladd-xs font-medium text-cladd-fg-soft uppercase select-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
