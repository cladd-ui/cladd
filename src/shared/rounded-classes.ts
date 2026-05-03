export const roundedClasses = (
  size: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  rounded?: boolean,
  multiline?: boolean,
) => {
  const itemRoundedClasses =
    rounded && multiline
      ? {
          '2xs': 'rounded-cladd-full-2xs',
          xs: 'rounded-cladd-full-xs',
          sm: 'rounded-cladd-full-sm',
          md: 'rounded-cladd-full-md',
          lg: 'rounded-cladd-full-lg',
          xl: 'rounded-cladd-full-xl',
          '2xl': 'rounded-cladd-full-2xl',
        }[size]
      : rounded
        ? 'rounded-full'
        : {
            '2xs': 'rounded-cladd-2xs',
            xs: 'rounded-cladd-xs',
            sm: 'rounded-cladd-sm',
            md: 'rounded-cladd-md',
            lg: 'rounded-cladd-lg',
            xl: 'rounded-cladd-xl',
            '2xl': 'rounded-cladd-2xl',
          }[size];
  const focusRoundedClasses =
    rounded && multiline
      ? {
          '2xs': 'rounded-cladd-focus-full-2xs',
          xs: 'rounded-cladd-focus-full-xs',
          sm: 'rounded-cladd-focus-full-sm',
          md: 'rounded-cladd-focus-full-md',
          lg: 'rounded-cladd-focus-full-lg',
          xl: 'rounded-cladd-focus-full-xl',
          '2xl': 'rounded-cladd-focus-full-2xl',
        }[size]
      : rounded
        ? 'rounded-full'
        : {
            '2xs': 'rounded-cladd-focus-2xs',
            xs: 'rounded-cladd-focus-xs',
            sm: 'rounded-cladd-focus-sm',
            md: 'rounded-cladd-focus-md',
            lg: 'rounded-cladd-focus-lg',
            xl: 'rounded-cladd-focus-xl',
            '2xl': 'rounded-cladd-focus-2xl',
          }[size];
  const wrapRoundedClasses =
    rounded && multiline
      ? {
          '2xs': 'rounded-cladd-wrap-full-2xs',
          xs: 'rounded-cladd-wrap-full-xs',
          sm: 'rounded-cladd-wrap-full-sm',
          md: 'rounded-cladd-wrap-full-md',
          lg: 'rounded-cladd-wrap-full-lg',
          xl: 'rounded-cladd-wrap-full-xl',
          '2xl': 'rounded-cladd-wrap-full-2xl',
        }[size]
      : rounded
        ? 'rounded-full'
        : {
            '2xs': 'rounded-cladd-wrap-2xs',
            xs: 'rounded-cladd-wrap-xs',
            sm: 'rounded-cladd-wrap-sm',
            md: 'rounded-cladd-wrap-md',
            lg: 'rounded-cladd-wrap-lg',
            xl: 'rounded-cladd-wrap-xl',
            '2xl': 'rounded-cladd-wrap-2xl',
          }[size];
  return { itemRoundedClasses, focusRoundedClasses, wrapRoundedClasses };
};
