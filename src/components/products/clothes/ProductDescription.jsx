import React from "react";
import { BiSave } from "react-icons/bi";

const ProductDescription = () => {
  return (
    <div className="container mx-auto px-8 shadow-xl py-10">
      <div className="mt-10">
        <h2 className="my-4 text-xl font-bold">Shipping Information</h2>
        <div className="flex justify-between items-center gap-8">
          <div className="grow">
            <h3 className="mb-2 text-lg font-bold">
              Shipping Information (Arabic)
            </h3>
            <textarea
              className="w-full border pl-4 pb-10 pt-4 grow"
              placeholder="Write Fit & Size here...."
            ></textarea>
          </div>
          <div className="grow">
            <h3 className="mb-2 text-lg font-bold">
              Shipping Information (English)
            </h3>
            <textarea
              className="w-full border pl-4 pb-10 pt-4 grow"
              placeholder="Write Fit & Size here...."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="my-4 text-xl font-bold">Return Order</h2>
        <div className="flex justify-between items-center gap-8">
          <div className="grow">
            <h3 className="mb-2 text-lg font-bold">Return Order (Arabic)</h3>
            <textarea
              className="w-full border pl-4 pb-10 pt-4 grow"
              placeholder="Write Fit & Size here...."
            ></textarea>
          </div>
          <div className="grow">
            <h3 className="mb-2 text-lg font-bold">Return Order (English)</h3>
            <textarea
              className="w-full border pl-4 pb-10 pt-4 grow"
              placeholder="Write Fit & Size here...."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center mx-auto my-10 text-xl text-white bg-[#577656] w-fit p-4 rounded-md"><BiSave /> Save</div>
    </div>
  );
};

export default ProductDescription;
