import * as React from 'react';

export const PlugZap: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13 2l-2 2.5h3L12 7" />
    <path d="M10 14v-3" />
    <path d="M14 14v-3" />
    <path d="M11 19c-1.7 0-3-1.3-3-3v-2h8v2c0 1.7-1.3 3-3 3Z" />
    <path d="M12 22v-3" />
  </svg>
);