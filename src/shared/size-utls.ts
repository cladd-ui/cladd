export const rootSizeClasses = (
  size: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'sm',
  prop: 'size' | 'width' | 'height' | 'min-width' | 'min-height',
) => {
  if (prop === 'size') {
    return {
      '2xs': 'size-cladd-2xs',
      xs: 'size-cladd-xs',
      sm: 'size-cladd-sm',
      md: 'size-cladd-md',
      lg: 'size-cladd-lg',
      xl: 'size-cladd-xl',
      '2xl': 'size-cladd-2xl',
    }[size];
  }
  if (prop === 'width') {
    return {
      '2xs': 'w-cladd-2xs',
      xs: 'w-cladd-xs',
      sm: 'w-cladd-sm',
      md: 'w-cladd-md',
      lg: 'w-cladd-lg',
      xl: 'w-cladd-xl',
      '2xl': 'w-cladd-2xl',
    }[size];
  }
  if (prop === 'height') {
    return {
      '2xs': 'h-cladd-2xs',
      xs: 'h-cladd-xs',
      sm: 'h-cladd-sm',
      md: 'h-cladd-md',
      lg: 'h-cladd-lg',
      xl: 'h-cladd-xl',
      '2xl': 'h-cladd-2xl',
    }[size];
  }
  if (prop === 'min-width') {
    return {
      '2xs': 'min-w-cladd-2xs',
      xs: 'min-w-cladd-xs',
      sm: 'min-w-cladd-sm',
      md: 'min-w-cladd-md',
      lg: 'min-w-cladd-lg',
      xl: 'min-w-cladd-xl',
      '2xl': 'min-w-cladd-2xl',
    }[size];
  }
  if (prop === 'min-height') {
    return {
      '2xs': 'min-h-cladd-2xs',
      xs: 'min-h-cladd-xs',
      sm: 'min-h-cladd-sm',
      md: 'min-h-cladd-md',
      lg: 'min-h-cladd-lg',
      xl: 'min-h-cladd-xl',
      '2xl': 'min-h-cladd-2xl',
    }[size];
  }
};

export const nestedSizeClasses = (
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'sm',
  prop: 'size' | 'width' | 'height' | 'min-width' | 'min-height',
) => {
  if (prop === 'size') {
    return {
      xs: 'size-cladd-nested-xs',
      sm: 'size-cladd-nested-sm',
      md: 'size-cladd-nested-md',
      lg: 'size-cladd-nested-lg',
      xl: 'size-cladd-nested-xl',
      '2xl': 'size-cladd-nested-2xl',
    }[size];
  }
  if (prop === 'width') {
    return {
      xs: 'w-cladd-nested-xs',
      sm: 'w-cladd-nested-sm',
      md: 'w-cladd-nested-md',
      lg: 'w-cladd-nested-lg',
      xl: 'w-cladd-nested-xl',
      '2xl': 'w-cladd-nested-2xl',
    }[size];
  }
  if (prop === 'height') {
    return {
      xs: 'h-cladd-nested-xs',
      sm: 'h-cladd-nested-sm',
      md: 'h-cladd-nested-md',
      lg: 'h-cladd-nested-lg',
      xl: 'h-cladd-nested-xl',
      '2xl': 'h-cladd-nested-2xl',
    }[size];
  }

  if (prop === 'min-width') {
    return {
      xs: 'min-w-cladd-nested-xs',
      sm: 'min-w-cladd-nested-sm',
      md: 'min-w-cladd-nested-md',
      lg: 'min-w-cladd-nested-lg',
      xl: 'min-w-cladd-nested-xl',
      '2xl': 'min-w-cladd-nested-2xl',
    }[size];
  }
  if (prop === 'min-height') {
    return {
      xs: 'min-h-cladd-nested-xs',
      sm: 'min-h-cladd-nested-sm',
      md: 'min-h-cladd-nested-md',
      lg: 'min-h-cladd-nested-lg',
      xl: 'min-h-cladd-nested-xl',
      '2xl': 'min-h-cladd-nested-2xl',
    }[size];
  }
};
