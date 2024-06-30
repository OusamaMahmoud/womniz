import React, { useState } from "react";
import { BiArrowToBottom, BiArrowToRight, BiCircle } from "react-icons/bi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { MdCancel, MdDelete } from "react-icons/md";
import { FaCheckCircle, FaDraft2Digital } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniCamera } from "react-icons/hi2";
import { FaPlusCircle } from "react-icons/fa";
import Dropzone from "../../../components/vendors/DropZone";
import ProductDropZone from "../ProductDropZone";
import useSizes from "../../../hooks/useSizes";
import ClothsDynamicForm from "./ClothsDynamicForm";

const NewClothesProduct = () => {
  const { sizes } = useSizes();
  const [subClothes, setSubClothes] = useState();
  const [shoes, setShoes] = useState(false);

  const [activeTab, setActiveTab] = useState("clothes");

  return (
    <div className="shadow-2xl rounded-xl p-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
        <button className="btn btn-outline">
          <MdCancel /> Cancel
        </button>
      </div>
      <div className="flex items-center">
        <select
          onChange={(e) => setSubClothes(e.currentTarget.value)}
          className={`select select-bordered text-xl text-[#577656] mr-10`}
        >
          <option value={"cloths"}>
            Cloths <BiArrowToBottom />
          </option>
          <option value={"shoes"}>Shoes</option>
          <option value={"pages"}>Pages</option>
        </select>

        <button
          onClick={() => setActiveTab("productInfo")}
          className={`btn btn-outline text-xl ${
            activeTab === "productInfo" ? "text-[#577656]" : "text-[#1B1B1B80]"
          }`}
        >
          {activeTab === "productInfo" ? (
            <FaCheckCircle className="text-[#577656]" />
          ) : (
            <span className="rounded-full w-4 h-4 bg-[#577656]"></span>
          )}{" "}
          Product Information
        </button>

        <IoIosArrowForward className="mx-3" />

        <button
          onClick={() => setActiveTab("descriptionPrice")}
          className={`btn btn-outline text-xl ${
            activeTab === "descriptionPrice"
              ? "text-[#577656]"
              : "text-[#1B1B1B80]"
          }`}
        >
          <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span>{" "}
          Description & Price
        </button>

        <IoIosArrowForward className="mx-3" />

        <button
          onClick={() => setActiveTab("arPreview")}
          className={`btn btn-outline text-xl ${
            activeTab === "arPreview" ? "text-[#577656]" : "text-[#1B1B1B80]"
          }`}
        >
          <span className="rounded-full w-4 h-4 bg-[#1B1B1B80]"></span> AR
          Preview
        </button>
      </div>

      {activeTab === "productInfo" && (
        <div className="flex flex-col mt-8">
          <h1 className="text-2xl font-bold mb-8">Image</h1>
          <ProductDropZone
            onSubmit={(files) => console.log(files)}
            className="relative flex flex-col  gap-2 border-4 border-dashed border-[#BFBFBF]   w-[160px] h-40 items-center justify-center "
          />
          <div className="mt-10">
            <h1 className="text-2xl font-bold">General Information</h1>
            <div className="flex gap-40 items-center mt-10">
              <p className="text-xl font-semibold">Product SKU</p>
              <div className="flex flex-col gap-4">
                <label className="text-xl">SKU</label>
                <input className="input input-bordered" />
              </div>
            </div>
            <div className="flex gap-40 items-center mt-10">
              <p className="text-xl font-semibold">Product Name</p>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (English)</label>
                <input className="input input-bordered" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Product Name (Arabic)</label>
                <input className="input input-bordered" />
              </div>
            </div>
            <div className="flex gap-20 items-center mt-10">
              <p className="text-xl font-semibold">Sub Category & Brand</p>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Select App sub categories</label>
                <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Who shot first?
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Brand</label>
                <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Who shot first?
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xl">Select Brand sub categories</label>
                <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Who shot first?
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
            </div>
            {subClothes === "shoes" ? (
              <div className="flex gap-40 mt-10">
                <div>
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                </div>
                <div>
                  <ClothsDynamicForm
                    onSelectedSizes={(selectedSizes) =>
                      console.log(selectedSizes)
                    }
                  />
                </div>
              </div>
            ) : subClothes === "cloths" ? (
              <div className="flex gap-40 items-center mt-10">
                <div>
                  <div>
                    <h1 className="text-xl font-semibold">Size</h1>
                    <p className="text-[#47546780]">Pick available sizes</p>
                  </div>
                  <div className="mt-8">
                    <h1 className="text-xl font-semibold">Quantity</h1>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  {sizes.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col gap-4 items-center"
                    >
                      <p className="text-2xl bg-[#d7dde6] p-4 rounded-md font-extrabold italic">
                        {s.title}
                      </p>
                      <input
                        type="number"
                        className="input input-bordered max-w-16"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : subClothes === "pages" ? (
              <div className="flex gap-40 mt-10">
                <div>
                  <h1 className="text-xl font-semibold">Size</h1>
                  <p className="text-[#47546780]">Pick available sizes</p>
                </div>
                <div className="flex items-center justify-around gap-4 max-w-[1000px]">
                  <div className="flex justify-center items-center gap-4">
                    <label className="">Length</label>
                    <input className="input input-bordered" />
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <label className="">Height</label>
                    <input className="input input-bordered" />
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <label className="">Width</label>
                    <input className="input input-bordered" />
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <label className="">Quantity</label>
                    <input className="input input-bordered" />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <button
            onClick={() => setActiveTab("descriptionPrice")}
            className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
          >
            Next
          </button>
        </div>
      )}

      {activeTab === "descriptionPrice" && (
        <div className="flex flex-col mt-8">
          {/* Product Information tab content */}
          <h1 className="text-2xl font-bold">Product Information</h1>
          <div>
            <h1 className="text-xl font-bold">Description</h1>
            <div className="flex justify-around items-center gap-20 mt-4">
              <div className="grow flex flex-col">
                <h1>Description (Arabic)</h1>
                <textarea
                  className="grow border rounded-md p-4 mt-2 h-48"
                  placeholder="Write your description here...."
                ></textarea>
              </div>
              <div className="grow flex flex-col">
                <h1>Description (English)</h1>
                <textarea
                  className="border rounded-md p-4 mt-2 h-48"
                  placeholder="Write your description here...."
                ></textarea>
              </div>
            </div>
            <div className="mt-10">
              <h1 className="text-xl">Price</h1>
              <div className="mt-5 flex flex-col gap-4 max-w-72">
                <label>Price</label>
                <input className="input input-bordered" />
              </div>
              <div className="flex gap-40 items-center  mt-10">
                <div className=" flex flex-col  gap-2">
                  <label>Vat</label>
                  <select className="select select-bordered">
                    <option selected disabled>
                      Select Vat
                    </option>
                    <option>Vat 1</option>
                    <option>Vat 2</option>
                  </select>
                </div>
                <div className=" flex flex-col gap-2 ">
                  <label>Sale percentage</label>
                  <input className="input input-bordered" />
                </div>
              </div>
            </div>
          </div>
          {/* Your content here */}
          <div className="flex items-center gap-5 justify-end">
            <button
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20   text-xl hover:bg-[#87ae85] mr-32"
            >
             <FaDraft2Digital /> Save Draft
            </button>
            <button
              onClick={() => setActiveTab("arPreview")}
              className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === "arPreview" && (
        <div className="flex flex-col mt-8">
          {/* AR Preview tab content */}
          <h1 className="text-2xl font-bold">AR Preview</h1>
          {/* Your content here */}
          <button
            onClick={() => setActiveTab("productInfo")}
            className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]"
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default NewClothesProduct;
