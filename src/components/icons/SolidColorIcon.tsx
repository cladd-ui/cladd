export function SolidColorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M15.111 8A7.111 7.111 0 1 1 .89 8 7.111 7.111 0 0 1 15.11 8M2.222 8a5.778 5.778 0 1 0 11.556 0A5.778 5.778 0 0 0 2.222 8"
      />
    </svg>
  );
}
