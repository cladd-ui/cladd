import {
  useRef,
  ElementType,
  ReactNode,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusRing } from './FocusRing';
import { Surface, SurfaceVariant } from './Surface';

export type SwitchSize = 'sm' | 'md';

interface SwitchOwnProps<C extends ElementType = 'label'> {
  /** Controlled checked state. Default `false`. */
  checked?: boolean;
  /** Visually dim the switch and disable interaction. */
  disabled?: boolean;
  /** Block toggling without the disabled visual treatment. */
  readOnly?: boolean;
  /** Fires when the user toggles. First arg is the new checked state, second is the raw event. */
  onChange?: (
    checked: boolean,
    event?: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Accent color for the checked state thumb fill. Default: theme accent. */
  color?: Color;
  /**
   * Polymorphic root element. Defaults to `'label'` so a wrapping `<label>` activates the hidden input on click.
   *
   * Use a non-label container when nesting inside an existing label — see `hoverable`/`focusable` for how this changes interactivity.
   */
  as?: C;
  /**
   * Icon rendered inside the thumb. Pass either a static `ReactNode`, or a function `(checked) => ReactNode` to render different content based on the switch state.
   *
   * If omitted, the built-in animated cross/check glyph is used.
   */
  icon?: ReactNode | ((checked: boolean) => ReactNode);
  /** Switch size token. Drives track width and thumb size. Default `'md'`. */
  size?: SwitchSize;
  /** Extra classes for the outer label/element. */
  className?: string;
  /**
   * When `true` (default), renders a hidden native `<input type="checkbox" role="switch">` for form submission and accessibility.
   *
   * When `false`, falls back to ARIA roles (`role="switch"`, `aria-checked`, keyboard `Space`/`Enter` toggling).
   */
  input?: boolean;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'`, otherwise `false`.
   *
   * Override explicitly for custom containers that should still show hover affordances.
   */
  hoverable?: boolean;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'` OR `input` is `true`.
   *
   * Drives whether the focus ring (`FocusableLayer`) is rendered on the thumb.
   */
  focusable?: boolean;
  /** Outline ring on the **track** (background surface). Default `true`. */
  outline?: boolean;
  /**
   * Surface level for the **track**. Default `'+1'` - one level deeper than the parent surface.
   *
   * Accepts the same absolute / relative (`"+1"`/`"-1"`) syntax as `Surface.level`.
   */
  surfaceLevel?: string | number;
  /** Surface variant for the **track**. Default `'solid'`. */
  variant?: SurfaceVariant;
  /** Outline ring on the **thumb**. Default `true`. */
  thumbOutline?: boolean;
  /** Surface variant for the **thumb**. Default `'gradient'`. */
  thumbVariant?: SurfaceVariant;
  /**
   * Surface level for the **thumb**. Default `'+2'` - two levels deeper than the parent surface, so the thumb reads as a raised piece on top of the track.
   */
  thumbSurfaceLevel?: string | number;
}

export type SwitchProps<C extends ElementType = 'label'> = SwitchOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof SwitchOwnProps<C>>;

/** Shape of `Switch` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SwitchDefaultProps = Partial<Omit<SwitchOwnProps, 'as'>>;

export function Switch<C extends ElementType = 'label'>(props: SwitchProps<C>) {
  const accentColor = useAccentColor();

  const {
    checked = false,
    disabled = false,
    readOnly,
    onChange = () => {},
    color = accentColor,
    as: asProp = 'label',
    icon,
    size = 'md',
    className,
    input = true,
    hoverable,
    focusable,
    outline = true,
    variant = 'solid',
    surfaceLevel = '+1',
    thumbOutline = true,
    thumbVariant = 'gradient',
    thumbSurfaceLevel = '+2',
  } = useComponentDefaults('Switch', props);
  const elRef = useRef<HTMLElement | null>(null);
  let hoverableComputed = hoverable;
  let focusableComputed = focusable;

  if (typeof hoverableComputed === 'undefined') {
    hoverableComputed = asProp === 'label';
  }
  if (typeof focusableComputed === 'undefined') {
    focusableComputed = asProp === 'label' || input;
  }

  const Component = asProp as ElementType;
  const ariaFallback = !input
    ? {
        role: 'switch',
        'aria-checked': checked,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        tabIndex: disabled ? -1 : 0,
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (disabled || readOnly) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        },
        onClick: () => {
          if (disabled || readOnly) return;
          onChange(!checked);
        },
      }
    : {};
  return (
    <Component
      data-checked={checked || undefined}
      data-unchecked={!checked || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        'cladd-switch group/cladd-switch relative flex shrink-0 rounded-full select-none',
        size === 'sm' && 'w-10 p-1',
        size === 'md' && 'w-12 p-1',
        className,
      )}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      ref={elRef}
      {...ariaFallback}
    >
      {input && (
        <input
          data-part="input"
          checked={checked}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          className="pointer-events-none absolute inset-0 z-10 opacity-0"
          onChange={(e) => onChange(!checked, e)}
        />
      )}

      {/* BG */}
      <Surface
        data-part="track"
        level={surfaceLevel}
        className="absolute inset-0 rounded-full"
        outline={outline}
        variant={variant}
        wrapContent={false}
      />

      {/* Thumb */}
      <Surface
        data-part="thumb"
        className={cn(
          'z-10 rounded-full duration-300',
          size === 'sm' && 'size-cladd-thumb-xs',
          size === 'md' && 'size-cladd-thumb-sm',
          checked && size === 'sm' && `translate-x-cladd-thumb-xs`,
          checked && size === 'md' && `translate-x-cladd-thumb-sm`,
          checked ? 'text-cladd-on-primary' : 'text-cladd-fg-soft',
          disabled && 'opacity-50',
        )}
        contentClassName="flex items-center justify-center"
        variant={thumbVariant}
        outline={thumbOutline}
        level={thumbSurfaceLevel}
        clickable={!disabled && !readOnly}
        hoverable={!disabled && !readOnly}
        beforeContent={
          <Surface
            className={cn(
              'absolute inset-0 size-full shrink-0 rounded-full duration-200',
              !checked && 'scale-0',
              checked ? 'opacity-100' : 'opacity-0',
            )}
            color={color}
            outline={true}
            level={'+0'}
            variant={'gradient-fill'}
            clickable={!disabled && !readOnly}
            hoverable={!disabled && !readOnly}
          />
        }
      >
        {icon && typeof icon === 'function' && icon(checked)}
        {icon && typeof icon !== 'function' && icon}
        {!icon && (
          <span
            data-part="indicator"
            className={cn(
              'absolute inset-0',
              size === 'sm' && 'scale-80',
              checked && `cladd-color-${color}`,
            )}
          >
            <span
              className={cn(
                'absolute inset-0 duration-300 group-active/cladd-switch:scale-90',
                checked && 'rotate-180',
                !checked && size === 'sm' && 'rotate-90',
              )}
            >
              <span
                className={cn(
                  'absolute top-1/2 left-1/2 -mt-px -ml-2 h-0.5 w-4 rotate-45 rounded-full duration-300',
                  checked ? 'bg-cladd-on-primary' : 'bg-cladd-fg-soft',
                  checked
                    ? 'translate-x-0.5 translate-y-[-1.75px] scale-x-40'
                    : 'scale-x-75',
                )}
              />
              <span
                className={cn(
                  'absolute top-1/2 left-1/2 -mt-px -ml-2 h-0.5 w-4 -rotate-45 rounded-full duration-300',
                  checked ? 'bg-cladd-on-primary' : 'bg-cladd-fg-soft',
                  checked
                    ? 'translate-x-[-1.5px] scale-x-60 -rotate-60'
                    : 'scale-x-75',
                )}
              />
            </span>
          </span>
        )}

        {focusableComputed && !disabled && !readOnly && (
          <FocusRing className="rounded-full" group="switch" />
        )}
      </Surface>
    </Component>
  );
}
