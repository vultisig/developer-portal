import { FC, SVGProps } from "react";

export const ArrowBoxLeftIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14.25 15.75L10.5 12L14.25 8.25" />
    <path d="M10.5 12H21.75" />
    <path d="M10.5 21.75H4.5C3.25736 21.75 2.25 20.7426 2.25 19.5V4.5C2.25 3.25736 3.25736 2.25 4.5 2.25H10.5" />
  </svg>
);
