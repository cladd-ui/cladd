import { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { cn } from '../shared/cn';
import { tabId, tabPanelId, useTabsContext } from './TabsContext';

interface TabPanelOwnProps<C extends ElementType = 'div'> {
  /** Panel content, shown when this panel's `value` is the selected tab. */
  children?: ReactNode;
  /** Extra classes for the panel root. */
  className?: string;
  /** The tab `value` this panel belongs to. */
  value: string;
  /**
   * Keep the panel in the DOM (just `hidden`) while inactive instead of unmounting it.
   *
   * Preserves scroll position and internal state. Default `false`.
   */
  keepMounted?: boolean;
  /** Polymorphic root element. Defaults to `'div'`. */
  as?: C;
  /** Forwarded to the polymorphic root element. */
  ref?: Ref<HTMLElement>;
}

export type TabPanelProps<C extends ElementType = 'div'> = TabPanelOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof TabPanelOwnProps<C>>;

/** Shape of `TabPanel` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type TabPanelDefaultProps = Partial<
  Omit<TabPanelOwnProps, 'as' | 'ref' | 'children' | 'value'>
>;

/**
 * The content area for a tab. Renders a single unstyled element carrying the
 * `tabpanel` role and the aria wiring back to its `Tab`; all extra props pass
 * through to it so it can be styled. Mounts its children only when its `value`
 * is selected (or always, when `keepMounted`).
 */
export const TabPanel = <C extends ElementType = 'div'>(
  props: TabPanelProps<C>,
) => {
  const { value: selectedValue, baseId } = useTabsContext();
  const {
    children,
    className = '',
    value,
    keepMounted = false,
    as: Component = 'div' as ElementType<any>,
    ref,
    ...rest
  } = useComponentDefaults('TabPanel', props);

  const selected = selectedValue === value;
  if (!selected && !keepMounted) return null;

  return (
    <Component
      role="tabpanel"
      id={tabPanelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      hidden={!selected || undefined}
      tabIndex={0}
      data-selected={selected || undefined}
      className={cn('cladd-tab-panel', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  );
};
