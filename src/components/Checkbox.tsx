import {
  useRef,
  ElementType,
  ChangeEvent,
  MouseEvent,
  PointerEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { CheckIcon } from './icons/CheckIcon';
import { Surface } from './Surface';

export type CheckboxSize = 'sm' | 'md';

interface CheckboxOwnProps<C extends ElementType = 'label'> {
  /** Controlled checked state. Default `false`. */
  checked?: boolean;
  /** Visually dim the checkbox and disable interaction. */
  disabled?: boolean;
  /** Block toggling without the disabled visual treatment - useful for "locked" states. */
  readOnly?: boolean;
  /** Native `value` - submitted with the form when `checked`. */
  value?: string;
  /** Native `name` - used for form submission and to group radio-like checkboxes. */
  name?: string;
  size?: CheckboxSize;
  required?: boolean;
  /** Fires when the user toggles the checkbox. First arg is the new checked state, second is the raw event (when fired by the hidden `<input>`). */
  onChange?: (checked: boolean, event?: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent) => void;
  onPointerDown?: (e: PointerEvent) => void;
  /**
   * When `true` (default), renders a hidden native `<input type="checkbox">` for form submission and accessibility.
   *
   * When `false`, the component falls back to ARIA roles (`role="checkbox"`, `aria-checked`, keyboard `Space`/`Enter` toggling) and `onChange` is fired from the click handler - useful for non-form contexts (e.g. menu items) or custom controlled wrappers.
   */
  input?: boolean;
  /** `id` for the hidden `<input>`. Used to wire an external `<label htmlFor>` to this checkbox. */
  inputId?: string;
  /** Extra classes for the outer label/element. */
  className?: string;
  /** Extra classes for the inner check icon (e.g. to override its color or size). */
  checkClassName?: string;
  /** Accent color for the checked state. Default: theme accent. */
  color?: Color;
  /**
   * Polymorphic root element. Defaults to `'label'` so a wrapping `<label>` activates the hidden input on click.
   *
   *  Use `'div'`/`'span'` (etc.) when the checkbox lives inside an existing label or needs a non-label container - see `hoverable`/`focusable` for how this changes interactivity.
   */
  as?: C;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'`, otherwise `false`.
   * Override explicitly for custom containers that should still show hover affordances.
   */
  hoverable?: boolean;
  /**
   * Auto-computed when omitted: `true` if `as === 'label'` OR `input` is `true`.
   *
   * Drives whether the focus ring (`FocusableLayer`) is rendered. Override for non-label, input-less containers that still need a visible keyboard focus state.
   */
  focusable?: boolean;
}

export type CheckboxProps<C extends ElementType = 'label'> =
  CheckboxOwnProps<C> &
    Omit<ComponentPropsWithoutRef<C>, keyof CheckboxOwnProps<C>>;

export function Checkbox<C extends ElementType = 'label'>(
  props: CheckboxProps<C>,
) {
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
    input = true,
    inputId,
    className,
    checkClassName,
    color = accentColor,
    as: asProp = 'label',
    hoverable,
    focusable,
    ...rest
  } = props;
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
        role: 'checkbox',
        'aria-checked': checked,
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-required': required || undefined,
        tabIndex: disabled ? -1 : 0,
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (disabled || readOnly) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        },
      }
    : {};

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
        'cladd-checkbox group/cladd-checkbox relative flex shrink-0 items-center justify-center rounded-full p-1 select-none',
        size === 'sm' && 'size-cladd-thumb-sm',
        size === 'md' && 'size-cladd-thumb-md',
        disabled && 'opacity-50',
        className,
      )}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      onClick={handleClick}
      onPointerDown={onPointerDown}
      ref={elRef}
      {...ariaFallback}
      {...rest}
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
        outline
        variant={'gradient'}
        hoverable={hoverableComputed && !disabled && !readOnly}
        clickable={hoverableComputed && !disabled && !readOnly}
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
        outline
        variant={'gradient-fill'}
        hoverable={hoverableComputed && !disabled && !readOnly}
        clickable={hoverableComputed && !disabled && !readOnly}
      />

      <CheckIcon
        data-part="indicator"
        className={cn(
          'pointer-events-none relative duration-200',
          size === 'sm' && 'size-3',
          size === 'md' && 'size-4',
          !checked && 'scale-75 text-cladd-fg-soft',
          checked &&
            !disabled &&
            !readOnly &&
            'group-active/cladd-checkbox:scale-90',
          !checked &&
            !disabled &&
            !readOnly &&
            'group-active/cladd-checkbox:scale-65',
          checked && cn('text-cladd-on-primary'),
          checked && `cladd-color-${color}`,
          checkClassName,
        )}
      />
      {focusableComputed && !disabled && !readOnly && (
        <FocusableLayer className="rounded-full" group="checkbox" />
      )}
    </Component>
  );
}
