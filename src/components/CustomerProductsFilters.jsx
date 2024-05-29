import React from "react";

const CustomerProductsFilters = () => {
  return (
    <div className="my-6 flex items-center gap-3">
      {/* Search Bar */}
      <div className="form-control">
        <label className="input input-bordered grow flex items-center gap-2">
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
          <input type="text" placeholder="Search" className="grow" />
        </label>
      </div>
      {/* Category Bar */}
      <div className="form-control">
        <select className="select select-bordered">
          <option value="">Select Category</option>
        </select>
      </div>
      <div className="form-control">
        <select className="select select-bordered">
          <option value="">Select Sub Category</option>
        </select>
      </div>
      <div className="form-control">
        <select className="select select-bordered">
          <option value="">Select Brand</option>
        </select>
      </div>
      <button className="btn btn-outline">Next</button>
    </div>
  );
};

export default CustomerProductsFilters;
