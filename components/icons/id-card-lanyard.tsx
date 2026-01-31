import React from "react";
import { type SvgProps } from "react-native-svg";

const IdCardLanyard: React.FC<SvgProps> = (props) => {
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
      className="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard"
      {...(props as any)}
    >
      <path d="M13.5 8h-3" />
      <path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
      <path d="M16.899 22A5 5 0 0 0 7.1 22" />
      <path d="m9 2 3 6" />
      <circle cx="12" cy="15" r="3" />
    </svg>
  );
};

export default IdCardLanyard;
