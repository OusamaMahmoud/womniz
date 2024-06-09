
const ScratchCoupon = () => {
  return (
    <div className="container mx-auto px-6 flex flex-col">
      <div className="flex justify-between items-center my-10">
        <h1 className="text-4xl text-[#577656]  ">Scratch coupon</h1>
        <p className="text-4xl text-[#6A6868]">59 : 00</p>
      </div>
      <div className="bg-[#F6EFE9] flex flex-col justify-center items-center w-fit self-center">
        <div className="">
          <img src="//assets/games/background.svg" />
        </div>
        <div>
          <h2 className="text-4xl text-[#577656] font-bold text-center">Discount percentage</h2>
          <div className="flex flex-col my-10 w-full">
            <label className="label text-[#475467] text-xl">
              Select Discount percentage
            </label>
            <input type="number" className="input input-bordered xl:w-[500px] " />
          </div>
        </div>
      </div>
      <button className="text-2xl bg-[#577656] text-white rounded-md px-20 py-4 self-center mt-8 hover:bg-[#A0D8B3] transition-all duration-150">Apply</button>
    </div>
  );
};

export default ScratchCoupon;
