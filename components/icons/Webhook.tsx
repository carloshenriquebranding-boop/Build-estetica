import * as React from 'react';

export const Webhook: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M18 8a2 2 0 0 0-2-2h-2" />
    <path d="M10 8H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
    <path d="M14 16h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2" />
    <path d="M6 16H4a2 2 0 0 1-2-2v-2" />
    <path d="M12 12v4" />
    <path d="M12 8V4" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);