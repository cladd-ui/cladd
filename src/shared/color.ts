/**
 * Color conversion + parsing for `ColorEditor` / `ColorPicker`.
 *
 * Internally everything is HSV(A) (`Hsva`) so hue and saturation survive at the
 * extremes (black / white) where a hex round-trip would otherwise drop them.
 * Conversion to the public {@link ColorValue} (hex / rgb / hsl / hsb / css)
 * happens only on the way out.
 */

export type RGB = { r: number; g: number; b: number; a: number };
export type HSL = { h: number; s: number; l: number; a: number };
export type HSB = { h: number; s: number; b: number; a: number };

/** Emitted color. Every channel set is self-contained (carries its own alpha). */
export type ColorValue = {
  /** `#rrggbb`, or `#rrggbbaa` when alpha < 1. */
  hex: string;
  /** r,g,b 0–255 · a 0–1. */
  rgb: RGB;
  /** h 0–360 · s,l 0–100 · a 0–1. */
  hsl: HSL;
  /** h 0–360 · s,b 0–100 · a 0–1. */
  hsb: HSB;
  /** Ready for `style={{ background }}` — `#rrggbb` when opaque, `rgba(...)` otherwise. */
  css: string;
};

/** Accepted by `value` / `defaultValue` — a CSS color string or any one channel set (alpha optional). */
export type ColorInput =
  | string
  | { r: number; g: number; b: number; a?: number }
  | { h: number; s: number; l: number; a?: number }
  | { h: number; s: number; b: number; a?: number };

export type GradientStop = { color: ColorValue; position: number };

export type GradientValue = {
  type: 'linear';
  /** Degrees, 0–360. */
  angle: number;
  /** Two or more stops, sorted by `position` (0–100). */
  stops: GradientStop[];
  /** Ready for `style={{ background }}` — `linear-gradient(...)`. */
  css: string;
};

/** Solid value when gradient is enabled (tagged so it discriminates against {@link GradientValue}). */
export type SolidValue = ColorValue & { type: 'solid' };

/** Union emitted by `ColorEditor` / `ColorPicker` when `gradient` is enabled. */
export type ColorEditorValue = SolidValue | GradientValue;

export type GradientStopInput = { color: ColorInput; position: number };

export type GradientInput =
  | string
  | { type?: 'linear'; angle?: number; stops: GradientStopInput[] };

/** Internal working color. h 0–360 · s,v 0–100 · a 0–1. */
export type Hsva = { h: number; s: number; v: number; a: number };

export const BLACK: Hsva = { h: 0, s: 0, v: 0, a: 1 };

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const round = (n: number, precision = 0) => {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};

const hex2 = (n: number) =>
  clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');

// ── conversions ────────────────────────────────────────────────────────────

export const hsvToRgb = ({ h, s, v, a }: Hsva): RGB => {
  const S = s / 100;
  const V = v / 100;
  const c = V * S;
  const hh = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = V - c;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
};

export const rgbToHsv = ({ r, g, b, a }: RGB): Hsva => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return {
    h,
    s: max === 0 ? 0 : (d / max) * 100,
    v: max * 100,
    a,
  };
};

export const hsvToHsl = ({ h, s, v, a }: Hsva): HSL => {
  const S = s / 100;
  const V = v / 100;
  const l = V * (1 - S / 2);
  const sl = l === 0 || l === 1 ? 0 : (V - l) / Math.min(l, 1 - l);
  return { h: round(h), s: round(sl * 100), l: round(l * 100), a };
};

export const hslToHsv = (h: number, s: number, l: number, a: number): Hsva => {
  const S = s / 100;
  const L = l / 100;
  const v = L + S * Math.min(L, 1 - L);
  const sv = v === 0 ? 0 : 2 * (1 - L / v);
  return { h, s: sv * 100, v: v * 100, a };
};

// ── building the public value ───────────────────────────────────────────────

const rgbToCss = ({ r, g, b, a }: RGB) =>
  a >= 1 ? `#${hex2(r)}${hex2(g)}${hex2(b)}` : `rgba(${r}, ${g}, ${b}, ${a})`;

