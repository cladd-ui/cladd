import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'cladd-sm',
        'cladd-md',
        'cladd-lg',
        'cladd-xl',
        'cladd-2xl',
        'cladd-nested-sm',
        'cladd-nested-md',
        'cladd-nested-lg',
        'cladd-nested-xl',
        'cladd-nested-2xl',
        'cladd-thumb-sm',
        'cladd-thumb-md',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
