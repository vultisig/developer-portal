import { FC, SVGProps } from "react";

export const PlusLargeIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 3.75V12M12 12V20.25M12 12H3.75M12 12H20.25" />
  </svg>
);