const rgbToHex = ({ r, g, b, a }: RGB) =>
  a >= 1
    ? `#${hex2(r)}${hex2(g)}${hex2(b)}`
    : `#${hex2(r)}${hex2(g)}${hex2(b)}${hex2(a * 255)}`;

export const buildColorValue = (hsva: Hsva): ColorValue => {
  const a = round(hsva.a, 2);
  const norm: Hsva = { ...hsva, a };
  const rgb = hsvToRgb(norm);
  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: hsvToHsl(norm),
    hsb: { h: round(norm.h), s: round(norm.s), b: round(norm.v), a },
    css: rgbToCss(rgb),
  };
};

// ── parsing ──────────────────────────────────────────────────────────────────

const NAMED: Record<string, string> = {
  transparent: '#00000000',
  black: '#000000',
  white: '#ffffff',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  red: '#ff0000',
  maroon: '#800000',
  orange: '#ffa500',
  yellow: '#ffff00',
  olive: '#808000',
  lime: '#00ff00',
  green: '#008000',
  aqua: '#00ffff',
  cyan: '#00ffff',
  teal: '#008080',
  blue: '#0000ff',
  navy: '#000080',
  fuchsia: '#ff00ff',
  magenta: '#ff00ff',
  purple: '#800080',
  pink: '#ffc0cb',
};

const parseHex = (hex: string): Hsva | null => {
  let h = hex.slice(1);
  if (h.length === 3 || h.length === 4) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (h.length !== 6 && h.length !== 8) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  if ([r, g, b].some(Number.isNaN)) return null;
  return rgbToHsv({ r, g, b, a });
};

const channels = (str: string): number[] =>
  (str.match(/-?[\d.]+%?/g) ?? []).map((token) =>
    token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token),
  );

const parseCssString = (input: string): Hsva | null => {
  const str = input.trim().toLowerCase();
  if (str in NAMED) return parseHex(NAMED[str]);
  if (str.startsWith('#')) return parseHex(str);

  if (str.startsWith('rgb')) {
    const [r, g, b, a] = channels(str);
    if ([r, g, b].some((n) => n === undefined || Number.isNaN(n))) return null;
    // `channels` divides any `%` value by 100, so percent channels land in 0–1.
    const to255 = (n: number) => (n <= 1 && /%/.test(str) ? n * 255 : n);
    return rgbToHsv({
      r: clamp(to255(r), 0, 255),
      g: clamp(to255(g), 0, 255),
      b: clamp(to255(b), 0, 255),
      a: a === undefined ? 1 : clamp(a, 0, 1),
    });
  }

  if (str.startsWith('hsl')) {
    const nums = str.match(/-?[\d.]+/g)?.map(Number) ?? [];
    const [h, s, l, a] = nums;
    if ([h, s, l].some((n) => n === undefined || Number.isNaN(n))) return null;
    return hslToHsv(
      h,
      s,
      l,
      a === undefined ? 1 : clamp(a > 1 ? a / 100 : a, 0, 1),
    );
  }

  return null;
};

const isHslInput = (
  o: object,
): o is { h: number; s: number; l: number; a?: number } => 'l' in o;
const isHsbInput = (
  o: object,
): o is { h: number; s: number; b: number; a?: number } => 'h' in o && 'b' in o;

/** Parse any {@link ColorInput} into the internal `Hsva`. Falls back to black. */
export const parseColor = (input: ColorInput | undefined | null): Hsva => {
  if (input == null) return { ...BLACK };
  if (typeof input === 'string') return parseCssString(input) ?? { ...BLACK };
  if ('r' in input) {
    return rgbToHsv({
      r: clamp(input.r, 0, 255),
      g: clamp(input.g, 0, 255),
      b: clamp(input.b, 0, 255),
      a: clamp(input.a ?? 1, 0, 1),
    });
  }
  if (isHslInput(input)) {
    return hslToHsv(input.h, input.s, input.l, clamp(input.a ?? 1, 0, 1));
  }
  if (isHsbInput(input)) {
    return {
      h: input.h,
      s: clamp(input.s, 0, 100),
      v: clamp(input.b, 0, 100),
      a: clamp(input.a ?? 1, 0, 1),
    };
  }
  return { ...BLACK };
};

