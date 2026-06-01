import {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import {
  buildColorValue,
  CHECKER,
  ColorEditorValue,
  ColorInput,
  ColorValue,
  colorSignature,
  GradientInput,
  GradientStop,
  gradientCss,
  gradientPreviewCss,
  Hsva,
  hslToHsv,
  hsvToHsl,
  hsvToRgb,
  isGradientInput,
  parseColor,
  parseGradient,
  rgbToHsv,
} from '../shared/color';
import { Button, ButtonSize } from './Button';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { FlipIcon } from './icons/FlipIcon';
import { GradientColorIcon } from './icons/GradientColorIcon';
import { SolidColorIcon } from './icons/SolidColorIcon';
import { Input } from './Input';
import { NumberScrubber } from './NumberScrubber';
import { Segmented } from './Segmented';
import { SegmentedButton } from './SegmentedButton';
import { Toolbar } from './Toolbar';

/** Size token for the inner controls (scrubbers, hex input, gradient buttons). */
export type ColorEditorControlSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Which channel scrubbers the inputs row shows. Does not affect the emitted value. */
export type ColorEditorFormat = 'rgb' | 'hsl' | 'hsb';

interface ColorEditorBaseProps {
  /** Size of the inner controls — scrubbers, hex input, gradient buttons. Default `'md'`.
   *
   * The Solid/Gradient toolbar is rendered one step smaller.
   */
  controlSize?: ColorEditorControlSize;
  /** Render the surface outline on the inner controls — channel/alpha scrubbers, hex input, and the Solid/Gradient toolbar.
   *
   *  The gradient bar's flip/angle controls stay ghost regardless. Default `true`.
   */
  controlOutline?: boolean;
  /** Show the alpha slider and the alpha scrubber. Default `true`. */
  alpha?: boolean;
  /** Show the channel-scrubber row. Default `true`. */
  inputs?: boolean;
  /** Which channels the scrubber row shows. Default `'rgb'`. */
  format?: ColorEditorFormat;
  /** Show the hex input. Default `true`. */
  hexInput?: boolean;
  /** Angle control in gradient mode: a 45°-step button, or a degree scrubber. Default `'scrubber'`. */
  angleControl?: 'button' | 'scrubber';
  /** Preset colors rendered as a row of thumbs. Clicking one applies it to the color (or the selected gradient stop).
   *
   * Solid colors only.
   */
  swatches?: ColorInput[];
  /** Dim the panel and block interaction. */
  disabled?: boolean;
  /** Block interaction without the dimmed treatment. */
  readOnly?: boolean;
  /** Debounce `onChange` calls in ms. Fires once after changes stop for N ms. Defaults to `0` (immediate). */
  debounce?: number;
  /** Throttle `onChange` calls in ms. Fires immediately, then at most once per N ms while changing, with a trailing call for the final value. Defaults to `0` (immediate).
   *
   * Takes precedence over `debounce`.
   */
  throttle?: number;
  /** Content rendered above the panel, before the controls.
   *
   * Stays interactive when `disabled` (only the panel below dims).
   *
   * For inherit toggles, titles, eyedroppers, etc.
   * */
  header?: React.ReactNode;
  /** Content rendered below the panel, after the swatches. Stays interactive when `disabled`. */
  footer?: React.ReactNode;
  /** Extra classes for the panel root. The panel is full-width — size it via its container. */
  className?: string;
  /** Extra classes for the saturation/brightness area (e.g. to set its height). */
  areaClassName?: string;
  /** Forwarded to the panel root element. */
  ref?: Ref<HTMLDivElement>;
}

type SolidColorEditorProps = ColorEditorBaseProps & {
  /** Enable the Solid/Gradient switch and gradient editing. Default `false`. */
  gradient?: false;
  /** Controlled value. A CSS color string or any one channel set. */
  value?: ColorInput;
  /** Initial value (uncontrolled). */
  defaultValue?: ColorInput;
  /** Fires on every change with the full color. */
  onChange?: (value: ColorValue) => void;
};

type GradientColorEditorProps = ColorEditorBaseProps & {
  gradient: true;
  /** Controlled value. A CSS color/gradient string, a channel set, or a gradient object. */
  value?: ColorInput | GradientInput;
  /** Initial value (uncontrolled). */
  defaultValue?: ColorInput | GradientInput;
  /** Fires on every change with a discriminated `solid` / `linear` value. */
  onChange?: (value: ColorEditorValue) => void;
};

export type ColorEditorProps = SolidColorEditorProps | GradientColorEditorProps;

/** Shape of `ColorEditor` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ColorEditorDefaultProps = Partial<
  Omit<ColorEditorBaseProps, 'ref'>
>;

type ResolvedProps = ColorEditorBaseProps & {
  gradient?: boolean;
  value?: ColorInput | GradientInput;
  defaultValue?: ColorInput | GradientInput;
  onChange?: (value: ColorValue | ColorEditorValue) => void;
};

type Mode = 'solid' | 'linear';
type Stop = { hsva: Hsva; position: number };
type Internal = {
  mode: Mode;
  solid: Hsva;
  angle: number;
  stops: [Stop, Stop];
  active: 0 | 1;
};

// Fixed dimensions — customize the area via `areaClassName`, the panel via `className`.
const AREA_H = 'h-36';
const BAR_H = 'h-3';
const THUMB = 'size-4';
const THUMB_PX = 16;
const SWATCH = 'size-4';

/** The Solid/Gradient toolbar renders one step below `controlSize`. */
const TOOLBAR_SIZE: Record<ColorEditorControlSize, ButtonSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  '2xl': 'xl',
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const wrap360 = (n: number) => ((n % 360) + 360) % 360;
const r0 = (n: number) => Math.round(n);

/** Center-position a thumb so it never overshoots the track ends. */
const thumbLeft = (fraction: number) =>
  `calc(${fraction} * (100% - ${THUMB_PX}px) + ${THUMB_PX / 2}px)`;

const THUMB_CLASS =
  'absolute rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-cladd-primary';

const HUE_TRACK =
  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)';

