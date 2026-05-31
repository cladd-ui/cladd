import { ReactNode, useId, useState } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { TabsContextProvider } from './TabsContext';

interface TabsOwnProps {
  /** The tab strip (`TabsList` with `Tab`s) and the `TabPanel`s. */
  children?: ReactNode;
  /** Controlled selected tab value. When provided, internal state is bypassed. */
  value?: string;
  /** Initially selected tab value (uncontrolled). Ignored when `value` is provided. */
  defaultValue?: string;
  /** Fires whenever the selected tab changes (click or keyboard). */
  onValueChange?: (value: string) => void;
}

export type TabsProps = TabsOwnProps;

/** Shape of `Tabs` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type TabsDefaultProps = Partial<
  Omit<TabsOwnProps, 'children' | 'value' | 'defaultValue' | 'onValueChange'>
>;

/**
 * Stateful, non-visual root for a set of tabs. Owns the selected value
 * (controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`)
 * and publishes it to `TabsList`/`Tab`/`TabPanel` through context - it renders
 * no DOM of its own.
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="activity">Activity</Tab>
 *   </TabsList>
 *   <TabPanel value="overview">…</TabPanel>
 *   <TabPanel value="activity">…</TabPanel>
 * </Tabs>
 */
export const Tabs = (props: TabsProps) => {
  const baseId = useId();
  const {
    children,
    value: valueProp,
    defaultValue,
    onValueChange,
  } = useComponentDefaults('Tabs', props);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const setValue = (next: string) => {
    if (next === value) return;
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContextProvider value={{ value, setValue, baseId }}>
      {children}
    </TabsContextProvider>
  );
};
