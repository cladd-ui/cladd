import { ReactNode } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { Surface, SurfaceVariant } from './Surface';

export interface PopupContentProps {
  /** Forwarded to the underlying `Surface` as `level`. Default `1`. Accepts the relative (`"+1"`/`"-1"`) syntax via `Surface.level`. */
  surfaceLevel?: number;
  /** Card content. */
  children: ReactNode;
  /** Extra classes for the inner content area. Default includes `!h-auto w-full p-4`. */
  contentClassName?: string;
  /** Extra classes for the card `Surface`. */
  className?: string;
  /** Surface variant for the popup card. Default `'solid'`. */
  variant?: SurfaceVariant;
  /** Render the outline ring. Default `true`. */
  outline?: boolean;
  /** Forwarded to the card `Surface`'s root element. */
  ref?: React.Ref<HTMLDivElement>;
}

/** Shape of `PopupContent` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type PopupContentDefaultProps = Partial<
  Omit<PopupContentProps, 'children' | 'ref'>
>;

export const PopupContent = (props: PopupContentProps) => {
  const {
    surfaceLevel = 1,
    children,
    contentClassName = '',
    className = '',
    variant = 'solid',
    outline = true,
    ref,
  } = useComponentDefaults('PopupContent', props);
  return (
    <Surface
      level={surfaceLevel}
      className={cn('rounded-cladd-popup', className)}
      ref={ref}
      variant={variant}
      outline={outline}
      contentClassName={cn('!h-auto w-full p-4', contentClassName)}
    >
      {children}
    </Surface>
  );
};
