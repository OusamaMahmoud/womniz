import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DiscountModal = () => {
  const generateRandomCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [expDate, setExpDate] = useState("");
  const [discount, setDiscount] = useState("5%");
  const [code, setCode] = useState(generateRandomCode());

  const openDiscountModal = () => {
    setCode(generateRandomCode());
    setIsDiscountModalOpen(true);
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-center">
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 bg-black opacity-30" onClick={closeDiscountModal}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <h2 className="text-lg font-bold">Add Discount</h2>

            <div className="mt-4">
              <label className="label">Expiration Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="label">Discount Percentage</label>
              <select
                className="select select-bordered w-full"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              >
                <option value="5%">5%</option>
                <option value="20%">20%</option>
                <option value="60%">60%</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="label">Code</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={code}
                  readOnly
                />
                <button className="btn btn-secondary" onClick={copyCodeToClipboard}>
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button className="btn btn-outline" onClick={closeDiscountModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={closeDiscountModal}>
                Save
              </button>
            </div>

            <div className="flex flex-col pt-1 pb-4 px-4 border rounded-lg shadow-md mt-6">
              <span className="self-end mb-5 text-xl cursor-pointer" onClick={closeDiscountModal}>x</span>
              <div className="relative flex gap-16 bg-[#F5DED4] px-10 py-6 rounded-lg">
                <div className="absolute w-8 h-8 -top-3 right-[63%] rounded-full bg-white"></div>
                <div className="absolute w-8 h-8 -bottom-3 right-[63%] rounded-full bg-white"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-black text-2xl font-extrabold">{discount}</span>
                  <span className="text-black text-2xl font-extrabold">Discount</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-black text-2xl font-extrabold">Voucher from wheel</span>
                  <span className="text-black text-sm font-extralight">Enjoy discount and get code : {code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DiscountModal;
