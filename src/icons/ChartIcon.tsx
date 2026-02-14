import { FC, SVGProps } from "react";

export const ChartIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M9.25 20.25V13.75H4.75C4.19772 13.75 3.75 14.1977 3.75 14.75V19.25C3.75 19.8023 4.19772 20.25 4.75 20.25H9.25ZM9.25 20.25H14.75M9.25 20.25V4.75C9.25 4.19772 9.69772 3.75 10.25 3.75H13.75C14.3023 3.75 14.75 4.19772 14.75 4.75V20.25M14.75 20.25H19.75C20.0261 20.25 20.25 20.0261 20.25 19.75V9.75C20.25 9.19772 19.8023 8.75 19.25 8.75H14.75V20.25Z" />
  </svg>
);
