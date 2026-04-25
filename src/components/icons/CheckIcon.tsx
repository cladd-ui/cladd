export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      {...props}
    >
      <g fill="currentColor">
        <polyline
          points="2.75 9.25 6.75 14.25 15.25 3.75"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        ></polyline>
      </g>
    </svg>
  );
}
