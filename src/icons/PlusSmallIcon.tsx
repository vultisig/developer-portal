import { FC, SVGProps } from "react";

export const PlusSmallIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    fill="none"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="M12 6.75V12M12 12V17.25M12 12H6.75M12 12H17.25" />
  </svg>
);
