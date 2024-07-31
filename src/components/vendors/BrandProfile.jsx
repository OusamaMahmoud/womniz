import React from "react";
import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
const BrandProfile = () => {
  return (
    <div className="container mx-auto px-2 flex flex-col mt-10 ">
      <div className="flex items-center justify-between mb-20">
        <h1 className="text-4xl font-bold tracking-wider">Zara Brand</h1>
        <div className="flex items-center gap-8">
          <Link
            to={"/products/clothes/new-product"}
            className="flex gap-2 items-center btn text-white bg-[#577656] hover:text-black xl:text-xl"
          >
            <IoAdd className="text-white text-2xl hover:text-black" /> Add
          </Link>
          <button className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg hover:bg-red-600">
            <MdDelete className="text-2xl   " /> Delete
          </button>
        </div>
      </div>
      <div className="flex justify-between mb-6">
        <div className="p-5 flex flex-col gap-2 justify-center items-center shadow-xl mb-6 rounded-lg xl:min-w-[250px]">
          <h1 className="text-2xl font-bold">Total Products</h1>
          <p className="text-xl">2000</p>
        </div>
        <div className="p-5 flex flex-col gap-2 justify-center items-center shadow-xl mb-6 rounded-lg xl:min-w-[250px]">
          <h1 className="text-2xl font-bold">Available Products</h1>
          <p className="text-xl">1200</p>
        </div>
        <div className="p-5 flex flex-col gap-2 justify-center items-center shadow-xl mb-6 rounded-lg xl:min-w-[250px]">
          <h1 className="text-2xl font-bold">Total Sales</h1>
          <p className="text-xl">600$</p>
        </div>
        <div className="p-5 flex flex-col gap-2 justify-center items-center shadow-xl mb-6 rounded-lg xl:min-w-[250px]">
          <h1 className="text-2xl font-bold">Today’s Sales</h1>
          <p className="text-xl">50$</p>
        </div>
        <div className="p-5 flex flex-col gap-2 justify-center items-center shadow-xl mb-6 rounded-lg xl:min-w-[250px]">
          <h1 className="text-2xl font-bold">Monthly Sales</h1>
          <p className="text-xl">150$</p>
        </div>
      </div>
      <div className="flex gap-8 mb-8">
        <label className="input input-bordered flex items-center gap-2 max-w-xs">
          <input type="text" className="" placeholder="Search" />
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
        </label>
        <select className="select select-bordered w-full max-w-xs">
          <option disabled>Select Status</option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
      </div>
      <div className="mt-10">
        <nav className="flex justify-between items-center">
          <p className="text-2xl ml-4">1-15 of 20 items</p>
          <ul className="flex items-center justify-end gap-10">
            <button className={`bg-[#B6C9B5] text-white rounded-lg `}>
              <MdKeyboardArrowLeft className="text-4xl" />
            </button>
            <div>
              <form className="flex items-center gap-2 ml-4">
                <input
                  type="text"
                  id="pageInput"
                  className="border-2 border-gray-300 rounded-md px-2 py-1 text-center w-16"
                />
              </form>
            </div>
            <p className="text-xl">
              {" "}
              of <span className="px-3 py-2 rounded-md font-bold">
                2
              </span> Pages{" "}
            </p>

            <button className={`bg-[#B6C9B5] text-white rounded-lg`}>
              <MdKeyboardArrowRight className="text-4xl" />
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BrandProfile;
