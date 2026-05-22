import { useEffect, useRef, useState, ChangeEvent, MouseEvent } from 'react';

import { useAccentColor } from '../hooks/use-accent-color';
import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { Color } from '../types';
import { FocusableLayer } from './FocusableLayer';
import { Surface } from './Surface';
import { SurfaceCut } from './SurfaceCut';

export type SliderSize = 'xs' | 'sm' | 'md';

const SLIDER_RESOLUTION = 1000;

/**
 * Mapping between the user value (passed via `value`, emitted by `onChange`) and the internal slider position (linear 0..1 across the track).
 *
 * - `'linear'` (default): position = (value - min) / (max - min).
 * - `'log'`: equal pixel motion produces equal *ratio* change. Requires `min > 0`.
 * - Object with `toSlider`/`fromSlider`: custom bidirectional mapping.
 *
 * `toSlider(value) -> position` in [0, 1]; `fromSlider(position) -> value`.
 */
export type SliderScale =
  | 'linear'
  | 'log'
  | {
      toSlider: (value: number) => number;
      fromSlider: (position: number) => number;
    };

export interface SliderProps {
  /** Controlled value. When omitted, the component falls back to uncontrolled mode using `defaultValue`. */
  value?: number;
  /** Initial value (uncontrolled). Default `0`.
   *
   * Ignored when `value` is provided.
   */
  defaultValue?: number;
  /** Default `0`. */
  min?: number;
  /** Default `100`. */
  max?: number;
  /**
   * Step size for the emitted value. Default `1`.
   *
   * For non-linear `scale`, the user value is rounded to the nearest `step` after the inverse mapping — so a `log` slider with `step={1}` still emits integer values, but those steps are spaced logarithmically on the track.
   */
  step?: number;
  /** Slider size token. Drives track and thumb dimensions. Default `'sm'`. */
  size?: SliderSize;
  /** Visually dim the slider and disable interaction. */
  disabled?: boolean;
  /** Block dragging without the disabled visual treatment. */
  readOnly?: boolean;
  /** Fires while the user drags or types a new value (subject to `debounce` / `throttle`). */
  onChange?: (value: number, event?: ChangeEvent<HTMLInputElement>) => void;
  /** Extra classes for the slider container. */
  className?: string;
  /** Accent color for the active track segment and thumb. Default: theme accent. */
  color?: Color;
  /** Outline ring on the thumb surface. Default `true`. */
  thumbOutline?: boolean;
  /**
   * Reserved - currently unused in the rendered output (the underlying `<input type="range">` is always present). Kept for parity with other form components.
   */
  input?: boolean;
  /** Debounce onChange calls in ms. Fires once after the user stops changing for N ms. Defaults to 0 (immediate). */
  debounce?: number;
  /** Throttle onChange calls in ms. Fires immediately, then at most once per N ms while changing, with a trailing call for the final value. Defaults to 0 (immediate).
   *
   * Takes precedence over `debounce` when both are set.
   * */
  throttle?: number;
  /**
   * Value-to-position mapping. Default `'linear'`.
   *
   * Use `'log'` (requires `min > 0`) for ranges where ratios matter more than absolute differences — audio frequency, zoom, price brackets.
   * Pass a custom `{ toSlider, fromSlider }` pair for any other curve (quadratic, S-curve, etc.).
   *
   * `min`, `max`, and `value` are always in user-value space. `step` is applied to the emitted value after the inverse mapping (see `step`).
   */
  scale?: SliderScale;
}

