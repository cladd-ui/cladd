import { ElementType, FC } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { SegmentedButton, SegmentedButtonProps } from './SegmentedButton';
import { tabId, tabPanelId, useTabsContext } from './TabsContext';

export type TabProps<C extends ElementType = 'button'> = Omit<
  SegmentedButtonProps<C>,
  'active'
> & {
  /** Identifies this tab. Matched against the `Tabs` selected value. */
  value: string;
};

/** Shape of `Tab` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type TabDefaultProps = Partial<
  Omit<SegmentedButtonProps, 'as' | 'ref' | 'children' | 'active'> & {
    value?: never;
  }
>;

/**
 * A single tab. Renders a `SegmentedButton`, deriving its `active` look from the surrounding `Tabs` selection and wiring the click - so you never manage the selected state yourself.
 *
 * Stays a real focusable control (unlike a `readOnly` active `SegmentedButton`) so the tablist roving-focus pattern works.
 *
 * Polymorphic via `as` - `<Tab as="a" href="…">` keeps the automatic active styling while rendering a link.
 */
export const Tab = <C extends ElementType = 'button'>(props: TabProps<C>) => {
  const { value: selectedValue, setValue, baseId } = useTabsContext();
  const { value, onClick, ...rest } = useComponentDefaults(
    'Tab',
    props,
  ) as TabProps;
  const selected = selectedValue === value;
  const SegmentedButtonEl = SegmentedButton as FC<SegmentedButtonProps>;

  return (
    <SegmentedButtonEl
      {...rest}
      active={selected}
      readOnly={false}
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={selected}
      aria-controls={tabPanelId(baseId, value)}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      onClick={(e) => {
        onClick?.(e);
        setValue(value);
      }}
    />
  );
};
