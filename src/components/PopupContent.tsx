import { cn } from '../shared/cn';
import { Surface, SurfaceVariant } from './Surface';

export const PopupContent = (props: {
  /** Forwarded to the underlying `Surface` as `level`. Default `1`. Accepts the relative (`"+1"`/`"-1"`) syntax via `Surface.level`. */
  surfaceLevel?: number;
  /** Card content. */
  children: React.ReactNode;
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
}) => {
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
      className={cn('rounded-3xl', className)}
      ref={ref}
      variant={variant}
      outline={outline}
      contentClassName={cn('!h-auto w-full p-4', contentClassName)}
    >
      {children}
    </Surface>
  );
};
