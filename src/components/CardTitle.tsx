import { ReactElement, ReactNode } from "react";
import Subtitle from "../components/Subtitle";

interface CardTitleProps {
  title: string;
  children: ReactNode;
  topMargin?: string;
  TopSideButtons?: ReactNode;
  icon: ReactElement;
}

const CardTitle = ({
  title,
  children,
  topMargin,
  TopSideButtons,
  icon,
}: CardTitleProps) => {
  {
    return (
      <div
        className={
          "card w-full p-6 bg-base-100 shadow-xl " + (topMargin || "mt-6")
        }
      >
        {/* Title for Card */}
        <Subtitle
          styleClass={TopSideButtons ? "flex items-center justify-between" : ""}
        >
          {title}

          {/* Top side button, show only if present */}
          {TopSideButtons && (
            <div className="flex items-center justify-end gap-2">
              <p>{icon}</p> {TopSideButtons}
            </div>
          )}
        </Subtitle>

        <div className="divider mt-2"></div>

        {/** Card Body */}
        <div className="h-full w-full pb-6 bg-base-100">{children}</div>
      </div>
    );
  }
};

export default CardTitle;

{
  /* <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>
        <span>
          Page:{" "}
          {pagination.state.getPages(data.nodes).map((_, index) => (
            <button
              key={index}
              type="button"
              style={{
                fontWeight: pagination.state.page === index ? "bold" : "normal",
              }}
              onClick={() => pagination.fns.onSetPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </span> */
}
