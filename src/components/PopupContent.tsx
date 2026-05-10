import { ReactNode } from 'react';

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

export const PopupContent = (props: PopupContentProps) => {
  const {
    surfaceLevel = 1,
    children,
    contentClassName = '',
    className = '',
    variant = 'solid',
    outline = true,
    ref,
  } = props;
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
