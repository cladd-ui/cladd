import { ElementType } from 'react';

import { useComponentDefaults } from '../hooks/use-component-defaults';
import { Button, ButtonProps } from './Button';
import { useToolbarContext } from './ToolbarContext';

/**
 * `ToolbarButton` accepts the full `Button` API. When rendered inside a `Toolbar`, `size`, `rounded`, `variant`, and `outline` default to the values supplied by the parent toolbar context - pass them explicitly here to override per-button.
 */
export type ToolbarButtonProps<C extends ElementType = 'button'> =
  ButtonProps<C>;

/** Shape of `ToolbarButton` defaults that can be supplied via `CladdProvider`'s `defaults` prop. */
export type ToolbarButtonDefaultProps = Partial<
  Omit<ToolbarButtonProps, 'as' | 'ref' | 'children'>
>;

export const ToolbarButton = <C extends ElementType = 'button'>(
  props: ToolbarButtonProps<C>,
) => {
  const {
    size = 'md',
    rounded = true,
    variant = 'transparent',
    outline = false,
  } = useToolbarContext();

  const merged = useComponentDefaults('ToolbarButton', props);

  return (
    <Button
      size={size}
      rounded={rounded}
      variant={variant}
      outline={outline}
      {...merged}
    />
  );
};
