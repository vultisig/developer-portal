import { FC, SVGProps } from "react";

export const PuzzleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    fill="none"
    height="1em"
    stroke="currentColor"
    strokeLinecap="square"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="M3.75 6.75C3.75 5.64543 4.64543 4.75 5.75 4.75H9.25V4.5C9.25 2.98122 10.4812 1.75 12 1.75C13.5188 1.75 14.75 2.98122 14.75 4.5V4.75H18.25C19.3546 4.75 20.25 5.64543 20.25 6.75V9.25H20C18.4812 9.25 17.25 10.4812 17.25 12C17.25 13.5188 18.4812 14.75 20 14.75H20.25V17.25C20.25 18.3546 19.3546 19.25 18.25 19.25H5.75C4.64543 19.25 3.75 18.3546 3.75 17.25V6.75Z" />
  </svg>
);
