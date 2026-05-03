import {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  useLayoutEffect,
  useState,
} from 'react';

import { cn } from '../shared/cn';
import { Color } from '../types';
import { KeyboardArrowLeftIcon } from './icons/KeyboardArrowLeftIcon';
import { KeyboardBackspaceIcon } from './icons/KeyboardBackspaceIcon';
import { KeyboardCommandIcon } from './icons/KeyboardCommandIcon';
import { KeyboardControlIcon } from './icons/KeyboardControlIcon';
import { KeyboardOptionIcon } from './icons/KeyboardOptionIcon';
import { KeyboardReturnIcon } from './icons/KeyboardReturnIcon';
import { KeyboardShiftIcon } from './icons/KeyboardShiftIcon';
import { KeyboardSpaceIcon } from './icons/KeyboardSpaceIcon';
import { KeyboardTabIcon } from './icons/KeyboardTabIcon';
import { Surface, SurfaceVariant } from './Surface';

export type ShortcutSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ShortcutOwnProps {
  /** Extra classes for the shortcut root container. */
  className?: string;
  /** Extra classes for keyboard icon glyphs (cmd, shift, arrows, etc.). */
  iconClassName?: string;
  /** Render an outline ring on each key surface. Default `true`. */
  outline?: boolean;
  /** Surface variant for each key. Default `'gradient'`. */
  variant?: SurfaceVariant;
  /** Extra classes for each individual key surface. */
  keyClassName?: string;
  /** Extra classes for the inner content of each key. */
  keyContentClassName?: string;
  /**
   * Surface level for each key. Default `'+2'`. Accepts the same absolute / relative
   * (`"+1"`/`"-1"`) syntax as `Surface.level`.
   */
  surfaceLevel?: string | number;
  /** Accent color token applied to each key surface. */
  color?: Color;
  /**
   * Shortcut content. Strings are split on whitespace into individual keys; recognized
   * tokens (`cmd`, `ctrl`, `alt`, `shift`, `enter`, `tab`, `space`, `up`, `down`, `left`,
   * `right`, `backspace`, `delete`, `esc`, etc.) render as glyphs - others render as
   * uppercase text. Non-string children are rendered as-is in their own key.
   */
  children?: ReactNode;
  /** Key dimension. Default `'md'`. Drives height, font size, icon size, and corner radius. */
  size?: ShortcutSize;
  /** Forwarded to the root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
}

export type ShortcutProps = ShortcutOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof ShortcutOwnProps>;

export const Shortcut = (props: ShortcutProps) => {
  const {
    className = '',
    iconClassName = '',
    keyClassName = '',
    keyContentClassName = '',
    surfaceLevel = '+2',
    outline = true,
    variant = 'gradient',
    color,
    children,
    size = 'md',
    ref,
    ...rest
  } = props;

  const [isMac, setIsMac] = useState(false);
  const sizeClass = {
    sm: 'h-4 min-w-4',
    md: 'h-5 min-w-5',
    lg: 'h-6 min-w-6',
    xl: 'h-7 min-w-7',
    '2xl': 'h-8 min-w-8',
  }[size];
  const iconSizeClass = {
    sm: 'size-3',
    md: 'size-3.5',
    lg: 'size-4',
    xl: 'size-5',
    '2xl': 'size-6',
  }[size];
  const roundedClass = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-lg',
    '2xl': 'rounded-lg',
  }[size];
  const fontSizeClass = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-[12px]',
    xl: 'text-[12px]',
    '2xl': 'text-[14px]',
  }[size];
  const iconClass = cn(iconSizeClass, iconClassName);

  const keys: ReactNode[] = [];
  const childrenArray = Array.isArray(children) ? children : [children];

  childrenArray.forEach((shortcut: ReactNode) => {
    if (typeof shortcut === 'string') {
      const s = shortcut.trim().toLowerCase();
      if (!s.length) return;
      keys.push(...s.split(' ').map((k) => k.trim()));
    } else if (shortcut) {
      keys.push(shortcut);
    }
  });

  const isFill = variant === 'solid-fill' || variant === 'gradient-fill';

  const isTextKey = (key: ReactNode) => {
    const icons = [
      'cmd',
      'ctrl',
      'alt',
      'shift',
      'backspace',
      'delete',
      'del',
      'enter',
      'return',
      'space',
      'up',
      'down',
      'left',
      'right',
    ];
    return !icons.includes(key as string);
  };

  const getKey = (key: ReactNode): ReactNode => {
    if (key === 'cmd') {
      if (isMac) {
        return <KeyboardCommandIcon className={iconClass} />;
      }
      return 'CTRL';
    }
    if (key === 'ctrl') {
      if (isMac) {
        return <KeyboardControlIcon className={iconClass} />;
      }
      return 'CTRL';
    }
    if (key === 'alt') {
      if (isMac) {
        return <KeyboardOptionIcon className={iconClass} />;
      }
      return 'ALT';
    }
    if (key === 'shift') {
      return <KeyboardShiftIcon className={iconClass} />;
    }
    if (key === 'backspace' || key === 'delete' || key === 'del') {
      return <KeyboardBackspaceIcon className={iconClass} />;
    }

    if (key === 'escape' || key === 'esc') {
      return 'ESC';
    }
    if (key === 'enter' || key === 'return') {
      return <KeyboardReturnIcon className={iconClass} />;
    }
    if (key === 'tab') {
      return <KeyboardTabIcon className={iconClass} />;
    }
    if (key === 'up') {
      return <KeyboardArrowLeftIcon className={cn('rotate-90', iconClass)} />;
    }
    if (key === 'down') {
      return <KeyboardArrowLeftIcon className={cn('-rotate-90', iconClass)} />;
    }
    if (key === 'left') {
      return <KeyboardArrowLeftIcon className={cn(iconClass)} />;
    }
    if (key === 'right') {
      return <KeyboardArrowLeftIcon className={cn('rotate-180', iconClass)} />;
    }

    if (key === 'space') return <KeyboardSpaceIcon className={iconClass} />;
    return typeof key === 'string' ? key.toUpperCase() : key;
  };
  useLayoutEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'cladd-shortcut inline-flex shrink-0 items-center gap-0.5 self-center align-middle font-mono leading-0 tabular-nums',
        className,
      )}
      {...rest}
    >
      {keys.map((key, index) => (
        <Surface
          data-part="key"
          as="kbd"
          color={color}
          variant={variant}
          level={surfaceLevel}
          className={cn(
            'relative shrink-0 font-semibold',
            !isFill && 'text-cladd-primary',
            fontSizeClass,
            roundedClass,
            sizeClass,
            keyClassName,
          )}
          outline={outline}
          contentClassName={cn(
            'flex items-center justify-center px-0.5',
            isTextKey(key) && 'px-1',
            keyContentClassName,
          )}
          key={index}
        >
          {getKey(key)}
        </Surface>
      ))}
    </div>
  );
};
