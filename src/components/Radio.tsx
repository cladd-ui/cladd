import {
  useRef,
  ElementType,
  ChangeEvent,
  MouseEvent,
  PointerEvent,
  KeyboardEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusRing } from './FocusRing';
import { Surface } from './Surface';

export type RadioSize = 'xs' | 'sm' | 'md';

interface RadioOwnProps<C extends ElementType = 'label'> {
  /** Controlled checked state. Default `false`. */
  checked?: boolean;
  /** Visually dim the radio and disable interaction. */
  disabled?: boolean;
  /** Block toggling without the disabled visual treatment. */
  readOnly?: boolean;
  /** Native `value` - submitted with the form when `checked`. */
  value?: string;
  /** Native `name` - used to group radios in the same set. */
  name?: string;
  /** Radio size token. Default `'sm'`. */
  size?: RadioSize;
  /** Native `required` - forwarded to the hidden `<input>` for form validation. */
  required?: boolean;
  /** Fires when the user toggles the radio. First arg is the new checked state, second is the raw event. */
  onChange?: (checked: boolean, event?: ChangeEvent<HTMLInputElement>) => void;
  /** Fires on click of the root element. Runs before the internal toggle handler. */
  onClick?: (e: MouseEvent) => void;
  /** Fires on pointerdown of the root element. */
  onPointerDown?: (e: PointerEvent) => void;
  /**
   * When `true` (default), renders a hidden native input for form submission and accessibility.
   *
   * When `false`, the component falls back to ARIA roles (`role="radio"`, `aria-checked`, keyboard `Space`/`Enter` toggling) and `onChange` fires from the click handler.
   */
  input?: boolean;
  /** `id` for the hidden `<input>`. Used to wire an external `<label htmlFor>` to this radio. */
  inputId?: string;
  /** Extra classes for the outer label/element. */
  className?: string;
  /** Accent color for the checked state. Default: theme accent. */
  color?: Color;
  /** Outline ring on the thumb surfaces. Default `true`. */
  thumbOutline?: boolean;
  /**
   * Polymorphic root element. Defaults to `'label'` so a wrapping `<label>` activates the hidden input on click. Use a non-label container when the radio lives inside an existing label — see `hoverable`/`focusable` for how this changes interactivity.
   */
  as?: C;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'`, otherwise `false`.
   *
   * Override explicitly for custom containers that should still show hover affordances.
   */
  hoverable?: boolean;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'` OR `input` is `true`.
   *
   * Drives whether the focus ring (`FocusableLayer`) is rendered.
   */
  focusable?: boolean;
}

export type RadioProps<C extends ElementType = 'label'> = RadioOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof RadioOwnProps<C>>;

/** Shape of `Radio` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type RadioDefaultProps = Partial<Omit<RadioOwnProps, 'as'>>;

export function Radio<C extends ElementType = 'label'>(props: RadioProps<C>) {
  const accentColor = useAccentColor();

  const {
    checked = false,
    disabled = false,
    readOnly,
    value,
    name,
    size = 'sm',
    required = false,
    onChange = () => {},
    onClick = () => {},
    onPointerDown = () => {},
    onKeyDown: onKeyDownProp,
    input = true,
    inputId,
    className,
    color = accentColor,
    thumbOutline = true,
    as: asProp = 'label',
    hoverable,
    focusable,
    ...rest
  } = useComponentDefaults('Radio', props);
  const elRef = useRef<HTMLElement | null>(null);

  let hoverableComputed = hoverable;
  let focusableComputed = focusable;

  if (typeof hoverableComputed === 'undefined')
    hoverableComputed = asProp === 'label';
  if (typeof focusableComputed === 'undefined')
    focusableComputed = asProp === 'label' || input;

  const Component = asProp as ElementType;
  const ariaFallback = !input
    ? {
        role: 'radio',
        'aria-checked': checked,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-required': required || undefined,
        tabIndex: disabled ? -1 : 0,
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          onKeyDownProp?.(e);
          if (e.defaultPrevented) return;
          if (disabled || readOnly) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        },
      }
    : { onKeyDown: onKeyDownProp };

  const handleClick = (e: MouseEvent) => {
    onClick(e);
    if (!input && !disabled && !readOnly) {
      onChange(!checked);
    }
  };

  return (
    <Component
      data-checked={checked || undefined}
      data-unchecked={!checked || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-required={required || undefined}
      className={cn(
        'cladd-radio group/cladd-radio relative flex shrink-0 items-center justify-center rounded-full select-none',
        size === 'xs' && 'size-cladd-thumb-xs p-0',
        size === 'sm' && 'size-cladd-thumb-sm p-1',
        size === 'md' && 'size-cladd-thumb-md p-1',

        disabled && 'opacity-50',
        className,
      )}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      ref={elRef}
      {...rest}
      {...ariaFallback}
      onClick={handleClick}
      onPointerDown={onPointerDown}
    >
      {input && (
        <input
          data-part="input"
          id={inputId}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          checked={checked}
          required={required}
          type="checkbox"
          value={value}
          name={name}
          className="pointer-events-none absolute inset-1 z-10 opacity-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(!checked, e)}
        />
      )}

      {/* Thumb */}
      <Surface
        data-part="thumb"
        className={cn(
          'absolute inset-0 size-full shrink-0 rounded-full duration-200',
        )}
        outline={thumbOutline}
        variant={'gradient'}
        hoverable={hoverableComputed && !disabled && !readOnly}
        clickable={hoverableComputed && !disabled && !readOnly}
        wrapContent={false}
      />

      {/* Checked Thumb */}
      <Surface
        data-part="thumb-checked"
        className={cn(
          'absolute inset-0 size-full shrink-0 rounded-full duration-200',
          !checked && 'scale-0',
          checked ? 'opacity-100' : 'opacity-0',
        )}
        color={color}
        outline={thumbOutline}
        variant={'gradient-fill'}
        hoverable={hoverableComputed && !disabled && !readOnly}
        clickable={hoverableComputed && !disabled && !readOnly}
        wrapContent={false}
      />

      {/* Check */}
      <span
        data-part="indicator"
        className={cn(
          'pointer-events-none relative size-2 rounded-full duration-200',
          size === 'xs' ? 'size-1.5' : 'size-2',
          !checked &&
            cn(
              'scale-75 bg-cladd-fg-soft',
              !readOnly && !disabled && 'group-active/cladd-radio:scale-65',
            ),
          checked &&
            cn(
              `cladd-color-${color}`,
              'bg-cladd-on-primary',
              !disabled && !readOnly && 'group-active/cladd-radio:scale-90',
            ),
        )}
      />
      {focusableComputed && !disabled && !readOnly && (
        <FocusRing className="rounded-full" group="radio" />
      )}
    </Component>
  );
}
