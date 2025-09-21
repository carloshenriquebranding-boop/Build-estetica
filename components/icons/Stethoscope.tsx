
import * as React from 'react';

export const Stethoscope: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3" />
    <path d="M6.4 4a.4.4 0 1 0 .5.6.4.4 0 0 0-.5-.6" />
    <path d="M18.8 2.3a.3.3 0 1 0 .2-.3.3.3 0 0 0-.2.3" />
    <path d="M17.6 4a.4.4 0 1 0 .5.6.4.4 0 0 0-.5-.6" />
    <path d="M15 10a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v0a7 7 0 0 0 7 7h1" />
    <path d="M15 9.5V4.7A2.8 2.8 0 0 0 12.2 2" />
    <path d="M11 16.5v-1.2A2.8 2.8 0 0 0 8.2 12.5H7" />
    <circle cx="17" cy="15" r="4" />
    <path d="M17 13v4" />
  </svg>
);