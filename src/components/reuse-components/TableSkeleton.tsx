export const TableSkeleton = ({ noOfElements }: { noOfElements: number }) => {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: noOfElements }).map((e ,idx) => (
        <div key={idx} className="skeleton h-12  w-full"></div>
      ))}
    </div>
  );
};
