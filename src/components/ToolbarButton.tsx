import { ElementType } from 'react';

import { Button, ButtonProps } from './Button';
import { useToolbarContext } from './ToolbarContext';

/**
 * `ToolbarButton` accepts the full `Button` API. When rendered inside a `Toolbar`,
 * `size`, `rounded`, `variant`, and `outline` default to the values supplied by the
 * parent toolbar context - pass them explicitly here to override per-button.
 */
export type ToolbarButtonProps<C extends ElementType = 'button'> =
  ButtonProps<C>;

export const ToolbarButton = <C extends ElementType = 'button'>(
  props: ToolbarButtonProps<C>,
) => {
  const {
    size = 'md',
    rounded = true,
    variant = 'transparent',
    outline = false,
  } = useToolbarContext();

  return (
    <Button
      size={size}
      rounded={rounded}
      variant={variant}
      outline={outline}
      {...props}
    />
  );
};