// ── helpers ──────────────────────────────────────────────────────────────────

const cloneInternal = (d: Internal): Internal => ({
  mode: d.mode,
  solid: { ...d.solid },
  angle: d.angle,
  stops: [
    { hsva: { ...d.stops[0].hsva }, position: d.stops[0].position },
    { hsva: { ...d.stops[1].hsva }, position: d.stops[1].position },
  ],
  active: d.active,
});

const currentOf = (d: Internal): Hsva =>
  d.mode === 'linear' ? d.stops[d.active].hsva : d.solid;

const sortedStops = (d: Internal): GradientStop[] =>
  d.stops
    .map((s) => ({ color: buildColorValue(s.hsva), position: s.position }))
    .sort((a, b) => a.position - b.position);

const isValidHex = (text: string) =>
  /^[0-9a-fA-F]{3,8}$/.test(text) && [3, 4, 6, 8].includes(text.length);

const LetterIcon = (props: { children: React.ReactNode }) => {
  return (
    <span className="flex size-4 items-center justify-center text-cladd-xs font-medium text-cladd-fg-soft">
      {props.children}
    </span>
  );
};

export const ColorEditor = (props: ColorEditorProps) => {
  const resolved = useComponentDefaults(
    'ColorEditor',
    props,
  ) as unknown as ResolvedProps;

  const {
    controlSize = 'md',
    controlOutline = true,
    alpha = true,
    inputs = true,
    format = 'rgb',
    hexInput = true,
    angleControl = 'scrubber',
    swatches,
    gradient = false,
    disabled = false,
    readOnly = false,
    debounce = 0,
    throttle = 0,
    header,
    footer,
    value,
    defaultValue,
    onChange,
    className,
    areaClassName,
    ref,
  } = resolved;

  const interactive = !disabled && !readOnly;
  const toolbarSize = TOOLBAR_SIZE[controlSize];

  // The alpha % scrubber rides along with the hex input — show it only when
  // alpha, the input row, and the hex input are all on. On its own the alpha
  // *slider* already covers transparency, so a lone scrubber adds nothing.
  const alphaInput = alpha && inputs && hexInput;

  const seedFrom = (
    input: ColorInput | GradientInput | undefined,
  ): Internal => {
    if (gradient && isGradientInput(input)) {
      const parsed = parseGradient(input);
      const list = parsed?.stops ?? [];
      const s0 = list[0] ?? { hsva: { h: 0, s: 0, v: 0, a: 1 }, position: 0 };
      const s1 = list[list.length - 1] ?? {
        hsva: { h: 0, s: 0, v: 100, a: 1 },
        position: 100,
      };
      return {
        mode: 'linear',
        solid: { ...s0.hsva },
        angle: parsed?.angle ?? 90,
        stops: [
          { hsva: { ...s0.hsva }, position: s0.position },
          { hsva: { ...s1.hsva }, position: s1.position },
        ],
        active: 0,
      };
    }
    const hsva = parseColor(input as ColorInput | undefined);
    return {
      mode: 'solid',
      solid: hsva,
      angle: 90,
      stops: [
        { hsva: { ...hsva }, position: 0 },
        { hsva: { ...hsva, a: 0 }, position: 100 },
      ],
      active: 0,
    };
  };

  const buildOutput = (d: Internal): ColorValue | ColorEditorValue => {
    if (!gradient) return buildColorValue(d.solid);
    if (d.mode === 'solid') {
      return { type: 'solid', ...buildColorValue(d.solid) };
    }
    const stops = sortedStops(d);
    return {
      type: 'linear',
      angle: d.angle,
      stops,
      css: gradientCss(d.angle, stops),
    };
  };

  const signatureOf = (d: Internal): string => {
    if (!gradient) return colorSignature(d.solid);
    if (d.mode === 'solid') return `solid|${colorSignature(d.solid)}`;
    return `linear|${d.angle}|${sortedStops(d)
      .map((s) => `${s.position}:${s.color.hex}`)
      .join('|')}`;
  };

  const isControlled = value !== undefined;
  const internalRef = useRef<Internal>(seedFrom(value ?? defaultValue));
  const [internal, setInternal] = useState<Internal>(internalRef.current);
  const lastSigRef = useRef<string>(signatureOf(internalRef.current));
  const interactingRef = useRef(false);

  // Rate-limit only the outward `onChange`; internal state always updates
  // immediately so the panel stays responsive. Mirrors Slider's debounce /
  // throttle semantics. The trailing call guarantees the final value is emitted.
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleLastFire = useRef(0);
  const throttlePending = useRef<ColorValue | ColorEditorValue | null>(null);

  const emitChange = (out: ColorValue | ColorEditorValue) => {
    if (!onChange) return;
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
        onChange(out);
      } else {
        throttlePending.current = out;
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
      debounceTimer.current = setTimeout(() => onChange(out), debounce);
    } else {
      onChange(out);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
    };
  }, []);

  // Sync external (controlled) value changes. Skipped while the user is
  // interacting — mid-drag the component is the source of truth, and our own
  // rapid onChange echoes would otherwise race back in and clobber state.
  // The signature guard ignores the (non-interacting) echo of what we emitted;
  // `active` is UI-only, so it's always preserved across a reseed.
  useEffect(() => {
    if (!isControlled || interactingRef.current) return;
    const seeded = seedFrom(value);
    const sig = signatureOf(seeded);
    if (sig !== lastSigRef.current) {
      seeded.active = internalRef.current.active;
      lastSigRef.current = sig;
      internalRef.current = seeded;
      setInternal(seeded);
    }
    // Only `value` — the helpers close over render-stable props.
  }, [value]);

  const patch = (mutate: (draft: Internal) => void, emit = true) => {
    const next = cloneInternal(internalRef.current);
    mutate(next);
    internalRef.current = next;
    setInternal(next);
    if (emit) {
      lastSigRef.current = signatureOf(next);
      emitChange(buildOutput(next));
    }
  };

  const cur = currentOf(internal);
  const opaque = buildColorValue({ ...cur, a: 1 }).hex;
  const curValue = buildColorValue(cur);
  const rgb = curValue.rgb;
  const hsl = curValue.hsl;

  // ── pointer dragging ────────────────────────────────────────────────────────

  const areaElRef = useRef<HTMLDivElement | null>(null);
  const hueElRef = useRef<HTMLDivElement | null>(null);
  const alphaElRef = useRef<HTMLDivElement | null>(null);
  const gradientBarRef = useRef<HTMLDivElement | null>(null);

  const drag = (
    el: HTMLElement | null,
    e: ReactPointerEvent,
    onPos: (x: number, y: number) => void,
    padX = 0,
  ) => {
    if (!interactive || !el || e.button !== 0) return;
    interactingRef.current = true;
    const rect = el.getBoundingClientRect();
    const travel = rect.width - 2 * padX;
    const apply = (clientX: number, clientY: number) => {
      onPos(
        clamp((clientX - rect.left - padX) / travel, 0, 1),
        clamp((clientY - rect.top) / rect.height, 0, 1),
      );
    };
    apply(e.clientX, e.clientY);
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault();
      apply(ev.clientX, ev.clientY);
    };
    const onUp = () => {
      interactingRef.current = false;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const onAreaDown = (e: ReactPointerEvent) =>
    drag(areaElRef.current, e, (x, y) =>
      patch((d) => {
        const c = currentOf(d);
        c.s = x * 100;
        c.v = (1 - y) * 100;
      }),
    );

  const onHueDown = (e: ReactPointerEvent) =>
    drag(
      hueElRef.current,
      e,
      (x) =>
        patch((d) => {
          currentOf(d).h = x * 360;
        }),
      THUMB_PX / 2,
    );

  const onAlphaDown = (e: ReactPointerEvent) =>
    drag(
      alphaElRef.current,
      e,
      (x) =>
        patch((d) => {
          currentOf(d).a = Math.round(x * 100) / 100;
        }),
      THUMB_PX / 2,
    );

  // ── keyboard ────────────────────────────────────────────────────────────────

  const kstep = (e: ReactKeyboardEvent) => (e.shiftKey ? 10 : 1);

  const onAreaKey = (e: ReactKeyboardEvent) => {
    if (!interactive) return;
    const d = kstep(e);
    const map: Record<string, () => void> = {
      ArrowLeft: () =>
        patch((x) => (currentOf(x).s = clamp(cur.s - d, 0, 100))),
      ArrowRight: () =>
        patch((x) => (currentOf(x).s = clamp(cur.s + d, 0, 100))),
      ArrowUp: () => patch((x) => (currentOf(x).v = clamp(cur.v + d, 0, 100))),
      ArrowDown: () =>
        patch((x) => (currentOf(x).v = clamp(cur.v - d, 0, 100))),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  const onHueKey = (e: ReactKeyboardEvent) => {
    if (!interactive) return;
    const d = kstep(e);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      patch(
        (x) =>
          (currentOf(x).h = wrap360(cur.h + (e.key === 'ArrowRight' ? d : -d))),
      );
    }
  };

  const onAlphaKey = (e: ReactKeyboardEvent) => {
    if (!interactive) return;
    const d = (e.shiftKey ? 10 : 1) / 100;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      patch(
        (x) =>
          (currentOf(x).a = clamp(
            Math.round((cur.a + (e.key === 'ArrowRight' ? d : -d)) * 100) / 100,
            0,
            1,
          )),
      );
    }
  };

  // ── channel scrubbers ─────────────────────────────────────────────────────────

  const setRgb = (key: 'r' | 'g' | 'b', v: number) =>
    patch((d) => {
      const c = currentOf(d);
      const next = { ...hsvToRgb(c) };
      next[key] = clamp(r0(v), 0, 255);
      const h = rgbToHsv(next);
      if (h.s !== 0) c.h = h.h;
      if (h.v !== 0) c.s = h.s;
      c.v = h.v;
    });

  const setHsl = (key: 'h' | 's' | 'l', v: number) =>
    patch((d) => {
      const c = currentOf(d);
      const next = hsvToHsl(c);
      next[key] = key === 'h' ? wrap360(v) : clamp(v, 0, 100);
      const h = hslToHsv(next.h, next.s, next.l, c.a);
      c.h = next.h;
      c.s = h.s;
      c.v = h.v;
    });

  const setHsb = (key: 'h' | 's' | 'b', v: number) =>
    patch((d) => {
      const c = currentOf(d);
      if (key === 'h') c.h = wrap360(v);
      else if (key === 's') c.s = clamp(v, 0, 100);
      else c.v = clamp(v, 0, 100);
    });

  type ChannelDef = {
    label: string;
    value: number;
    min: number;
    max: number;
    set: (v: number) => void;
  };

  const channels: ChannelDef[] =
    format === 'rgb'
      ? [
          {
            label: 'R',
            value: rgb.r,
            min: 0,
            max: 255,
            set: (v) => setRgb('r', v),
          },
          {
            label: 'G',
            value: rgb.g,
            min: 0,
            max: 255,
            set: (v) => setRgb('g', v),
          },
          {
            label: 'B',
            value: rgb.b,
            min: 0,
            max: 255,
            set: (v) => setRgb('b', v),
          },
        ]
      : format === 'hsl'
        ? [
            {
              label: 'H',
              value: r0(hsl.h),
              min: 0,
              max: 360,
              set: (v) => setHsl('h', v),
            },
            {
              label: 'S',
              value: r0(hsl.s),
              min: 0,
              max: 100,
              set: (v) => setHsl('s', v),
            },
            {
              label: 'L',
              value: r0(hsl.l),
              min: 0,
              max: 100,
              set: (v) => setHsl('l', v),
            },
          ]
        : [
            {
              label: 'H',
              value: r0(cur.h),
              min: 0,
              max: 360,
              set: (v) => setHsb('h', v),
            },
            {
              label: 'S',
              value: r0(cur.s),
              min: 0,
              max: 100,
              set: (v) => setHsb('s', v),
            },
            {
              label: 'B',
              value: r0(cur.v),
              min: 0,
              max: 100,
              set: (v) => setHsb('b', v),
            },
          ];

  // ── hex input ──────────────────────────────────────────────────────────────────

  const hex6 = buildColorValue({ ...cur, a: 1 })
    .hex.slice(1)
    .toUpperCase();
  const [hexText, setHexText] = useState(hex6);
  const [hexFocused, setHexFocused] = useState(false);

  useEffect(() => {
    if (!hexFocused) setHexText(hex6);
  }, [hex6, hexFocused]);

  const commitHex = () => {
    setHexFocused(false);
    if (isValidHex(hexText)) {
      const parsed = parseColor(`#${hexText}`);
      patch((d) => {
        const c = currentOf(d);
        c.h = parsed.h;
        c.s = parsed.s;
        c.v = parsed.v;
        if (hexText.length === 4 || hexText.length === 8) c.a = parsed.a;
      });
    } else {
      setHexText(hex6);
    }
  };

  // ── gradient ───────────────────────────────────────────────────────────────────

  const setMode = (mode: Mode) => {
    if (mode === internal.mode) return;
    patch((d) => {
      d.mode = mode;
    });
  };
  const setActive = (i: 0 | 1) => patch((d) => (d.active = i), false);
  const flip = () =>
    // Reverse the colors; positions stay put (a true direction flip for 2 stops).
    patch((d) => {
      const a = d.stops[0].hsva;
      d.stops[0].hsva = d.stops[1].hsva;
      d.stops[1].hsva = a;
    });
  const setAngle = (v: number) =>
    patch((d) => {
      d.angle = wrap360(v);
    });

  // Select on press; reposition only on drag (so a click just selects the stop).
  const onStopDown = (i: 0 | 1, e: ReactPointerEvent) => {
    if (!interactive || e.button !== 0) return;
    interactingRef.current = true;
    if (internal.active !== i) setActive(i);
    const el = gradientBarRef.current;
    if (!el) {
      interactingRef.current = false;
      return;
    }
    const rect = el.getBoundingClientRect();
    const pad = THUMB_PX / 2;
    const move = (clientX: number) =>
      patch((d) => {
        d.stops[i].position = r0(
          clamp((clientX - rect.left - pad) / (rect.width - 2 * pad), 0, 1) *
            100,
        );
      });
    const onMove = (ev: PointerEvent) => {
      ev.preventDefault();
      move(ev.clientX);
    };
    const onUp = () => {
      interactingRef.current = false;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const onStopKey = (i: 0 | 1, e: ReactKeyboardEvent) => {
    if (!interactive) return;
    const d = kstep(e);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      patch((x) => {
        x.stops[i].position = clamp(
          x.stops[i].position + (e.key === 'ArrowRight' ? d : -d),
          0,
          100,
        );
      });
    }
  };

  const showGradientBar = gradient && internal.mode === 'linear';

  const stopThumbs = internal.stops.map((s, i) => ({
    color: buildColorValue(s.hsva),
    position: s.position,
    index: i as 0 | 1,
  }));
  const previewStops = [...stopThumbs]
    .map((s) => ({ color: s.color, position: s.position }))
    .sort((a, b) => a.position - b.position);

  // ── render ───────────────────────────────────────────────────────────────────

  const sliderThumb = (
    handlers: {
      onKeyDown: (e: ReactKeyboardEvent) => void;
    },
    fraction: number,
    aria: { label: string; now: number; max: number },
    fill: string,
  ) => (
    <div
      role="slider"
      aria-label={aria.label}
      aria-valuemin={0}
      aria-valuemax={aria.max}
      aria-valuenow={aria.now}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handlers.onKeyDown}
      className={cn(THUMB_CLASS, 'pointer-events-none top-1/2', THUMB)}
      style={{
        left: thumbLeft(fraction),
        transform: 'translate(-50%, -50%)',
        backgroundColor: fill,
      }}
    />
  );

  return (
    <div
      ref={ref}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(
        'cladd-coloreditor flex w-full flex-col gap-2.5',
        className,
      )}
    >
      {header}

      <div
        data-part="body"
        className={cn(
          'flex w-full flex-col gap-2.5',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {/* Solid / gradient switch */}
        {gradient && (
          <Toolbar
            data-part="toolbar"
            size={toolbarSize}
            outline={controlOutline}
            className="mx-auto w-32"
            contentClassName="w-full"
          >
            <Segmented className="w-full" activeOutline={controlOutline}>
              <SegmentedButton
                className="flex-1"
                active={internal.mode === 'solid'}
                onClick={() => setMode('solid')}
                aria-label="Solid"
              >
                <SolidColorIcon />
              </SegmentedButton>
              <SegmentedButton
                className="flex-1"
                active={internal.mode === 'linear'}
                onClick={() => setMode('linear')}
                aria-label="Gradient"
              >
                <GradientColorIcon />
              </SegmentedButton>
            </Segmented>
          </Toolbar>
        )}

        {/* Gradient stop bar */}
        {showGradientBar && (
          <div className="flex w-full items-center gap-2.5">
            <Button
              square
              size={controlSize}
              variant="transparent"
              outline={false}
              disabled={!interactive}
              onClick={flip}
              aria-label="Flip gradient"
            >
              <FlipIcon className="text-cladd-fg-soft" />
            </Button>

            <div
              ref={gradientBarRef}
              className={cn('relative flex-1 touch-none rounded-full', BAR_H)}
              style={CHECKER}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: gradientPreviewCss(previewStops) }}
              />
              {stopThumbs.map((s) => (
                <div
                  key={s.index}
                  role="slider"
                  aria-label={`Gradient stop ${s.index + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={s.position}
                  tabIndex={interactive ? 0 : undefined}
                  onPointerDown={(e) => onStopDown(s.index, e)}
                  onKeyDown={(e) => onStopKey(s.index, e)}
                  className={cn(
                    THUMB_CLASS,
                    'top-1/2',
                    THUMB,
                    internal.active === s.index &&
                      'z-10 ring-2 ring-cladd-primary ring-offset-1',
                  )}
                  style={{
                    left: thumbLeft(s.position / 100),
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: s.color.css,
                  }}
                />
              ))}
            </div>

            {angleControl === 'button' ? (
              <Button
                square
                size={controlSize}
                variant="transparent"
                outline={false}
                disabled={!interactive}
                onClick={() => setAngle(internal.angle + 45)}
                aria-label="Rotate 45°"
              >
                <ArrowLeftIcon
                  className="text-cladd-fg-soft transition-transform duration-200"
                  style={{ transform: `rotate(${internal.angle + 90}deg)` }}
                />
              </Button>
            ) : (
              <NumberScrubber
                className="w-16 shrink-0"
                contentClassName="pl-1.5 gap-1"
                inputClassName="text-right pl-5"
                iconClassName="left-1.5"
                size={controlSize}
                variant="transparent"
                outline={false}
                scrubberIcon={false}
                icon={
                  <ArrowLeftIcon
                    style={{ transform: `rotate(${internal.angle + 90}deg)` }}
                  />
                }
                min={0}
                max={360}
                step={1}
                value={r0(internal.angle)}
                displayValue={(v) => `${v}°`}
                disabled={!interactive}
                onChange={setAngle}
                onTemporaryChange={setAngle}
              />
            )}
          </div>
        )}

        {/* Saturation / brightness area */}
        <div
          ref={areaElRef}
          data-part="area"
          className={cn(
            'relative w-full touch-none rounded-cladd-lg select-none',
            AREA_H,
            interactive && 'cursor-crosshair',
            areaClassName,
          )}
          style={{
            background: `linear-gradient(to top, #000 0%, rgba(0,0,0,0) 100%), linear-gradient(to right, #fff 0%, rgba(255,255,255,0) 100%), hsl(${cur.h}, 100%, 50%)`,
          }}
          onPointerDown={onAreaDown}
        >
          <div
            data-part="area-thumb"
            role="slider"
            aria-label="Saturation and brightness"
            aria-valuetext={`S ${r0(cur.s)}%, B ${r0(cur.v)}%`}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={onAreaKey}
            className={cn(THUMB_CLASS, 'pointer-events-none', THUMB)}
            style={{
              left: `${cur.s}%`,
              top: `${100 - cur.v}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: opaque,
            }}
          />
        </div>

        {/* Hue */}
        <div
          ref={hueElRef}
          data-part="hue"
          className={cn(
            'relative w-full touch-none rounded-full select-none',
            BAR_H,
          )}
          style={{ background: HUE_TRACK }}
          onPointerDown={onHueDown}
        >
          {sliderThumb(
            { onKeyDown: onHueKey },
            cur.h / 360,
            { label: 'Hue', now: r0(cur.h), max: 360 },
            `hsl(${cur.h}, 100%, 50%)`,
          )}
        </div>

        {/* Alpha */}
        {alpha && (
          <div
            ref={alphaElRef}
            data-part="alpha"
            className={cn(
              'relative w-full touch-none rounded-full select-none',
              BAR_H,
            )}
            style={CHECKER}
            onPointerDown={onAlphaDown}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},1) 100%)`,
              }}
            />
            {sliderThumb(
              { onKeyDown: onAlphaKey },
              cur.a,
              { label: 'Alpha', now: r0(cur.a * 100), max: 100 },
              opaque,
            )}
          </div>
        )}

        {/* Channel scrubbers */}
        {inputs && (
          <div className="flex w-full items-start gap-1.5">
            {channels.map((ch) => (
              <div
                key={ch.label}
                className="flex min-w-0 flex-1 flex-col items-center gap-1"
              >
                <NumberScrubber
                  className="w-full"
                  contentClassName="justify-between pl-1.5 gap-1"
                  inputClassName="text-right pl-5"
                  iconClassName="left-1.5"
                  icon={<LetterIcon>{ch.label}</LetterIcon>}
                  size={controlSize}
                  outline={controlOutline}
                  scrubberIcon={false}
                  min={ch.min}
                  max={ch.max}
                  step={1}
                  value={ch.value}
                  disabled={!interactive}
                  onChange={ch.set}
                  onTemporaryChange={ch.set}
                />
              </div>
            ))}
          </div>
        )}

        {/* Hex + alpha */}
        {hexInput && (
          <div className="grid w-full grid-cols-3 items-center gap-1.5">
            <Input
              className={cn(
                'min-w-0',
                alphaInput ? 'col-span-2' : 'col-span-3',
              )}
              size={controlSize}
              outline={controlOutline}
              color=""
              icon={<LetterIcon>#</LetterIcon>}
              iconClassName="left-1.5"
              inputClassName="uppercase tracking-wide pl-6"
              value={hexText}
              maxLength={8}
              readOnly={!interactive}
              onFocus={() => setHexFocused(true)}
              onBlur={commitHex}
              onChange={(v) => setHexText(v.replace(/[^0-9a-fA-F]/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
            />
            {alphaInput && (
              <NumberScrubber
                className="w-full"
                contentClassName="justify-between pl-1.5 gap-1"
                inputClassName="text-right pl-5"
                iconClassName="left-1.5"
                icon={<LetterIcon>A</LetterIcon>}
                size={controlSize}
                outline={controlOutline}
                scrubberIcon={false}
                min={0}
                max={100}
                step={1}
                value={r0(cur.a * 100)}
                displayValue={(v) => `${v}%`}
                disabled={!interactive}
                onChange={(v) =>
                  patch((d) => (currentOf(d).a = clamp(v / 100, 0, 1)))
                }
                onTemporaryChange={(v) =>
                  patch((d) => (currentOf(d).a = clamp(v / 100, 0, 1)))
                }
              />
            )}
          </div>
        )}

        {/* Swatches */}
        {swatches && swatches.length > 0 && (
          <div data-part="swatches" className="flex w-full flex-wrap gap-1.5">
            {swatches.map((sw, i) => {
              const swatch = buildColorValue(parseColor(sw));
              return (
                <button
                  type="button"
                  key={i}
                  aria-label={swatch.hex}
                  disabled={!interactive}
                  onClick={() =>
                    patch((d) => {
                      const c = currentOf(d);
                      const p = parseColor(sw);
                      c.h = p.h;
                      c.s = p.s;
                      c.v = p.v;
                      c.a = p.a;
                    })
                  }
                  className={cn(
                    'relative shrink-0 overflow-hidden rounded-cladd-2xs shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] transition-transform hover:scale-110',
                    SWATCH,
                  )}
                  style={CHECKER}
                >
                  <span
                    className="absolute inset-0"
                    style={{ background: swatch.css }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {footer}
    </div>
  );
};
