import { cloneElement, MouseEvent, ReactElement, ReactNode } from 'react';

import { useCollapsibleContext } from './CollapsibleContext';

export interface CollapsibleTriggerProps {
  /** Single React element to use as the trigger. Must accept `onClick` (a `<button>` is ideal). */
  children: ReactNode;
}

/**
 * Wraps a single child element to act as the disclosure trigger. **Clones** the
 * child (Radix-style `asChild`) to attach the toggle `onClick` plus the aria
 * wiring (`aria-expanded`, `aria-controls`, `id`) and a `data-open` attribute -
 * so you bring your own markup and the kit injects only behavior and state.
 *
 * Because the cloned child carries `data-open`, rotating or swapping your own
 * chevron is pure CSS: add `group` to the child and
 * `group-data-[open]:rotate-90` to the icon. For state in JS, drop a
 * `CollapsibleIndicator` inside or call `useCollapsibleContext()`.
 *
 * Composes with any existing `onClick` on the child, and no-ops the toggle while
 * the disclosure is `disabled`.
 */
export const CollapsibleTrigger = ({ children }: CollapsibleTriggerProps) => {
  const { open, toggle, disabled, triggerId, panelId } =
    useCollapsibleContext();

  const child = children as ReactElement<any>;
  const originalOnClick = child?.props?.onClick;

  const onClick = (e: MouseEvent) => {
    originalOnClick?.(e);
    if (!disabled) toggle();
  };

  return cloneElement(child, {
    id: triggerId,
    onClick,
    'aria-expanded': open,
    'aria-controls': panelId,
    'aria-disabled': disabled || undefined,
    'data-open': open || undefined,
    'data-disabled': disabled || undefined,
  });
};