// ── gradients ─────────────────────────────────────────────────────────────────

export const isGradientInput = (
  input: ColorInput | GradientInput | undefined | null,
): input is GradientInput => {
  if (input == null) return false;
  if (typeof input === 'string')
    return input.trim().startsWith('linear-gradient');
  return 'stops' in input;
};

const SIDE_ANGLES: Record<string, number> = {
  'to top': 0,
  'to right': 90,
  'to bottom': 180,
  'to left': 270,
  'to top right': 45,
  'to right top': 45,
  'to bottom right': 135,
  'to right bottom': 135,
  'to bottom left': 225,
  'to left bottom': 225,
  'to top left': 315,
  'to left top': 315,
};

/** Split on top-level commas, ignoring commas inside `rgb(...)` / `hsl(...)`. */
const splitTopLevel = (str: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let token = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(token.trim());
      token = '';
    } else {
      token += ch;
    }
  }
  if (token.trim()) out.push(token.trim());
  return out;
};

type ParsedGradient = {
  angle: number;
  stops: { hsva: Hsva; position: number }[];
};

const parseGradientString = (input: string): ParsedGradient | null => {
  const open = input.indexOf('(');
  const close = input.lastIndexOf(')');
  if (open === -1 || close === -1) return null;
  const parts = splitTopLevel(input.slice(open + 1, close));
  if (!parts.length) return null;

  let angle = 90;
  let start = 0;
  const first = parts[0].toLowerCase();
  if (first.endsWith('deg')) {
    angle = parseFloat(first);
    start = 1;
  } else if (first.startsWith('to ')) {
    angle = SIDE_ANGLES[first] ?? 90;
    start = 1;
  }

  const stops: { hsva: Hsva; position: number }[] = [];
  for (const part of parts.slice(start)) {
    const pos = part.match(/(-?[\d.]+)%\s*$/);
    const colorStr = pos ? part.slice(0, pos.index).trim() : part;
    const hsva = parseCssString(colorStr);
    if (!hsva) continue;
    stops.push({ hsva, position: pos ? parseFloat(pos[1]) : NaN });
  }
  if (stops.length < 2) return null;

  const last = stops.length - 1;
  stops.forEach((stop, i) => {
    if (Number.isNaN(stop.position)) {
      stop.position = (i / last) * 100;
    }
  });
  return { angle, stops };
};

export const parseGradient = (input: GradientInput): ParsedGradient | null => {
  if (typeof input === 'string') return parseGradientString(input);
  if (!input.stops?.length) return null;
  const last = input.stops.length - 1;
  return {
    angle: input.angle ?? 90,
    stops: input.stops.map((stop, i) => ({
      hsva: parseColor(stop.color),
      position: stop.position ?? (i / last) * 100,
    })),
  };
};

export const gradientCss = (angle: number, stops: GradientStop[]) =>
  `linear-gradient(${angle}deg, ${stops
    .map((stop) => `${stop.color.css} ${stop.position}%`)
    .join(', ')})`;

/**
 * Two-tone checkerboard background for surfaces that can show transparency
 * (swatches, alpha tracks). Spread into a `style` prop: `style={CHECKER}`.
 */
export const CHECKER = {
  background:
    'repeating-conic-gradient(#9a9a9a 0% 25%, #6f6f6f 0% 50%) 50% / 12px 12px',
};

/** Horizontal preview gradient for the stop bar (ignores `angle`, like Sketch). */
export const gradientPreviewCss = (stops: GradientStop[]) =>
  `linear-gradient(to right, ${stops
    .map((stop) => `${stop.color.css} ${stop.position}%`)
    .join(', ')})`;

/** Stable signature used to detect *external* controlled-value changes. */
export const colorSignature = (hsva: Hsva): string => {
  const { r, g, b, a } = hsvToRgb({ ...hsva, a: round(hsva.a, 2) });
  return `${r},${g},${b},${round(a, 2)}`;
};
