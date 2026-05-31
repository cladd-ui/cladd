import { ElementType, FC, KeyboardEvent } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { Segmented, SegmentedProps } from './Segmented';
import { useTabsContext } from './TabsContext';

export type TabsListProps<C extends ElementType = 'div'> = SegmentedProps<C>;

/** Shape of `TabsList` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type TabsListDefaultProps = Partial<
  Omit<SegmentedProps, 'as' | 'ref' | 'children'>
>;

/**
 * Moves focus and selection between tabs with the arrow / Home / End keys
 * (automatic activation). Skips disabled tabs and wraps around the ends.
 */
function onTabsKeyDown(
  e: KeyboardEvent<HTMLElement>,
  setValue: (value: string) => void,
) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

  const container = e.currentTarget;
  const tabs = Array.from(
    container.querySelectorAll<HTMLElement>('[role="tab"]'),
  ).filter((tab) => tab.getAttribute('data-disabled') == null);
  if (tabs.length === 0) return;

  const active = container.ownerDocument.activeElement as HTMLElement | null;
  const currentIndex = active ? tabs.indexOf(active) : -1;

  let nextIndex: number;
  switch (e.key) {
    case 'ArrowRight':
      nextIndex = (currentIndex + 1 + tabs.length) % tabs.length;
      break;
    case 'ArrowLeft':
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      break;
    case 'Home':
      nextIndex = 0;
      break;
    default:
      nextIndex = tabs.length - 1;
  }

  e.preventDefault();
  const next = tabs[nextIndex];
  if (next.dataset.value != null) setValue(next.dataset.value);
  next.focus();
}

/**
 * The tab strip. Renders a `Segmented` (so it inherits the full segmented look
 * and all its `color`/`variant`/`active*` knobs) and layers on `role="tablist"`
 * plus arrow-key navigation. Children are `Tab`s.
 */
export const TabsList = <C extends ElementType = 'div'>(
  props: TabsListProps<C>,
) => {
  const { setValue } = useTabsContext();
  const { onKeyDown, ...rest } = useComponentDefaults(
    'TabsList',
    props,
  ) as SegmentedProps;
  const SegmentedEl = Segmented as FC<SegmentedProps>;

  return (
    <SegmentedEl
      {...rest}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={(e) => {
        onKeyDown?.(e);
        onTabsKeyDown(e, setValue);
      }}
    />
  );
};
