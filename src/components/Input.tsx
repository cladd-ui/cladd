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
import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { rootSizeClasses } from '../shared/size-utls';
import { Color } from '../types';
import { Button, ButtonSize } from './Button';
import { FocusRing } from './FocusRing';
import { CloseIcon } from './icons/CloseIcon';
import { SurfaceCut, SurfaceCutOwnProps } from './SurfaceCut';

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
   * Custom node displayed in place of the raw `value` while the input is `readOnly` or unfocused.
   *
   * Useful for formatted display (e.g. show "1,234.56" while the underlying value is `1234.56`) - the real value re-appears on focus for editing.
   */
  displayValue?: ReactNode;
  /** Native `placeholder` shown when the input is empty. */
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
  /** Input size token. Drives height, padding, and font size. Default `'lg'`. */
  size?: InputSize;
  /** Fires on every keystroke. First arg is the new value, second is the raw event. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Forwarded to the inner `<input>` - fires on key down. */
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** Forwarded to the inner `<input>` - fires when the input gains focus. */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  /** Forwarded to the inner `<input>` - fires when the input loses focus. */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /** Called when the clear button is pressed. Pair with `clearButton`. */
  onClear?: () => void;
  /** Accent color token. Drives the focus ring and `infoMessage` colors. Default: theme accent. */
  color?: Color;
  /** Slot rendered before the input element, inside the surface (e.g. unit label, currency symbol). */
  prefix?: ReactNode;
  /** Native `min` attribute. Forwarded to the inner `<input>` (useful for `type="number"`/`"date"`). */
  min?: number | string;
  /** Native `step` attribute. Forwarded to the inner `<input>` (useful for `type="number"`). */
  step?: number | string;
  /** Slot rendered after the input element, inside the surface. */
  suffix?: ReactNode;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Extra classes for the inner `SurfaceCut` content area (where prefix/input/suffix live). */
  contentClassName?: string;
  /** Extra classes for the actual `<input>` element (or `inputComponent`). */
  inputClassName?: string;
  /** Native `max` attribute. Forwarded to the inner `<input>` (useful for `type="number"`/`"date"`). */
  max?: number | string;
  /** Native `maxLength` attribute. */
  maxLength?: number;
  /** Render a clear (X) button on the right that fires `onClear`. Hidden when `value` is empty. */
  clearButton?: boolean;
  /**
   * Validity state. Default `true`. When `false`, switches the focus ring to red and shows `errorMessage` (instead of `infoMessage`).
   */
  valid?: boolean;
  /** Floating label shown above the input on focus. Hidden when `valid === false` or `readOnly`. */
  infoMessage?: ReactNode;
  /** Floating error label. Always visible (no focus required) when `valid === false`. */
  errorMessage?: ReactNode;
  /** Native `pattern` attribute - regex validated on form submission. */
  pattern?: string;
  /** Native `inputMode` - hints at the mobile keyboard layout to display. */
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
  /** Extra classes for the icon wrapper. */
  iconClassName?: string;
  /** Forwarded to the `SurfaceCut` root element. */
  ref?: Ref<HTMLElement>;
  /** Forwarded to the inner `<input>` (or `inputComponent`) element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Native `autoFocus` - focus the input on mount. */
  autoFocus?: boolean;
  /**
   * Polymorphic **input** element. Defaults to `'input'`. Use this to swap in a custom component (e.g. a masked input library) that should still inherit the Input chrome (focus ring, clear button, prefix/suffix, etc.).
   */
  inputComponent?: IC;
  /** Extra props forwarded to the `inputComponent`. Typed against the chosen component. */
  inputComponentProps?: Partial<ComponentPropsWithoutRef<IC>>;
}

export type InputProps<
  C extends ElementType = 'div',
  IC extends ElementType = 'input',
> = InputOwnProps<C, IC> &
  Omit<SurfaceCutOwnProps<C>, keyof InputOwnProps<C, IC> | 'children'> &
  Omit<ComponentPropsWithoutRef<C>, keyof InputOwnProps<C, IC>>;

