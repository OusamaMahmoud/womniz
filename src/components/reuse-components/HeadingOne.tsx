export const HeadingOne = ({
  label,
  marginBottom,
}: {
  label: string;
  marginBottom: string;
}) => {
  return (
    <h1
      className={`font-semibold xl:text-4xl text-xl capitalize mb-${marginBottom} `}
    >
      {label}
    </h1>
  );
};
