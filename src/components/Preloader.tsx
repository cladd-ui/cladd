import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { Color } from '../types';

export type PreloaderSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface PreloaderProps {
  /** Preloader dimension. Default `'sm'`. Drives the size, knob position, and border thickness. */
  size?: PreloaderSize;
  /** Accent color for the spinning knob and ring. Default: theme accent. */
  color?: Color;
  /** Extra classes for the preloader root element. */
  className?: string;
}

export function Preloader(props: PreloaderProps) {
  const accentColor = useAccentColor();
  const { size = 'sm', color = accentColor, className } = props;
  const sizes: Record<PreloaderSize, string> = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-7',
    xl: 'size-8',
    '2xl': 'size-10',
  };
  const borderWidth = {
    sm: 'border',
    md: 'border-1',
    lg: 'border-[1.5px]',
    xl: 'border-2',
    '2xl': 'border-2',
  }[size];

  const sizeClasses = {
    sm: 'left-0.5 right-0.5',
    md: 'left-0.5 right-0.5',
    lg: 'left-1 right-1',
    xl: 'left-1 right-1',
    '2xl': 'left-1 right-1',
  }[size];

  return (
    <div
      className={cn(
        'preloader',
        `color-${color}`,
        'relative',
        sizes[size],
        className,
      )}
    >
      <div className="preloader-wrap absolute inset-0">
        <div
          className={cn(
            'absolute top-1/2 left-0 aspect-[16/10] w-full -translate-y-1/2 rounded-full border-primary',
            borderWidth,
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 aspect-2/1 -translate-y-1/2 rounded-full',
            sizeClasses,
          )}
        >
          <div className="preloader-knob absolute top-0 left-0 h-full w-1/2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
