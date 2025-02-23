import type { SVGProps } from "react";

export function RelistenIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} {...props}>
      <title>Relisten</title>
      <rect width="100" height="100" rx="10" fill="currentColor" className="text-blue-500" />
      <text
        x="50"
        y="65"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="50"
        fontWeight="bold"
        textAnchor="middle"
      >
        Re
      </text>
    </svg>
  );
}
