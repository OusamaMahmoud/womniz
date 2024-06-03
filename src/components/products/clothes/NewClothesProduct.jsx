import React from "react";
import { BiArrowToBottom, BiArrowToRight, BiCircle } from "react-icons/bi";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { MdCancel, MdDelete } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { HiMiniCamera } from "react-icons/hi2";
import { FaPlusCircle } from "react-icons/fa";

const NewClothesProduct = () => {
  const IMAGESARRAY = [
    { id: 1, img: "/src/assets/clothes/t-shirt.svg" },
    { id: 2, img: "/src/assets/clothes/t-shirt.svg" },
    { id: 3, img: "/src/assets/clothes/t-shirt.svg" },
    { id: 4, img: "/src/assets/clothes/t-shirt.svg" },
    { id: 5, img: "/src/assets/clothes/t-shirt.svg" },
  ];
  const SIZES = [
    { id: 1, size: "XS" },
    { id: 2, size: "XXS" },
    { id: 3, size: "S" },
    { id: 4, size: "M" },
    { id: 5, size: "L" },
    { id: 5, size: "XL" },
    { id: 5, size: "XXXL" },
    { id: 5, size: "XXXXL" },
  ];

  return (
    <div className="shadow-2xl rounded-xl p-10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Adding New Product</h1>
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
      <div className="flex flex-col mt-8">
        <h1 className="text-2xl font-bold mb-8">Image</h1>
        <div className="flex border p-4 items-center gap-8 w-fit rounded-md">
          {IMAGESARRAY.map((img) => (
            <div
              key={img.id}
              className="relative  max-w-2xl rounded-md  w-[170px] "
            >
              <img src={img.img} className="object-cover h-[100%] w-[100%]" />
              {img.id === 1 && (
                <p className="top-[80%] absolute flex justify-center items-center text-center bg-[#00000033] w-[100%] rounded-t-lg p-1 text-white">
                  Default
                </p>
              )}
              <p
                onClick={() => console.log("Clicked")}
                className="transition-all duration-300 cursor-pointer top-0 absolute bg-[#00000033] opacity-0 hover:opacity-100 flex justify-center items-center text-center h-[100%] w-[100%] "
              >
                <MdDelete className="text-5xl text-white" />
              </p>
            </div>
          ))}

          <label
            htmlFor="image"
            className="relative flex flex-col items-center justify-center gap-2 border-4 border-dashed border-[#BFBFBF] p-5 w-[160px] h-[160px] "
          >
            {IMAGESARRAY.length > 1 ? (
              <FaPlusCircle className="text-4xl" />
            ) : (
              <>
                <HiMiniCamera className="text-[80px] cursor-pointer" />
                <p className="text-lg">Add Photo</p>
              </>
            )}
            <input
              id="image"
              type="file"
              className="top-[10px] absolute p-6 w-[150px] bg-red-600 z-50"
              hidden
            />
          </label>
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
          <div className="flex gap-40 items-center mt-10">
            <div>
              <div>
                <h1 className="text-xl font-semibold">Size</h1>
                <p className="text-[#47546780]">Pick available sizes</p>
              </div>
              <div className="mt-8">
                <h1 className="text-xl font-semibold">Qunatity</h1>
              </div>
            </div>
            <div className="flex items-center gap-8">
              {SIZES.map((s) => (
                <div className="flex flex-col gap-4 items-center">
                  <p
                    key={s.id}
                    className="text-2xl bg-[#d7dde6] p-4 rounded-md font-extrabold italic"
                  >
                    {s.size}
                  </p>
                  <input
                    type="number"
                    className="input input-bordered max-w-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="btn mt-10 self-end px-20 bg-[#577656] text-white text-xl hover:bg-[#87ae85]">Next</button>
      </div>
    </div>
  );
};

export default NewClothesProduct;
