import React, { ReactNode } from "react";

interface SubtitleProps {
  styleClass?: string;
  children: ReactNode;
}

const Subtitle = ({ styleClass, children }: SubtitleProps) => {
  return (
    <div className={`text-xl font-semibold ${styleClass}`}>{children}</div>
  );
};

export default Subtitle;
