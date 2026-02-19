import { FC, SVGProps } from "react";

export const ArrowLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    fill="none"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="M10 5.75L3.75 12L10 18.25M4.5 12H20.25" />
  </svg>
);
