import * as React from 'react';

export const PaintBucket: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14 19.9V16h3"/>
    <path d="M12 2a4 4 0 0 0-4 4v1h8V6a4 4 0 0 0-4-4Z"/>
    <path d="M18 8H6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3.5"/>
    <path d="M9 18h1c.8 0 1.5-.7 1.5-1.5v-1c0-.8-.7-1.5-1.5-1.5h-1c-.8 0-1.5.7-1.5 1.5v1C7.5 17.3 8.2 18 9 18Z"/>
  </svg>
);
