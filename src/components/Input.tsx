import {
  useRef,
  useState,
  ElementType,
  ReactNode,
  Ref,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
  ComponentPropsWithoutRef,
} from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { Color } from '../types';
import { Button, ButtonSize } from './Button';
import { FocusableLayer } from './FocusableLayer';
import { CloseIcon } from './icons/CloseIcon';
import { SurfaceCut } from './SurfaceCut';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface InputOwnProps<
  C extends ElementType = 'div',
  IC extends ElementType = 'input',
> {
  /** Polymorphic **wrapper** element. Defaults to `'div'`. (For the inner input, see `inputComponent`.) */
  as?: C;
  /** Native `<input type>`. Default `'text'`. */
  type?: string;
  /** Controlled value. */
  value?: string | number;
  /**
   * Custom node displayed in place of the raw `value` while the input is `readOnly` or
   * unfocused. Useful for formatted display (e.g. show "1,234.56" while the underlying
   * value is `1234.56`) - the real value re-appears on focus for editing.
   */
  displayValue?: ReactNode;
  placeholder?: string;
  /** Native `name` attribute, used for form submission. */
  name?: string;
  /** Native `required` attribute. Default `false`. */
  required?: boolean;
  /** Visually dim the input and disable interaction. Default `false`. */
  disabled?: boolean;
  /** Make the input non-editable but still focusable for value display/copying. */
  readOnly?: boolean;
  /** `id` for the inner `<input>`. Used to wire an external `<label htmlFor>`. */
  inputId?: string;
  /** Apply pill (`rounded-full`) corners. Default `false` - uses size-specific radii. */
  rounded?: boolean;
  size?: InputSize;
  /** Fires on every keystroke. First arg is the new value, second is the raw event. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /** Called when the clear button is pressed. Pair with `clearButton`. */
  onClear?: () => void;
  /** Accent color token. Drives the focus ring and `infoMessage` colors. Default: theme accent. */
  color?: Color;
  /** Slot rendered before the input element, inside the surface (e.g. unit label, currency symbol). */
  prefix?: ReactNode;
  min?: number | string;
  step?: number | string;
  /** Slot rendered after the input element, inside the surface. */
  suffix?: ReactNode;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Extra classes for the inner `SurfaceCut` content area (where prefix/input/suffix live). */
  contentClassName?: string;
  /** Extra classes for the actual `<input>` element (or `inputComponent`). */
  inputClassName?: string;
  max?: number | string;
  maxLength?: number;
  /** Render a clear (X) button on the right that fires `onClear`. Hidden when `value` is empty. */
  clearButton?: boolean;
  /**
   * Validity state. Default `true`. When `false`, switches the focus ring to red and shows
   * `errorMessage` (instead of `infoMessage`).
   */
  valid?: boolean;
  /** Floating label shown above the input on focus. Hidden when `valid === false` or `readOnly`. */
  infoMessage?: ReactNode;
  /** Floating error label. Always visible (no focus required) when `valid === false`. */
  errorMessage?: ReactNode;
  pattern?: string;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  /** Icon node rendered inside the surface, absolutely positioned on the left. Shifts input padding. */
  icon?: ReactNode;
  /** Extra classes applied to the inner `SurfaceCut`. */
  surfaceClassName?: string;
  /** Forwarded to the wrapper element. */
  ref?: Ref<HTMLElement>;
  /** Forwarded to the inner `<input>` (or `inputComponent`) element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Native `autoFocus` - focus the input on mount. */
  autoFocus?: boolean;
  /**
   * Polymorphic **input** element. Defaults to `'input'`. Use this to swap in a custom
   * component (e.g. a masked input library) that should still inherit the Input chrome
   * (focus ring, clear button, prefix/suffix, etc.).
   */
  inputComponent?: IC;
  /** Extra props forwarded to the `inputComponent`. Typed against the chosen component. */
  inputComponentProps?: Partial<ComponentPropsWithoutRef<IC>>;
}

export type InputProps<
  C extends ElementType = 'div',
  IC extends ElementType = 'input',
> = InputOwnProps<C, IC> &
  Omit<ComponentPropsWithoutRef<C>, keyof InputOwnProps<C, IC>>;

export const Input = <
  C extends ElementType = 'div',
  IC extends ElementType = 'input',
