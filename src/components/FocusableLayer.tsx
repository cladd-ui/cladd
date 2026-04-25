import { cn } from '../shared/cn';
import { useAccentColor } from '../shared/use-accent-color';
import { Color } from '../types';

export const FocusableLayer = (props: {
  className?: string;
  /**
   * Which interactive group's focus state should reveal this ring. The ring is hidden by default
   * (scale 95, opacity 0) and animates in when the matching ancestor receives focus.
   *
   * Each value targets the corresponding `group/<name>` Tailwind group on its parent component:
   * - `'button'` - reveals on `:focus-visible` (keyboard focus only).
   * - `'input'` - reveals when the wrapper has a focused `<input>`.
   * - `'textarea'` - reveals when the wrapper has a focused `[contenteditable]`.
   * - `'checkbox'` / `'toggle'` / `'radio'` / `'range'` - reveal on `:focus-visible` of the
   *   wrapper's hidden native input.
   *
   * Pass an unknown value to opt out of the auto-reveal classes (use `force` instead).
   */
  group?: string;
  color?: Color;
  /**
   * Always show the ring, regardless of focus state. Used for error/invalid states
   * (e.g. `Input` passes `force={!valid}` and a red color).
   */
  force?: boolean;
}) => {
  const accentColor = useAccentColor();
  const { className, group, color = accentColor, force } = props;
  const groupClasses =
    {
      button:
        'group-focus-visible/button:scale-100 group-focus-visible/button:opacity-100',
      input:
        'group-has-[input:focus]/input:scale-100 group-has-[input:focus]/input:opacity-100',
      textarea:
        'group-has-[[contenteditable]:focus]/textarea:scale-100 group-has-[[contenteditable]:focus]/textarea:opacity-100',
      checkbox:
        'group-has-[input:focus-visible]/checkbox:scale-100 group-has-[input:focus-visible]/checkbox:opacity-100',
      toggle:
        'group-has-[input:focus-visible]/toggle:scale-100 group-has-[input:focus-visible]/toggle:opacity-100',
      radio:
        'group-has-[input:focus-visible]/radio:scale-100 group-has-[input:focus-visible]/radio:opacity-100',
      range:
        'group-has-[input:focus-visible]/range:scale-100 group-has-[input:focus-visible]/range:opacity-100',
    }[group as keyof Record<string, string>] || '';
  return (
    <span
      className={cn(
        'pointer-events-none absolute -inset-1.5 z-1 scale-95 border-2 border-primary opacity-0 duration-200',

        `color-${color}`,
        force && 'scale-100 opacity-100',
        !force && groupClasses,
        className,
      )}
    />
  );
};