/** Shape of `Slider` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type SliderDefaultProps = Partial<
  Omit<SliderProps, 'value' | 'defaultValue' | 'onChange'>
>;

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
    thumbOutline = true,
    input: _input = false,
    debounce = 0,
    throttle = 0,
    scale = 'linear',
  } = useComponentDefaults('Slider', props);

  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = isControlled ? (valueProp as number) : uncontrolledValue;

  const scaleFns =
    scale === 'linear'
      ? null
      : scale === 'log'
        ? {
            toSlider: (v: number) => Math.log(v / min) / Math.log(max / min),
            fromSlider: (p: number) => min * Math.pow(max / min, p),
          }
        : scale;

  const elRef = useRef<HTMLDivElement | null>(null);
  const thumbElRef = useRef<HTMLDivElement | null>(null);
  const progress = scaleFns
    ? scaleFns.toSlider(value)
    : (value - min) / (max - min);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleLastFire = useRef(0);
  const throttlePending = useRef<number | null>(null);
  const isTouched = useRef(false);
  const [isTouchMoved, setIsTouchMoved] = useState(false);

  const onChangeInternal = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    let v = scaleFns ? scaleFns.fromSlider(raw / SLIDER_RESOLUTION) : raw;
    if (scaleFns && step > 0) v = Math.round(v / step) * step;
    if (!isControlled) setUncontrolledValue(v);

    if (throttle > 0) {
      const now = Date.now();
      const elapsed = now - throttleLastFire.current;
      if (elapsed >= throttle) {
        throttleLastFire.current = now;
        throttlePending.current = null;
        if (throttleTimer.current) {
          clearTimeout(throttleTimer.current);
          throttleTimer.current = null;
        }
        onChange(v, e);
      } else {
        throttlePending.current = v;
        if (!throttleTimer.current) {
          throttleTimer.current = setTimeout(() => {
            throttleTimer.current = null;
            if (throttlePending.current !== null) {
              const pending = throttlePending.current;
              throttlePending.current = null;
              throttleLastFire.current = Date.now();
              onChange(pending);
            }
          }, throttle - elapsed);
        }
      }
    } else if (debounce > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onChange(v), debounce);
    } else {
      onChange(v, e);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
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
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        'cladd-slider group/cladd-slider relative flex touch-pan-y select-none',
        size === 'xs' && 'h-cladd-thumb-xs',
        size === 'sm' && 'h-cladd-thumb-sm',
        size === 'md' && 'h-cladd-thumb-md',
        className,
      )}
      onContextMenuCapture={(e: MouseEvent) => e.preventDefault()}
      ref={elRef}
    >
      {/* Track */}
      <SurfaceCut
        data-part="track"
        className={cn(
          'pointer-events-none absolute inset-0 top-1/2 right-0 left-0 rounded-full',
          size === 'xs' || size === 'sm' ? '-mt-0.75 h-1.5' : '-mt-1 h-2',
        )}
      />

      {/* Active BG */}
      <span
        data-part="range"
        className={cn(
          'absolute top-1/2 -mt-px h-0.5 overflow-hidden rounded-full',
          size === 'sm' || size === 'xs'
            ? 'right-px left-px'
            : 'right-0.75 left-0.75',
        )}
      >
        <span
          className={cn(
            `cladd-color-${color}`,
            'absolute inset-0 rounded-full bg-cladd-primary ease-out',
            !disabled &&
              !readOnly &&
              'group-focus-within/slider:-translate-x-3 group-active/slider:-translate-x-3',
            disabled && 'opacity-50',
            durationClass,
          )}
          style={{
            width: `calc((100% - var(--spacing-cladd-thumb-${size})) * ${progress})`,
          }}
        />
      </span>

      {/* Thumb Wrap */}
      <span
        data-part="thumb-wrapper"
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center ease-out group-focus-within/cladd-slider:z-10',
          durationClass,
        )}
        style={{
          paddingLeft: `calc((100% - var(--spacing-cladd-thumb-${size})) * ${progress})`,
        }}
      >
        <span className={cn('relative top-0 size-0 h-0')} data-part="value">
          <Surface
            color={color}
            variant="gradient"
            outline
            className={cn(
              size === 'xs' && 'left-2',
              size === 'sm' && 'left-2.5',
              size === 'md' && 'left-3',
              'absolute -bottom-4 min-w-8 -translate-x-1/2 scale-0 rounded-cladd-2xl px-1 pt-2.5 pb-8 text-center text-cladd-xs leading-none font-medium text-cladd-primary duration-300',
              !disabled &&
                !readOnly &&
                'group-focus-within/cladd-slider:scale-100 group-active/cladd-slider:scale-100',
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
        {/* Thumb */}
        <Surface
          data-part="thumb"
          className={cn(
            'z-10 shrink-0 rounded-full',
            size === 'xs' && 'size-cladd-thumb-xs',
            size === 'sm' && 'size-cladd-thumb-sm',
            size === 'md' && 'size-cladd-thumb-md',
          )}
          outline={thumbOutline}
          variant="gradient-fill"
          color={color}
          ref={thumbElRef}
          wrapContent={false}
        />
      </span>
      <input
        data-part="input"
        className="relative m-0 block w-full appearance-none border-transparent bg-transparent p-0 focus:outline-none"
        type="range"
        disabled={disabled || readOnly}
        readOnly={readOnly}
        value={
          scaleFns
            ? Math.round(scaleFns.toSlider(value) * SLIDER_RESOLUTION)
            : value
        }
        min={scaleFns ? 0 : min}
        max={scaleFns ? SLIDER_RESOLUTION : max}
        step={scaleFns ? 1 : step}
        onChange={onChangeInternal}
      />
    </div>
  );
}
