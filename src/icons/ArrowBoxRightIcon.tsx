import { FC, SVGProps } from "react";

export const ArrowBoxRightIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M9.75 8.25L13.5 12L9.75 15.75" />
    <path d="M13.5 12H2.25" />
    <path d="M13.5 2.25H19.5C20.7426 2.25 21.75 3.25736 21.75 4.5V19.5C21.75 20.7426 20.7426 21.75 19.5 21.75H13.5" />
  </svg>
);
