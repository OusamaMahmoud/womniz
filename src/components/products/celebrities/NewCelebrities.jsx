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
import cardPrev from "../../../../public/assets/products/cardPreview.jpg";
import TextEditor from "../TextEditor";
import ClothsDynamicForm from "../clothes/ClothsDynamicForm";

const NewCelebrity = () => {
  const { sizes } = useSizes();
  const [subClothes, setSubClothes] = useState("cloths");
  const [shoes, setShoes] = useState(false);

  const [activeTab, setActiveTab] = useState("productInfo");

  return (
    <div className="container mx-auto px-8 shadow-2xl rounded-xl p-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
        <button className="btn btn-outline">
          <MdCancel /> Cancel
        </button>
      </div>
      <div className="flex items-center">
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
          <div>
            <h1 className="text-2xl font-bold mb-8">Thumbnail Image</h1>
            <ProductDropZone
              onSubmit={(files) => console.log(files)}
              className="relative flex flex-col  gap-2 border-4 border-dashed border-[#BFBFBF]   w-[160px] h-40 items-center justify-center "
            />
          </div>
          <div className="my-6">
            <h1 className="text-2xl font-bold mb-8">Image</h1>
            <ProductDropZone
              onSubmit={(files) => console.log(files)}
              className="relative flex flex-col  gap-2 border-4 border-dashed border-[#BFBFBF]   w-[160px] h-40 items-center justify-center "
            />
          </div>
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
                <h1 className="mb-2">Description (Arabic)</h1>
                <TextEditor />
              </div>
              <div className="grow flex flex-col">
                <h1 className="mb-2">Description (English)</h1>
                <TextEditor />
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
          <div className="flex justify-between items-center">
            {/* {right part} */}
            <div>
              <div className="max-w-[600px] shadow-xl p-6 rounded-md">
                <h1 className="text-2xl font-bold mb-4">Product Information</h1>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Product Name</span>
                  <span>T-shirt</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Category</span>
                  <span>Clothes</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Sub Category</span>
                  <span>Tops</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Brand</span>
                  <span>Zara</span>
                </div>
              </div>
              <div className="max-w-[600px]  mt-8 shadow-xl p-6 rounded-md">
                <h1 className="text-2xl font-bold mb-4">Product Description</h1>
                <p className="text-xl text-[#00000066]">
                  White shirt with sleeves with unique design for sleeves which
                  make your look very awesome
                </p>
              </div>
              <div className="max-w-[600px] mt-8 shadow-xl p-6 rounded-md">
                <h1 className="text-2xl font-bold mb-4">Pricing Details</h1>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Product Name</span>
                  <span>200 $</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Category</span>
                  <span>5%</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl text-[#00000066]">Sub Category</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            {/* {left part} */}
            <div className=" p-4 bg-white shadow-md rounded-lg w-[650px] h-[1050px]">
              <h1 className="text-2xl font-bold my-2">Card preview</h1>
              <div className="relative flex justify-center items-center h-[950px] w-full">
                <div className="absolute h-full w-full rounded-lg">
                  <img
                    src={cardPrev}
                    className="object-cover h-full w-full rounded-lg"
                  />
                </div>
                <div className="bg-[#F6EFE9] relative top-[100px] my-10 max-w-[600px] rounded-md">
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-10 ">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-bold flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        White sleeve top
                      </span>
                      <span className="text-2xl font-bold">127 Usd</span>
                    </div>
                    <div className="collapse-content flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[#BFBFBF] max-w-80">
                          White shirt with sleeves with unique design for
                          sleeves which make your look very awesome
                        </p>
                        <p className="text-[#BFBFBF] flex flex-col gap-2 items-center">
                          <span className="line-through">158 Usd</span>
                          <span className="border p-1 rounded-md">
                            Save 20%
                          </span>
                        </p>
                      </div>
                      <div className="flex  justify-between items-center my-4">
                        <p className="font-extrabold text-2xl">Size</p>
                        <p className="font-extrabold text-2xl flex flex-col gap-2 items-center">
                          Quantity
                        </p>
                      </div>
                      <div className="flex  justify-between items-center mb-2">
                        <p className=" flex gap-4">
                          <span className="w-fit border p-2">XS</span>
                          <span className="w-fit border p-2">S</span>
                          <span className="w-fit border p-2">M</span>
                          <span className="w-fit border p-2">L</span>
                          <span className="w-fit border p-2">XL</span>
                          <span className="w-fit border p-2">XXL</span>
                        </p>
                        <p className="text-[#BFBFBF] flex  gap-2 items-center">
                          <span className="border rounded-lg px-4 py-1 text-xl text-white bg-[#577656]">
                            +
                          </span>
                          <span className="font-extrabold">1</span>
                          <span className="border rounded-lg px-4 py-1 text-xl ">
                            -
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-6 ">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Fit & Size
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        We operate traceability programs to ensure compliance
                        with our social, environmental, safety and health
                        standards. To ensure compliance, we have developed an
                        audit program and plans for continuous improvement.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10  border mb-6 ">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Return Order
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        30 days starting from buying date
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F6EFE9] collapse collapse-arrow my-10 border mb-6 ">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-bold">
                      Shipping information
                    </div>
                    <div className="collapse-content">
                      <p className="text-[#BFBFBF]">
                        We operate traceability programs to ensure compliance
                        with our social, environmental, safety and health
                        standards. To ensure compliance, we have developed an
                        audit program and plans for continuous improvement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default NewCelebrity;
