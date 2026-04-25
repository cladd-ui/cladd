import { ReactNode, Ref, ComponentPropsWithoutRef } from 'react';

import { cn } from '../shared/cn';

interface BlockTitleOwnProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export type BlockTitleProps = BlockTitleOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof BlockTitleOwnProps>;

export const BlockTitle = (props: BlockTitleProps) => {
  const { children, className = '', ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn(
        'block-title flex items-end gap-4 text-xs font-medium text-on-surface-dark uppercase select-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
