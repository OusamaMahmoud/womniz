export const TableSkeleton = ({ noOfElements }: { noOfElements: number }) => {
  return (
    <div className="flex flex-col gap-10">
      {Array.from({ length: noOfElements }).map((e ,idx) => (
        <div key={idx} className="skeleton h-10 w-full"></div>
      ))}
    </div>
  );
};