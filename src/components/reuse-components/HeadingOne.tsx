export const HeadingOne = ({ label }: { label: string }) => {
  return (
    <h1 className="font-medium xl:text-4xl text-xl capitalize mb-3 lg:mb-0">
      {label}
    </h1>
  );
};
