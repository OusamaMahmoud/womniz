const CantPassModel = ({ onAddSubs }: { onAddSubs: () => void }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[500px] h-[500px]">
        <img
          src="/assets/products/addSubs.png"
          alt=""
          className="object-cover w-full h-full"
        />
      </div>
      <button onClick={onAddSubs} className="btn bg-[#B6C9B5] px-20 mt-3">
        <img src="/assets/products/Vector.svg" alt="Vector" />  Add Sub Categories
      </button>
    </div>
  );
};

export default CantPassModel;
