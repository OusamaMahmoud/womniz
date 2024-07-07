import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import { ToastContainer, toast } from "react-toastify";

interface Scratch {
  id: number;
  code: string;
  todaysDiscount: string;
  currentDiscount: string;
  date: string;
}

const ScratchCoupon = () => {
  const [scratchInformation, setScratchInformation] = useState<Scratch>(
    {} as Scratch
  );
  const [error, setError] = useState("");
  const [newDiscont, setNewDiscont] = useState<string>(
    scratchInformation?.todaysDiscount
  );

  useEffect(() => {
    apiClient
      .get("/scratch/information")
      .then((res) => setScratchInformation(res.data.data))
      .catch((err) => setError(err));
  }, []);

  const handleDiscountDispatch = () => {
    if (newDiscont) {
      apiClient
        .post("/scratch/information/update", { scratch_discount: newDiscont })
        .then((res) => console.log(res))
        .catch((err) => setError(err));
      toast.success("New Discount Percentage is set Successfully.");
    } else {
      setError("Please set a New Discount Value!!");
    }
  };

  return (
    <div className="container mx-auto px-6 flex flex-col">
      {error && <p className="text-red-400 text-lg">{error}</p>}
      <ToastContainer />
      <div className="flex justify-between items-center my-10">
        <h1 className="text-4xl text-[#577656]  ">Scratch coupon</h1>
      </div>
      <div className="bg-[#F6EFE9] flex flex-col justify-center items-center w-fit self-center">
        <div className="relative">
          <img src="/assets/games/background.svg" />
          <div className="absolute w-full  flex gap-[18px] items-center top-[130px] -right-[140px]">
            <div className="font-extrabold text-4xl w-20 h-32 rounded-md bg-[#F6EFE9] flex justify-center items-center shadow-xl">
              {scratchInformation?.code?.substring(0, 1)}
            </div>
            <div className="font-extrabold text-4xl w-20 h-32 rounded-md bg-[#F6EFE9] flex justify-center items-center shadow-xl">
              {scratchInformation?.code?.substring(1, 2)}
            </div>
            <div className="font-extrabold text-4xl w-20 h-32 rounded-md bg-[#F6EFE9] flex justify-center items-center shadow-xl">
              {scratchInformation?.code?.substring(2, 3)}
            </div>
            <div className="font-extrabold text-4xl w-20 h-32 rounded-md bg-[#F6EFE9] flex justify-center items-center shadow-xl">
              {scratchInformation?.code?.substring(3, 4)}
            </div>
            <div className="font-extrabold text-4xl w-20 h-32 rounded-md bg-[#F6EFE9] flex justify-center items-center shadow-xl">
              {scratchInformation?.code?.substring(4, 5)}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-4xl text-[#577656] font-bold text-center">
            Discount percentage
          </h2>
          <div className="flex flex-col my-10 w-full">
            <label className="label text-[#475467] text-xl">
              Today’s Discount percentage
            </label>
            <input
              value={scratchInformation?.todaysDiscount}
              disabled
              type="number"
              className="input input-bordered xl:w-[500px] "
            />
          </div>
          <div className="flex flex-col my-10 w-full mt-5">
            <label className="label text-[#475467] text-xl">
              Current Discount percentage
            </label>
            <input
              value={scratchInformation?.currentDiscount}
              disabled
              type="number"
              className="input input-bordered xl:w-[500px] "
            />
          </div>
          <div className="flex flex-col my-10 w-full mt-5">
            <label className="label text-[#475467] text-xl">
              Tomorrow’s Discount percentage
            </label>
            <input
              onChange={(e) => {
                setNewDiscont(e.currentTarget.value);
              }}
              type="number"
              className="input input-bordered xl:w-[500px] "
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleDiscountDispatch}
        className="text-2xl bg-[#577656] text-white rounded-md px-20 py-4 self-center mt-8 hover:bg-[#A0D8B3] transition-all duration-150"
      >
        Apply
      </button>
    </div>
  );
};

export default ScratchCoupon;
