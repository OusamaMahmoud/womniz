import React, { useState } from "react";
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
    if (value === "") {
      setInputPage(value);
    } else if (!isNaN(value) && value > 0 && value <= nPages) {
      setInputPage(Number(value));
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    if (inputPage > 0 && inputPage <= nPages) {
      setCurrentPage(inputPage);
    }
  };

  return (
    <nav className="flex justify-between items-center">
      <p className="text-2xl ml-4">
        1-{itemsPerPage} of {itemsPerPage * pageNumbers.length} items
      </p>
      <ul className="flex items-center justify-end gap-10">
          <button onClick={goToPrevPage} className={`bg-[#B6C9B5] text-white rounded-lg ${prev === null && 'cursor-not-allowed '}`}>
            <MdKeyboardArrowLeft className="text-4xl" />
          </button>
        <div>
          <form
            onSubmit={handlePageSubmit}
            className="flex items-center gap-2 ml-4"
          >
            <input
              type="text"
              id="pageInput"
              value={inputPage}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-md px-2 py-1 text-center w-16"
            />
          </form>
        </div>
        <p className="text-xl">
          {" "}
          of{" "}
          <span className="px-3 py-2 rounded-md font-bold">
            {pageNumbers.length}
          </span>{" "}
          Pages{" "}
        </p>

          <button  onClick={goToNextPage} className={`bg-[#B6C9B5] text-white rounded-lg ${next === null && 'cursor-not-allowed '}`}>
            <MdKeyboardArrowRight className="text-4xl" />
          </button>

      </ul>
    </nav>
  );
};

export default Pagination;
