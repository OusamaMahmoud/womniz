export const TableSkeleton = ({
  noOfElements,
  rectangleWithContent = "",
}: {
  noOfElements: number;
  rectangleWithContent?: "RECTANGLE" | "";
}) => {
  return (
    <>
      {rectangleWithContent === "RECTANGLE" ? (
        <div className="flex max-w-7xl flex-col gap-4">
          <div className="skeleton h-52 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from({ length: noOfElements }).map((_, idx) => (
            <div key={idx} className="skeleton h-10  w-full"></div>
          ))}
        </div>
      )}
    </>
  );
};
