import React from "react";

const HashtagIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
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
      <path d="M7 20l4-16"></path>
      <path d="M17 20l-4-16"></path>
      <path d="M3 8h18"></path>
      <path d="M3 16h18"></path>
    </svg>
  );
};

export default HashtagIcon;