/** Shape of `Input` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type InputDefaultProps = Partial<
  Omit<
    InputOwnProps,
    | 'as'
    | 'ref'
    | 'inputRef'
    | 'inputComponent'
    | 'inputComponentProps'
    | 'value'
    | 'onChange'
  >
>;

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
    iconClassName = '',
    autoFocus,
    inputComponent = 'input',
    inputComponentProps = {},
    ref: externalRef,
    inputRef: externalInputRef,
    ...rest
  } = useComponentDefaults('Input', props);

  const fontSizes: Record<InputSize, string> = {
    sm: 'text-cladd-xs',
    md: 'text-cladd-xs',
    lg: 'text-cladd-xs',
    xl: 'text-cladd-xs',
    '2xl': 'text-cladd-xs',
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

  const height = rootSizeClasses(size, 'height');

  const prevSize: ButtonSize = {
    sm: '2xs',
    md: 'xs',
    lg: 'sm',
    xl: 'md',
    '2xl': 'lg',
  }[size] as ButtonSize;

  const inputPadding = icon
    ? inputPaddingWithIcon[size]
    : inputPaddingNoIcon[size];

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

  const InputComponent = inputComponent as ElementType<any>;
  const SurfaceCutComponent: ElementType = SurfaceCut;

  const showDisplayValue = displayValue && (readOnly || !focused);
  const showRealValue = !showDisplayValue;
  return (
    <SurfaceCutComponent
      {...rest}
      as={asProp}
      ref={externalRef}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={valid === false || undefined}
      data-required={required || undefined}
      wrapContent={false}
      hoverable={!disabled && !readOnly}
      className={cn(
        'cladd-input group/cladd-input',
        disabled && 'opacity-50',
        itemRoundedClasses,
        className,
      )}
    >
      {/* focus layer */}
      {!readOnly && !disabled && (
        <FocusRing
          className={cn(focusRoundedClasses)}
          force={valid === false}
          color={valid === false ? 'red' : color}
          group="input"
        />
      )}

      {/* input */}
      <div
        data-part="wrapper"
        className={cn('relative flex items-center', contentClassName)}
        onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') return;
          const target = e.target as HTMLElement;
          if (
            target.closest(
              'input, textarea, select, button, a, [role="button"], [tabindex]:not([tabindex="-1"])',
            )
          )
            return;
          e.preventDefault();
          inputElRef.current?.focus();
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(
              'input, textarea, select, button, a, [role="button"], [tabindex]:not([tabindex="-1"])',
            )
          )
            return;
          inputElRef.current?.focus();
        }}
      >
        {prefix}
        {icon && (
          <div
            data-part="icon"
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2',
              iconWrapClasses[size],
              iconClassName,
            )}
          >
            {icon}
          </div>
        )}

        <div className={cn('relative flex w-full')}>
          <InputComponent
            data-part="control"
            tabIndex={disabled || readOnly ? -1 : undefined}
            autoFocus={autoFocus}
            readOnly={readOnly}
            inputMode={inputMode}
            ref={(el: HTMLInputElement | null) => {
              inputElRef.current = el;
              if (externalInputRef) {
                if (typeof externalInputRef === 'function')
                  externalInputRef(el);
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
              height,
              fontSizes[size],
              itemRoundedClasses,
              'w-full appearance-none border-none bg-transparent font-medium shadow-none outline-none',
              disabled && 'text-cladd-fg-softer',
              'placeholder-cladd-fg-softer',
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
              data-part="display-value"
              className={cn(
                inputPadding,
                height,
                fontSizes[size],
                'pointer-events-none absolute inset-0 flex items-center font-medium',
                disabled && 'text-cladd-fg-softer',
                inputClassName,
              )}
            >
              {displayValue}
            </span>
          )}
        </div>
        {clearButton && !disabled && !readOnly && (
          <div
            className={cn(
              'relative mr-1 shrink-0',
              rootSizeClasses(size, 'height'),
              rootSizeClasses(size, 'width'),
            )}
          >
            <Button
              data-part="clear"
              className={cn(
                'absolute top-1 right-0 bottom-1 left-0 h-auto w-auto transform-gpu duration-200',
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
                  'text-cladd-fg-soft',
                  size === 'sm'
                    ? 'size-3!'
                    : size === 'md'
                      ? 'size-3.5!'
                      : 'size-4',
                )}
              />
            </Button>
          </div>
        )}

        {suffix}
      </div>

      {infoMessage && valid !== false && !readOnly && (
        <div
          data-part="info"
          className={cn(
            'pointer-events-none absolute -top-1.5 left-2 z-10 translate-y-0 rounded-cladd-xs bg-cladd-primary px-2 py-0.5 text-cladd-2xs leading-none font-semibold text-cladd-on-primary opacity-0 duration-200 group-has-[input:focus]/cladd-input:-translate-y-1/2 group-has-[input:focus]/cladd-input:opacity-100',
            `cladd-color-${color}`,
          )}
        >
          {infoMessage}
        </div>
      )}
      {errorMessage && valid === false && (
        <div
          data-part="error"
          className={cn(
            'cladd-color-red pointer-events-none absolute -top-1.5 left-2 z-10 -translate-y-1/2 rounded-cladd-xs bg-cladd-primary px-2 py-0.5 text-cladd-2xs leading-none font-semibold text-cladd-on-primary opacity-100 duration-200',
          )}
        >
          {errorMessage}
        </div>
      )}
    </SurfaceCutComponent>
  );
};
