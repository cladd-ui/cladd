import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'cladd-4xs',
        'cladd-3xs',
        'cladd-2xs',
        'cladd-xs',
        'cladd-sm',
        'cladd-md',
      ],
      spacing: [
        'cladd-3xs',
        'cladd-2xs',
        'cladd-xs',
        'cladd-sm',
        'cladd-md',
        'cladd-lg',
        'cladd-xl',
        'cladd-2xl',
        'cladd-thumb-xs',
        'cladd-thumb-sm',
        'cladd-thumb-md',
        'cladd-nested-3xs',
        'cladd-nested-2xs',
        'cladd-nested-xs',
        'cladd-nested-sm',
        'cladd-nested-md',
        'cladd-nested-lg',
        'cladd-nested-xl',
        'cladd-nested-2xl',
        'cladd-thumb-sm',
        'cladd-thumb-md',
      ],
      radius: [
        'cladd',
        'cladd-3xs',
        'cladd-2xs',
        'cladd-xs',
        'cladd-sm',
        'cladd-md',
        'cladd-lg',
        'cladd-xl',
        'cladd-2xl',

        'cladd-full-2xs',
        'cladd-full-xs',
        'cladd-full-sm',
        'cladd-full-md',
        'cladd-full-lg',
        'cladd-full-xl',
        'cladd-full-2xl',

        'cladd-wrap-2xs',
        'cladd-wrap-xs',
        'cladd-wrap-sm',
        'cladd-wrap-md',
        'cladd-wrap-lg',
        'cladd-wrap-xl',
        'cladd-wrap-2xl',

        'cladd-wrap-full-2xs',
        'cladd-wrap-full-xs',
        'cladd-wrap-full-sm',
        'cladd-wrap-full-md',
        'cladd-wrap-full-lg',
        'cladd-wrap-full-xl',
        'cladd-wrap-full-2xl',

        'cladd-focus-2xs',
        'cladd-focus-xs',
        'cladd-focus-sm',
        'cladd-focus-md',
        'cladd-focus-lg',
        'cladd-focus-xl',
        'cladd-focus-2xl',

        'cladd-focus-full-2xs',
        'cladd-focus-full-xs',
        'cladd-focus-full-sm',
        'cladd-focus-full-md',
        'cladd-focus-full-lg',
        'cladd-focus-full-xl',
        'cladd-focus-full-2xl',

        'cladd-popover',
        'cladd-dialog',
        'cladd-toast',
        'cladd-popup',
        'cladd-tooltip',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
