import React, { ReactNode } from "react";

const Container = ({
  children,
  horizontalPadding,
  verticalMargin,
}: {
  children: ReactNode;
  horizontalPadding: String;
  verticalMargin: String;
}) => {
  return (
    <div className={`container mx-auto px-${horizontalPadding} my-${verticalMargin}`}>
      {children}
    </div>
  );
};

export default Container;
