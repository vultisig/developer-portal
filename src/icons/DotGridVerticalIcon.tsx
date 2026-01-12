import { FC, SVGProps } from "react";

export const DotGridVerticalIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    fill="currentColor"
    height="1em"
    viewBox="0 0 16 16"
    width="1em"
    {...props}
  >
    <circle cx="5" cy="3" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    <circle cx="5" cy="13" r="1.5" />
    <circle cx="11" cy="3" r="1.5" />
    <circle cx="11" cy="8" r="1.5" />
    <circle cx="11" cy="13" r="1.5" />
  </svg>
);
