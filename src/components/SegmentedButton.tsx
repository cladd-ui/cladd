import { ElementType, FC } from 'react';

import { Button, ButtonProps } from './Button';
import { useSegmentedContext } from './SegmentedContext';

export type SegmentedButtonProps<C extends ElementType = 'button'> =
  ButtonProps<C> & {
    /**
     * Marks this button as the selected segment.
     * When `true`, switches to the `activeColor` / `activeVariant` / `activeOutline` from the surrounding `Segmented`, raises `surfaceLevel` by `+2` for visual elevation, and sets `readOnly` so the already-selected segment is not pressable again.
     */
    active?: boolean;
  };

export const SegmentedButton = <C extends ElementType = 'button'>(
  props: SegmentedButtonProps<C>,
) => {
  const {
    size = 'md',
    rounded = true,
    color,
    variant,
    outline,
    activeColor,
    activeVariant,
    activeOutline,
  } = useSegmentedContext();
  const { active, ...rest } = props;
  const ButtonEl = Button as FC<ButtonProps>;

  return (
    <ButtonEl
      data-active={active || undefined}
      size={size}
      rounded={rounded}
      color={active && activeColor ? activeColor : color}
      variant={active && activeVariant ? activeVariant : variant}
      outline={active ? activeOutline : outline}
      surfaceLevel={active ? '+2' : undefined}
      readOnly={active}
      {...rest}
    />
  );
};
