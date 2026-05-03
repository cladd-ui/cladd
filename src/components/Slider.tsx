import { useEffect, useRef, useState, ChangeEvent, MouseEvent } from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { Surface } from './Surface';
import { SurfaceCut } from './SurfaceCut';

export type SliderSize = 'sm' | 'md';
export interface SliderProps {
  /** Controlled value. When omitted, the component falls back to uncontrolled mode using `defaultValue`. */
  value?: number;
  /** Initial value (uncontrolled). Default `0`. Ignored when `value` is provided. */
  defaultValue?: number;
  /** Default `0`. */
  min?: number;
  /** Default `100`. */
  max?: number;
  /** Default `1`. */
  step?: number;
  size?: SliderSize;
  /** Visually dim the slider and disable interaction. */
  disabled?: boolean;
  /** Block dragging without the disabled visual treatment. */
  readOnly?: boolean;
  /** Fires while the user drags or types a new value (subject to `debounce`). */
  onChange?: (value: number, event?: ChangeEvent<HTMLInputElement>) => void;
  /** Extra classes for the slider container. */
  className?: string;
  /** Accent color for the active track segment and knob. Default: theme accent. */
  color?: Color;
  /**
   * Reserved - currently unused in the rendered output (the underlying `<input type="range">`
   * is always present). Kept for parity with other form components.
   */
  input?: boolean;
  /** Debounce onChange calls in ms. Defaults to 0 (immediate). */
  debounce?: number;
}

export function Slider(props: SliderProps) {
  const accentColor = useAccentColor();

  const {
    value: valueProp,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    size = 'sm',
    readOnly = false,
    disabled = false,
    onChange = () => {},
    className,
    color = accentColor,
    input: _input = false,
    debounce = 0,
  } = props;

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? (valueProp as number) : uncontrolledValue;

  const elRef = useRef<HTMLDivElement | null>(null);
  const knobElRef = useRef<HTMLDivElement | null>(null);
  const progress = (value - min) / (max - min);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouched = useRef(false);
  const [isTouchMoved, setIsTouchMoved] = useState(false);

  const onChangeInternal = (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (!isControlled) setUncontrolledValue(v);

    if (debounce > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onChange(v), debounce);
    } else {
      onChange(v, e);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const onPointer = (e: PointerEvent) => {
    if (e.type === 'pointerdown') {
      isTouched.current = true;
    }
    if (e.type === 'pointermove' && isTouched.current) {
      setIsTouchMoved(true);
    }
    if (e.type === 'pointerup') {
      isTouched.current = false;
      setIsTouchMoved(false);
    }
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.addEventListener('pointerdown', onPointer);
    document.addEventListener('pointermove', onPointer);
    document.addEventListener('pointerup', onPointer);
    return () => {
      el.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerup', onPointer);
    };
  });

  const durationClass = isTouchMoved ? 'duration-0' : 'duration-300';
  return (
    <div
      className={cn(
        'cladd-slider group/cladd-slider relative flex h-7 touch-pan-y rounded-xl select-none',
        className,
      )}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      ref={elRef}
    >
      {/* Track */}
      <SurfaceCut
        className={cn(
          'pointer-events-none absolute inset-0 top-1/2 right-0 left-0 rounded-full',
          size === 'sm' ? '-mt-0.5 h-1' : '-mt-1 h-2',
        )}
      />

      {/* Active BG */}
      <span
        className={cn(
          'absolute top-1/2 -mt-px h-0.5 overflow-hidden rounded-full',
          size === 'sm' ? 'right-px left-px' : 'right-0.75 left-0.75',
        )}
      >
        <span
          data-color={color}
          className={cn(
            'absolute inset-0 rounded-full bg-cladd-primary ease-out',
            !disabled &&
              !readOnly &&
              'group-focus-within/slider:-translate-x-3 group-active/slider:-translate-x-3',
            disabled && 'opacity-50',
            durationClass,
          )}
          style={{
            width: `calc((100% - ${size === 'sm' ? 20 : 24}px) * ${progress})`,
          }}
        />
      </span>

      {/* Knob Wrap */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center ease-out',
          durationClass,
        )}
        style={{
          paddingLeft: `calc((100% - ${size === 'sm' ? 20 : 24}px) * ${progress})`,
        }}
      >
        <span className="relative top-0 h-0 w-0">
          <Surface
            color={color}
            variant="gradient"
            outline
            className={cn(
              size === 'sm' && '-left-1.5',
              size === 'md' && '-left-1',
              'absolute -bottom-4 w-8 scale-0 rounded-full pt-2.5 pb-8 text-center text-[11px] leading-none font-medium text-cladd-primary duration-300',
              !disabled &&
                !readOnly &&
                'group-focus-within/slider:scale-100 group-active/slider:scale-100',
            )}
            beforeContent={
              !readOnly &&
              !disabled && (
                <FocusableLayer group="slider" className="rounded-full" />
              )
            }
          >
            {value}
          </Surface>
        </span>
        {/* Knob */}
        <Surface
          className={cn(
            'z-10 size-6 shrink-0 rounded-full',
            size === 'sm' && 'size-5',
            size === 'md' && 'size-6',
          )}
          outline
          variant="gradient-fill"
          color={color}
          ref={knobElRef}
        />
      </span>
      <input
        className="relative m-0 block w-full appearance-none border-transparent bg-transparent p-0 focus:outline-none"
        type="range"
        disabled={disabled || readOnly}
        readOnly={readOnly}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChangeInternal}
      />
    </div>
  );
}
