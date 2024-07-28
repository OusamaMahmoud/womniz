import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({
  nPages,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onPage,
  next,
  prev,
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (next === null) return;
    setCurrentPage(currentPage + 1);
    onPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (prev === null) return;
    setCurrentPage(currentPage - 1);
    onPage(currentPage - 1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentPage(value);
    console.log(value);
    // if (value === "") {
    //   setInputPage(value);
    // } else if (isNaN(value) && value > 0 && value <= nPages) {
    //   setInputPage(Number(value));
    // }
  };

  // const handlePageSubmit = (e) => {
  //   e.preventDefault();
  //   if (inputPage > 0 && inputPage <= nPages) {
  //     setCurrentPage(inputPage);
  //   }
  // };

  return (
    <nav className="flex flex-col xl:flex-row gap-4 justify-between items-center my-14">
      <p className="text-[16px] flex items-center xl:text-2xl ml-4">
        1-{itemsPerPage} of {itemsPerPage * pageNumbers.length} items
      </p>
      <ul className="flex items-center justify-end  gap-10">
        <button
          onClick={goToPrevPage}
          className={`bg-[#B6C9B5] text-white rounded-lg ${
            prev === null && "cursor-not-allowed "
          }`}
        >
          <MdKeyboardArrowLeft className="text-2xl xl:text-4xl " />
        </button>
        <div>
          <input
            type="text"
            id="pageInput"
            value={currentPage}
            onChange={handleInputChange}
            className="border-2 border-gray-300 rounded-md px-2 py-1 text-center w-16"
          />
        </div>
        <p className="text-[14px] xl:text-xl flex items-center xl:block">
          {" "}
          of{" "}
          <span className="px-3 py-2 rounded-md font-bold">
            {pageNumbers.length}
          </span>{" "}
          Pages{" "}
        </p>

        <button
          onClick={goToNextPage}
          className={`bg-[#B6C9B5] text-white rounded-lg ${
            next === null && "cursor-not-allowed "
          }`}
        >
          <MdKeyboardArrowRight className="text-2xl xl:text-4xl" />
        </button>
      </ul>
    </nav>
  );
};

export default Pagination;
