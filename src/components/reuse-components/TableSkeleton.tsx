export const TableSkeleton = ({ noOfElements }: { noOfElements: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: noOfElements }).map((_,idx) => (
        <div key={idx} className="skeleton h-10  w-full"></div>
      ))}
    </div>
  );
};