>(
  props: InputProps<C, IC>,
) => {
  const accentColor = useAccentColor();

  const {
    as: asProp = 'div',
    type = 'text',
    value,
    displayValue,
    placeholder,
    name,
    required = false,
    disabled = false,
    readOnly,
    inputId,
    rounded = false,
    size = 'lg',
    onChange = () => {},
    onKeyDown = () => {},
    onFocus = () => {},
    onBlur = () => {},
    onClear = () => {},
    color = accentColor,
    prefix,
    min,
    step,
    suffix,
    className,
    contentClassName,
    inputClassName,
    max,
    maxLength,
    clearButton,
    valid = true,
    infoMessage,
    errorMessage,
    pattern,
    inputMode,
    icon,
    surfaceClassName,
    autoFocus,
    inputComponent = 'input',
    inputComponentProps = {},
    ref: externalRef,
    inputRef: externalInputRef,
  } = props;

  const fontSizes: Record<InputSize, string> = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-xs',
    xl: 'text-xs',
    '2xl': 'text-xs',
  };

  const iconWrapClasses: Record<InputSize, string> = {
    sm: 'left-2.5 [&>svg]:size-4',
    md: 'left-2.5 [&>svg]:size-4',
    lg: 'left-2.5 [&>svg]:size-4',
    xl: 'left-2.5 [&>svg]:size-4',
    '2xl': 'left-3.5 [&>svg]:size-4',
  };
  const inputPaddingNoIcon: Record<InputSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };
  const inputPaddingWithIcon: Record<InputSize, string> = {
    sm: 'pl-8.5 pr-2',
    md: 'pl-8.5 pr-2',
    lg: 'pl-8.5 pr-3',
    xl: 'pl-8.5 pr-3',
    '2xl': 'pl-9.5 pr-4',
  };

  const { itemRoundedClasses, focusRoundedClasses } = roundedClasses(
    size,
    rounded,
    false,
  );

  const heights: Record<InputSize, string> = {
    sm: 'h-6',
    md: 'h-7',
    lg: 'h-8',
    xl: 'h-10',
    '2xl': 'h-12',
  };

  const prevSize: ButtonSize = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg',
    '2xl': 'xl',
  }[size] as ButtonSize;

  const inputPadding = icon
    ? inputPaddingWithIcon[size]
    : inputPaddingNoIcon[size];

  const elRef = useRef<HTMLElement | null>(null);
  const inputElRef = useRef<HTMLInputElement | null>(null);

  const [focused, setFocused] = useState(false);

  const onFocusInternal = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus(e);
  };
  const onBlurInternal = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur(e);
  };

  const Component = asProp as ElementType;

  const InputComponent = inputComponent as ElementType<any>;

  const showDisplayValue = displayValue && (readOnly || !focused);
  const showRealValue = !showDisplayValue;
  return (
    <Component
      className={cn(
        'cladd-input group/cladd-input relative',
        disabled && 'opacity-50',
        className,
      )}
    >
      {/* focus layer */}
      {!readOnly && !disabled && (
        <FocusableLayer
          className={cn(focusRoundedClasses, valid === false && 'color-red')}
          force={valid === false}
          color={valid === false ? 'red' : color}
          group="input"
        />
      )}

      {/* input */}
      <SurfaceCut
        className={cn(itemRoundedClasses, surfaceClassName)}
        hoverable={!disabled && !readOnly}
        contentClassName={cn('flex items-center', contentClassName)}
        onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
        ref={(el: HTMLElement | null) => {
          elRef.current = el;
          if (externalRef) {
            if (typeof externalRef === 'function') externalRef(el);
            else
              (externalRef as React.RefObject<HTMLElement | null>).current = el;
          }
        }}
      >
        {prefix}
        {icon && (
          <div
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2',
              iconWrapClasses[size],
            )}
          >
            {icon}
          </div>
        )}

        <InputComponent
          tabIndex={disabled || readOnly ? -1 : undefined}
          autoFocus={autoFocus}
          readOnly={readOnly}
          inputMode={inputMode}
          ref={(el: HTMLInputElement | null) => {
            inputElRef.current = el;
            if (externalInputRef) {
              if (typeof externalInputRef === 'function') externalInputRef(el);
              else
                (
                  externalInputRef as React.RefObject<HTMLInputElement | null>
                ).current = el;
            }
          }}
          id={inputId}
          type={type}
          disabled={disabled}
          value={value}
          name={name}
          required={required}
          placeholder={placeholder}
          className={cn(
            inputPadding,
            heights[size],
            fontSizes[size],
            itemRoundedClasses,
            'w-full appearance-none border-none bg-transparent font-medium shadow-none outline-none',
            disabled && 'text-on-surface-darker',
            'placeholder-on-surface-darker',
            !showRealValue && 'text-transparent! placeholder-transparent!',
            inputClassName,
          )}
          onFocus={onFocusInternal}
          onBlur={onBlurInternal}
          onKeyDown={onKeyDown}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value, e)
          }
          maxLength={maxLength}
          max={max}
          min={min}
          pattern={pattern}
          step={step}
          {...inputComponentProps}
        />

        {showDisplayValue && (
          <span
            className={cn(
              inputPadding,
              heights[size],
              fontSizes[size],
              'pointer-events-none absolute inset-0 flex items-center font-medium',
              disabled && 'text-on-surface-darker',
              inputClassName,
            )}
          >
            {displayValue}
          </span>
        )}
        {clearButton && !disabled && !readOnly && (
          <Button
            className={cn(
              'mr-1 -ml-2 w-auto shrink-0 transform-gpu duration-200',
              size === 'sm' && 'h-4 w-5',
              size === 'md' && 'h-5 w-6',
              size === 'lg' && 'h-6 w-7',
              size === 'xl' && 'h-8 w-9',
              size === '2xl' && 'h-10 w-11',
              !value && 'pointer-events-none scale-0',
            )}
            contentClassName="px-0"
            disabled={!value}
            rounded={rounded}
            size={prevSize}
            outline={false}
            onClick={onClear}
          >
            <CloseIcon
              className={cn(
                'text-on-surface-dark',
                size === 'sm'
                  ? 'size-3!'
                  : size === 'md'
                    ? 'size-3.5!'
                    : 'size-4',
              )}
            />
          </Button>
        )}

        {suffix}
      </SurfaceCut>

      {infoMessage && valid !== false && !readOnly && (
        <div
          className={cn(
            'pointer-events-none absolute -top-1.5 left-2 z-10 translate-y-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] leading-none font-semibold text-on-primary opacity-0 duration-200 group-has-[input:focus]/input:-translate-y-1/2 group-has-[input:focus]/input:opacity-100',
            `color-${color}`,
          )}
        >
          {infoMessage}
        </div>
      )}
      {errorMessage && valid === false && (
        <div
          className={cn(
            'pointer-events-none absolute -top-1.5 left-2 z-10 -translate-y-1/2 rounded-sm bg-primary px-1 py-0.5 text-[10px] leading-none font-semibold text-on-primary opacity-100 duration-200',
            `color-red`,
          )}
        >
          {errorMessage}
        </div>
      )}
    </Component>
  );
};
