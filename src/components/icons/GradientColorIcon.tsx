import { useId } from 'react';

export function GradientColorIcon(props: React.SVGProps<SVGSVGElement>) {
  const gradientId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="currentColor" fillRule="nonzero">
        <path d="M15.111 8A7.111 7.111 0 1 1 .89 8 7.111 7.111 0 0 1 15.11 8M2.222 8a5.778 5.778 0 1 0 11.556 0A5.778 5.778 0 0 0 2.222 8" />
        <path
          fill={`url(#${gradientId})`}
          d="M2.611 7.111a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0"
          transform="translate(.889 .889)"
        />
      </g>
    </svg>
  );
}
