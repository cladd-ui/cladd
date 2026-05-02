import { useRef, ReactNode, Ref, ElementType, MouseEvent } from 'react';

import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { Color } from '../types';
import { ButtonSize } from './Button';
import { Surface, SurfaceProps, SurfaceVariant } from './Surface';
import { ToolbarContextProvider } from './ToolbarContext';

interface ToolbarOwnProps<C extends ElementType = 'div'> {
  /** Toolbar items - typically `ToolbarButton` and `ToolbarSeparator`. */
  children?: ReactNode;
  /** Extra classes for the toolbar surface root. */
  className?: string;
  /** Extra classes for the inner `SurfaceContent` wrapper (where toolbar items are laid out). */
  contentClassName?: string;
  /**
   * Pill-shape the toolbar container (`rounded-full`). Default `true`. Also forwarded via
   * context as the default `rounded` for child `ToolbarButton`s.
   */
  rounded?: boolean;
  /** Toolbar button size. Default `'md'`. Forwarded via context to child `ToolbarButton`s. */
  size?: ButtonSize;
  /** Polymorphic root element. Defaults to `'div'`. */
  as?: C;
  /** Accent color token. Sets the toolbar's `color-{name}` class. */
  color?: Color;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
  /** Surface variant for the toolbar **container**. Default `'gradient'`. */
  variant?: SurfaceVariant;
  /** Outline ring on the toolbar **container**. Default `true`. */
  outline?: boolean;
  /**
   * Surface variant applied to child `ToolbarButton`s through context. Default `'transparent'` -
   * buttons fade into the toolbar surface until hovered.
   */
  buttonVariant?: SurfaceVariant;
  /** Outline ring on child `ToolbarButton`s. Default `false`. */
  buttonOutline?: boolean;
  /** Forwarded to the underlying `Surface` as `level` - see `SurfaceProps.level`. */
  surfaceLevel?: number | string;
}

export type ToolbarProps<C extends ElementType = 'div'> = ToolbarOwnProps<C> &
  Omit<SurfaceProps<C>, keyof ToolbarOwnProps<C>>;

export const Toolbar = <C extends ElementType = 'div'>(
  props: ToolbarProps<C>,
) => {
  const elRef = useRef<HTMLElement | null>(null);
  const {
    children,
    className = '',
    contentClassName = '',
    rounded = true,
    size = 'md',
    as: Component = 'div' as ElementType<any>,
    color = '',
    ref,
    variant = 'gradient',
    outline = true,
    buttonVariant = 'transparent',
    buttonOutline = false,
    surfaceLevel,
    ...rest
  } = props;

  const { wrapRoundedClasses } = roundedClasses(size, rounded);

  return (
    <Surface
      as={Component}
      className={cn(
        'cladd-toolbar flex',
        color && `color-${color}`,
        wrapRoundedClasses,
        className,
      )}
      outline={outline}
      variant={variant}
      level={surfaceLevel}
      contentClassName={cn(
        'flex h-auto items-center justify-center p-1',
        contentClassName,
      )}
      ref={(el: HTMLElement | null) => {
        elRef.current = el;
        if (ref) (ref as React.RefObject<HTMLElement | null>).current = el;
      }}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      {...rest}
    >
      <ToolbarContextProvider
        value={{
          size,
          rounded,
          variant: buttonVariant,
          outline: buttonOutline,
        }}
      >
        {/* Content */}
        {children}
      </ToolbarContextProvider>
    </Surface>
  );
};
