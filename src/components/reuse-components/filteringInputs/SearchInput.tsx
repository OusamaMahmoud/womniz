import { useEffect } from "react";

export const SearchInput = ({
  searchText,
  onSearchText,
  placeHolder,
}: {
  searchText: string;
  placeHolder: string;
  onSearchText: (text: string) => void;
}) => {
  useEffect(() => {
    onSearchText(searchText);
  }, [searchText]);
  return (
    <div className="input input-bordered  flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        placeholder={placeHolder}
        className="grow"
        value={searchText}
        onChange={(e) => onSearchText(e.target.value)}
      />
    </div>
  );
};
