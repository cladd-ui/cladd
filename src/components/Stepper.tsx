import { ReactNode, Ref, ComponentPropsWithoutRef } from 'react';

import { cn } from '../shared/cn';
import { Color } from '../types';
import { Button } from './Button';
import { Input, InputSize } from './Input';
import { SurfaceVariant } from './Surface';
import { SurfaceCut } from './SurfaceCut';

export type StepperSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface StepperOwnProps {
  /** Custom content rendered inside the stepper container (rare - most usage is value-only). */
  children?: ReactNode;
  /**
   * When `true` (default), the value is rendered in an editable `Input`.
   * When `false`, the value is rendered in a read-only `SurfaceCut` chip - useful
   * when keyboard entry is not desired.
   */
  input?: boolean;
  /** Extra classes for the value `Input` (or `SurfaceCut`). */
  inputClassName?: string;
  /** Extra classes for the stepper container. */
  className?: string;
  /** Visually dim the stepper and disable both buttons. */
  disabled?: boolean;
  /** Block changes without the disabled visual treatment. */
  readOnly?: boolean;
  /** Pill-shape the +/− buttons. Default `true`. */
  rounded?: boolean;
  /** Pill-shape the value display. Default `false`. */
  valueRounded?: boolean;
  size?: StepperSize;
  /** Accent color for the +/− buttons. */
  color?: Color;
  /** Outline ring on the +/− buttons. Default `false`. */
  outline?: boolean;
  /** Default `0`. */
  min?: number;
  /** Default `1_000_000`. */
  max?: number;
  /** Default `0`. */
  value?: number;
  /** Increment per +/− press. Default `1`. */
  step?: number;
  /** Surface variant for the +/− buttons. Default `'transparent'`. */
  variant?: SurfaceVariant;
  /** Fires after a +/− button press, with the new value (already clamped to `[min, max]`). */
  onChange?: (value: number) => void;
  /** Forwarded to the stepper container `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type StepperProps = StepperOwnProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof StepperOwnProps>;

export const Stepper = (props: StepperProps) => {
  const {
    children,
    input = true,
    inputClassName = '',
    className = '',
    disabled = false,
    readOnly = false,
    rounded = true,
    valueRounded = false,
    size = 'md',
    color = '',
    outline = false,
    variant = 'transparent',
    min = 0,
    max = 1000000,
    value = 0,
    step = 1,
    onChange = () => {},
    ref,
    ...rest
  } = props;

  const decrease = () => {
    if (value <= min || disabled) return;
    onChange(Math.max(min, value - step));
  };

  const increase = () => {
    if (value >= max || disabled) return;
    onChange(Math.min(max, value + step));
  };

  const inputPaddingNoIcon: Record<StepperSize, string> = {
    sm: 'px-2.5',
    md: 'px-2.5',
    lg: 'px-2.5',
    xl: 'px-2.5',
    '2xl': 'px-3.5',
  };

  const roundedSizes: Record<StepperSize, string> = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-[10px]',
    xl: 'rounded-xl',
    '2xl': 'rounded-xl',
  };

  return (
    <div
      className={cn('stepper flex items-center gap-0.5', className)}
      ref={ref}
      {...rest}
    >
      <Button
        size={size}
        variant={variant}
        color={color}
        outline={outline}
        rounded={rounded}
        readOnly={readOnly}
        disabled={value <= min || disabled}
        onClick={decrease}
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
          size={size as InputSize}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          rounded={valueRounded}
          className="w-auto min-w-0 shrink"
          inputClassName={cn('w-auto min-w-9 text-center', inputClassName)}
        />
      ) : (
        <SurfaceCut
          className={cn(
            'w-auto min-w-9 self-stretch text-center',

            valueRounded ? 'rounded-full' : roundedSizes[size],
          )}
          contentClassName={cn(
            'flex items-center justify-center text-xs',
            inputPaddingNoIcon[size],
          )}
        >
          {value}
        </SurfaceCut>
      )}

      <Button
        size={size}
        variant={variant}
        color={color}
        outline={outline}
        rounded={rounded}
        readOnly={readOnly}
        disabled={value >= max || disabled}
        onClick={increase}
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
    </div>
  );
};
