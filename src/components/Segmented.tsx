import {
  useRef,
  ReactNode,
  Ref,
  ElementType,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { ButtonSize } from './Button';
import { SegmentedContextProvider } from './SegmentedContext';
import { SurfaceVariant } from './Surface';

interface SegmentedOwnProps<C extends ElementType = 'div'> {
  /** Should be one or more `SegmentedButton` elements. */
  children?: ReactNode;
  /** Extra classes for the segmented container. */
  className?: string;
  /** Visually dim the entire group and disable pointer events. */
  disabled?: boolean;
  /** Pill-style segment buttons. Default `true`. Forwarded via context. */
  rounded?: boolean;
  /** Segment button size. Default `'md'`. Forwarded via context. */
  size?: ButtonSize;
  /** Polymorphic root element. Defaults to `'div'`. Use `'fieldset'`/`'ul'`/etc. for semantic groupings. */
  as?: C;
  /** Accent color applied to **inactive** segment buttons. */
  color?: Color;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
  /**
   * `Surface` variant applied to **inactive** segment buttons through context.
   * Default `'transparent'` - inactive segments fade into the parent surface.
   */
  variant?: SurfaceVariant;
  /** Outline ring on **inactive** segment buttons. Default `false`. */
  outline?: boolean;
  /** Color applied to the **active** segment button. Default: theme accent color. */
  activeColor?: Color;
  /** `Surface` variant applied to the **active** segment button. Default `'gradient'`. */
  activeVariant?: SurfaceVariant;
  /** Outline ring on the **active** segment button. Default `true`. */
  activeOutline?: boolean;
}

export type SegmentedProps<C extends ElementType = 'div'> =
  SegmentedOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof SegmentedOwnProps<C>>;

export const Segmented = <C extends ElementType = 'div'>(
  props: SegmentedProps<C>,
) => {
  const elRef = useRef<HTMLElement | null>(null);
  const accentColor = useAccentColor();
  const {
    children,
    className = '',
    disabled = false,
    rounded = true,
    size = 'md',
    as: asProp = 'div' as ElementType<any>,
    color = '',
    ref,
    variant = 'transparent',
    outline = false,
    activeColor = accentColor,
    activeVariant = 'gradient',
    activeOutline = true,
    ...rest
  } = props;

  const Component = asProp as ElementType<any>;
  return (
    <Component
      className={cn(
        color && `cladd-color-${color}`,
        'cladd-segmented',
        disabled && 'pointer-events-none opacity-40',
        'flex items-center justify-center',
        className,
      )}
      ref={(el: HTMLElement | null) => {
        elRef.current = el;
        if (ref) (ref as React.RefObject<HTMLElement | null>).current = el;
      }}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      {...rest}
    >
      <SegmentedContextProvider
        value={{
          size,
          rounded,
          color,
          variant,
          outline,
          activeColor,
          activeVariant,
          activeOutline,
        }}
      >
        {/* Content */}
        {children}
      </SegmentedContextProvider>
    </Component>
  );
};
