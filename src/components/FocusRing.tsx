import { useAccentColor } from '../hooks/use-accent-color';
import { cn } from '../shared/cn';
import { Color } from '../types';

export const FocusRing = (props: {
  /** Extra classes for the focus ring `<span>` (typically used to match the host's corner radius). */
  className?: string;
  /**
   * Which interactive group's focus state should reveal this ring. The ring is hidden by default
   * (scale 95, opacity 0) and animates in when the matching ancestor receives focus.
   *
   * Each value targets the corresponding `group/<name>` Tailwind group on its parent component:
   * - `'button'` - reveals on `:focus-visible` (keyboard focus only).
   * - `'input'` - reveals when the wrapper has a focused `<input>`.
   * - `'textarea'` - reveals when the wrapper has a focused `[contenteditable]`.
   * - `'checkbox'` / `'switch'` / `'radio'` / `'slider'` - reveal on `:focus-visible` of the
   *   wrapper's hidden native input.
   *
   * Pass an unknown value to opt out of the auto-reveal classes (use `force` instead).
   */
  group?: string;
  /** Accent color for the ring. Default: theme accent. */
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
      link: 'group-focus-visible/cladd-link:scale-100 group-focus-visible/cladd-link:opacity-100',
      button:
        'group-focus-visible/cladd-button:scale-100 group-focus-visible/cladd-button:opacity-100',
      input:
        'group-has-[input:focus]/cladd-input:scale-100 group-has-[input:focus]/cladd-input:opacity-100',
      textarea:
        'group-has-[[contenteditable]:focus]/cladd-textarea:scale-100 group-has-[[contenteditable]:focus]/cladd-textarea:opacity-100',
      checkbox:
        'group-has-[input:focus-visible]/cladd-checkbox:scale-100 group-has-[input:focus-visible]/cladd-checkbox:opacity-100',
      switch:
        'group-has-[input:focus-visible]/cladd-switch:scale-100 group-has-[input:focus-visible]/cladd-switch:opacity-100',
      radio:
        'group-has-[input:focus-visible]/cladd-radio:scale-100 group-has-[input:focus-visible]/cladd-radio:opacity-100',
      slider:
        'group-has-[input:focus-visible]/cladd-slider:scale-100 group-has-[input:focus-visible]/cladd-slider:opacity-100',
    }[group as keyof Record<string, string>] || '';
  return (
    <span
      data-part="focus-ring"
      className={cn(
        'pointer-events-none absolute -inset-1.5 z-1 scale-95 border-2 border-cladd-primary opacity-0 duration-200',
        `cladd-color-${color}`,

        force && 'scale-100 opacity-100',
        !force && groupClasses,
        className,
      )}
    />
  );
};
