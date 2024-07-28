import {
  MdDelete,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import apiClient from "../../../services/api-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Celebrities = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file !== null) {
      handleUpload();
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await apiClient.post("/products/bulk/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error("Failed to upload file");
      setFile(null);
    }
  };
  return (
    <div className="flex flex-col ">
      <ToastContainer />
      <div className="flex items-center gap-8 justify-end mb-8">
        <Link
          to={"cloths-sub-category"}
          className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
        >
          Sub Category
        </Link>
        <Link
          to={"/products/celebrities/new-celebrity"}
          className="flex gap-2 items-center btn text-white bg-[#577656] hover:text-black xl:text-xl"
        >
          <IoAdd className="text-white text-2xl hover:text-black" /> Add New
          Jewelry
        </Link>
        <label
          htmlFor="excel"
          // onClick={handleUpload}
          className="flex gap-2 items-center text-white bg-[#577656] hover:text-black btn xl:px-12 xl:text-lg"
        >
          <BiUpload /> Bulk Upload
          <input
            id="excel"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            hidden
          />
        </label>
      </div>
      <div className="flex items-center gap-8 justify-end mb-6">
        <button className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg">
          <MdDelete className="text-2xl text-red-700 " /> Delete
        </button>
        <button className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg">
          <FaFileExport className="text-2xl " /> Export
        </button>
        <Link
          to={"product-description"}
          className="flex gap-2 items-center btn btn-outline xl:px-10 xl:text-lg"
        >
          <img src="/assets/clothes/description.svg" /> Description
        </Link>
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
          <option disabled selected>
            Select Brand
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
            Select Sub Category
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
            Select Status
          </option>
          <option>Han Solo</option>
          <option>Greedo</option>
        </select>
      </div>
      <div className="mt-8">
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
export default Celebrities;