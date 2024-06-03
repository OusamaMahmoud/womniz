import React from "react";
import { BiArrowToBottom, BiArrowToRight, BiCircle } from "react-icons/bi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniCamera } from "react-icons/hi2";
import { FaPlusCircle } from "react-icons/fa";

const NewClothesProduct = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Adding New Product</h1>
        <button className="btn btn-outline">
          <MdCancel /> Cancel
        </button>
      </div>
      <div className="flex items-center ">
        <button className="btn btn-outline text-xl bg-[#B6C9B5]">
          Clothes <BiArrowToBottom />
        </button>

        <IoIosArrowForward className="mx-3" />

        <button className="btn btn-outline text-xl">
          {true ? (
            <FaCheckCircle className="text-[#577656]" />
          ) : (
            <span className="rounded-full w-4 h-4 bg-[#577656]"></span>
          )}{" "}
          Product Information{" "}
        </button>

        <IoIosArrowForward className="mx-3" />

        <button className="btn btn-outline  text-xl text-[#1B1B1B80]">
          <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span>{" "}
          Description & Price{" "}
        </button>

        <IoIosArrowForward className="mx-3" />

        <button className="btn btn-outline text-xl text-[#1B1B1B80]">
          <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span> AR
          Preview{" "}
        </button>
      </div>
      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-8">Image</h1>
        <div>
          <div className="flex flex-col items-center justify-center gap-2 border-4 border-dashed border-[#BFBFBF] p-5 max-w-[300px] ">
            <HiMiniCamera className="text-[80px]" />
            <p className="text-lg">Add Photo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClothesProduct;
