import { ReactNode, Ref, useEffect, useRef, useState } from 'react';

import { cn } from '../shared/cn';
import { roundedClasses } from '../shared/rounded-classes';
import { Color } from '../types';
import { Button } from './Button';
import { Input, InputSize } from './Input';
import { Surface, SurfaceProps, SurfaceVariant } from './Surface';
import { SurfaceCut } from './SurfaceCut';

export type NumberFieldSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface NumberFieldOwnProps {
  /** Custom content rendered inside the number field container (rare - most usage is value-only). */
  children?: ReactNode;
  /**
   * When `true` (default), the value is rendered in an editable `Input`.
   *
   * When `false`, the value is rendered in a read-only `SurfaceCut` chip - useful when keyboard entry is not desired.
   */
  input?: boolean;
  /** Extra classes for the value `Input` (or `SurfaceCut`). */
  inputClassName?: string;
  /** Extra classes for the number field container. */
  className?: string;
  /** Extra classes for the inner `SurfaceContent` wrapper (where the −/value/+ row is laid out). */
  contentClassName?: string;
  /** Visually dim the number field and disable both buttons. */
  disabled?: boolean;
  /** Block changes without the disabled visual treatment. */
  readOnly?: boolean;
  /** Pill-shape the container and the +/− buttons. Default `true`. */
  rounded?: boolean;
  /** Pill-shape the value display. Default `false`. */
  valueRounded?: boolean;
  /** Size token. Drives container/button height, padding, and font size. Default `'md'`. */
  size?: NumberFieldSize;
  /** Accent color token. Sets the container's `cladd-color-{name}` class - cascades to the +/− buttons. */
  color?: Color;
  /** Outline ring on the number field **container**. Default `true`. */
  outline?: boolean;
  /** Default `0`. */
  min?: number;
  /** Default `1_000_000`. */
  max?: number;
  /** Default `0`. */
  value?: number;
  /** Increment per +/− press. Default `1`. */
  step?: number;
  /** Surface variant for the number field **container**. Default `'gradient'`. */
  variant?: SurfaceVariant;
  /** Surface variant applied to the +/− buttons. Default `'transparent'`. */
  buttonVariant?: SurfaceVariant;
  /** Outline ring on the +/− buttons. Default `false`. */
  buttonOutline?: boolean;
  /** Forwarded to the underlying `Surface` as `level` - see `SurfaceProps.level`. */
  surfaceLevel?: number | string;
  /** Fires after a +/− button press, with the new value (already clamped to `[min, max]`). */
  onChange?: (value: number) => void;
  /** Forwarded to the number field container. */
  ref?: Ref<HTMLDivElement>;
}

export type NumberFieldProps = NumberFieldOwnProps &
  Omit<SurfaceProps, keyof NumberFieldOwnProps>;

export const NumberField = (props: NumberFieldProps) => {
  const {
    children,
    input = true,
    inputClassName = '',
    className = '',
    contentClassName = '',
    disabled = false,
    readOnly = false,
    rounded = true,
    valueRounded = false,
    size = 'md',
    color = '',
    outline = true,
    variant = 'gradient',
    buttonVariant = 'transparent',
    buttonOutline = false,
    surfaceLevel,
    min = 0,
    max = 1000000,
    value = 0,
    step = 1,
    onChange = () => {},
    ref,
    ...rest
  } = props;

  const [draft, setDraft] = useState<string>(String(value));
  const inputElRef = useRef<HTMLInputElement>(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    if (cancellingRef.current) {
      cancellingRef.current = false;
      return;
    }
    const parsed = Number(draft);
    if (draft === '' || Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const snapped = min + Math.round((parsed - min) / step) * step;
    const clamped = Math.min(max, Math.max(min, snapped));
    setDraft(String(clamped));
    if (clamped !== value) onChange(clamped);
  };

  const cancelDraft = () => {
    cancellingRef.current = true;
    setDraft(String(value));
  };

  const decrease = () => {
    if (value <= min || disabled) return;
    onChange(Math.max(min, value - step));
  };

  const increase = () => {
    if (value >= max || disabled) return;
    onChange(Math.min(max, value + step));
  };

  const inputPaddingNoIcon: Record<NumberFieldSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };

  const { itemRoundedClasses } = roundedClasses(size, valueRounded, false);
  const { wrapRoundedClasses } = roundedClasses(size, rounded, false);

  const isFill = variant === 'solid-fill' || variant === 'gradient-fill';
  const buttonVariantComputed =
    isFill && buttonVariant && !buttonVariant.includes('fill')
      ? buttonVariant === 'transparent' || buttonVariant === 'solid'
        ? 'solid-fill'
        : 'gradient-fill'
      : buttonVariant;

  return (
    <Surface
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        'cladd-number-field flex items-center gap-0.5',
        wrapRoundedClasses,
        className,
      )}
      outline={outline}
      variant={variant}
      level={surfaceLevel}
      color={color}
      contentClassName={cn('flex items-center p-1', contentClassName)}
      ref={ref}
      {...rest}
    >
      <Button
        data-part="decrease"
        size={size}
        color={color}
        variant={buttonVariantComputed}
        outline={buttonOutline}
        rounded={rounded}
        readOnly={readOnly}
        disabled={value <= min || disabled}
        onClick={decrease}
        className={cn(
          size === 'xl' && 'min-w-11',
          size === '2xl' && 'min-w-13',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g fill="currentColor">
            <path d="M14.75,9.75H3.25c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75H14.75c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z"></path>
          </g>
        </svg>
      </Button>

      {input ? (
        <Input
          data-part="control"
          size={size as InputSize}
          value={draft}
          disabled={disabled}
          readOnly={readOnly}
          rounded={valueRounded}
          className="w-auto min-w-0 shrink"
          inputClassName={cn(
            'w-auto min-w-9 text-center',
            isFill && 'text-cladd-fg',
            inputClassName,
          )}
          type="number"
          inputRef={inputElRef}
          onChange={setDraft}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              inputElRef.current?.blur();
            } else if (e.key === 'Escape') {
              cancelDraft();
              inputElRef.current?.blur();
            }
          }}
        />
      ) : (
        <SurfaceCut
          data-part="control"
          className={cn(
            'w-auto min-w-9 self-stretch text-center',

            itemRoundedClasses,
          )}
          contentClassName={cn(
            'flex items-center justify-center text-cladd-xs',
            inputPaddingNoIcon[size],
          )}
        >
          {value}
        </SurfaceCut>
      )}

      <Button
        data-part="increase"
        size={size}
        color={color}
        variant={buttonVariantComputed}
        outline={buttonOutline}
        rounded={rounded}
        readOnly={readOnly}
        disabled={value >= max || disabled}
        onClick={increase}
        className={cn(
          size === 'xl' && 'min-w-11',
          size === '2xl' && 'min-w-13',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <g fill="currentColor">
            <path d="M14.75,9.75H3.25c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75H14.75c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z"></path>
            <path d="M9,15.5c-.414,0-.75-.336-.75-.75V3.25c0-.414,.336-.75,.75-.75s.75,.336,.75,.75V14.75c0,.414-.336,.75-.75,.75Z"></path>
          </g>
        </svg>
      </Button>
    </Surface>
  );
};
