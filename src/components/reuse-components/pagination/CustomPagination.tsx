import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
export interface Pagination {
  first: string;
  last: string;
  prev: string;
  next: string;
}
export interface Meta {
  current_page: string;
  last_page: string;
  total: string;
  per_page: string;
}

const CustomPagination = ({
  links,
  meta,
  handleChange,
  handleGetFirstPage,
  handleGetPrevPage,
  handleGetNextPage,
  handleGetLastPage,
}: {
  links: Pagination;
  meta: Meta;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGetFirstPage: () => void;
  handleGetPrevPage: () => void;
  handleGetNextPage: () => void;
  handleGetLastPage: () => void;
}) => {

  
  return (
    <div className="mt-4 flex justify-center items-center p-5">
      <div className="flex items-center gap-8">
        <MdKeyboardDoubleArrowLeft
          className=" cursor-pointer text-3xl"
          onClick={handleGetFirstPage}
        />
        <IoIosArrowBack
          className={`${
            links.prev === null ? "cursor-not-allowed " : "cursor-pointer"
          } text-3xl`}
          onClick={handleGetPrevPage}
        />

        <input
          className="input input-bordered w-12 h-9"
          type="number"
          defaultValue={meta.current_page}
          min={1}
          max={meta.last_page}
          onChange={handleChange}
        />

        <IoIosArrowForward
          className={`${
            links.next === null ? "cursor-not-allowed " : "cursor-pointer"
          } text-3xl`}
          onClick={handleGetNextPage}
        />
        <MdKeyboardDoubleArrowRight
          className="cursor-pointer text-3xl"
          onClick={handleGetLastPage}
        />
      </div>
      <p className="badge p-4 ml-2">{meta.last_page} Pages</p>
    </div>
  );
};

export default CustomPagination;