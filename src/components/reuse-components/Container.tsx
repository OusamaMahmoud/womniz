import { ReactNode } from "react";

const Container = ({
  children,
  horizontalPadding,
  verticalMargin,
}: {
  children: ReactNode;
  horizontalPadding: string;
  verticalMargin: string;
}) => {
  return (
    <div className={`container mx-auto px-${horizontalPadding} my-${verticalMargin}`}>
      {children}
    </div>
  );
};

export default Container;
