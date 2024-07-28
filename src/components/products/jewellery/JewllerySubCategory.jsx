import { BiDotsVertical, BiEditAlt } from "react-icons/bi";
import subCategory from "../../../../public/assets/products/subCategory.svg";
import { useState } from "react";
import { FaAddressCard } from "react-icons/fa";
import { HiMiniCamera } from "react-icons/hi2";
import useVendorCategories from "../../../hooks/useVendorCategories";

const JewellerySubCategory = () => {
  const { vendorCategories } = useVendorCategories();
  const jewelleryCategory = vendorCategories.find(
    (i) => i.name.toLowerCase() === "Jewellery".toLowerCase()
  );
  const jewelleryCategoryChields = jewelleryCategory?.childs;
  const [openSettingId, setOpenSettingId] = useState(null);

  const toggleSetting = (id) => {
    setOpenSettingId(openSettingId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-8">
      {vendorCategories ? (
        <div className="flex justify-between items-start shadow-lg p-8">
          <div className="flex gap-6  ">
            {jewelleryCategoryChields?.map((item) => (
              <div key={item.id} className="relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-lg"
                  />
                ) : (
                  <img
                    src={"/assets/clothes/t-shirt.svg"}
                    className="rounded-lg w-60 h-60"
                  />
                )}
                <p className="text-2xl font-bold mt-2 text-center">
                  {item.name}
                </p>
                <button className="absolute top-2 right-2">
                  <BiDotsVertical className="text-xl" />
                </button>
                {false && (
                  <div className="flex flex-col items-center bg-white border rounded-lg shadow-lg gap-2 absolute top-12 right-2 z-10">
                    <button className="p-2 w-full hover:bg-gray-200">
                      Edit
                    </button>
                    <button className="p-2 w-full border-t hover:bg-gray-200">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="cursor-pointer p-4 border rounded-md text-xl font-bold flex items-center gap-2"
          >
            <FaAddressCard /> Add
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-80 w-full"></div>
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}

      {false && (
        <dialog id="my_modal_5" className="modal">
          <div className="modal-box w-[900px] h-[500px] max-w-5xl">
            <h3 className="font-bold text-lg">Add Sub Category!</h3>
            <div className="cursor-pointer flex justify-center items-center mt-10 ">
              <label
                className="cursor-pointer text-7xl border border-dashed px-20 py-10"
                htmlFor="camera"
              >
                <HiMiniCamera />
                <input id="camera" type="file" hidden />
              </label>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div className="flex flex-col gap-2 grow">
                <label className="text-lg font-semibold ">
                  Name In English{" "}
                </label>
                <input className="input input-bordered " />
              </div>
              <div className="flex flex-col gap-2 grow">
                <label className="text-lg font-semibold ">
                  Name In Arabic{" "}
                </label>
                <input className="input input-bordered grow" />
              </div>
            </div>
            <div className="modal-action mt-10">
              <form method="dialog">
                <div className="flex gap-4">
                  <button className="btn">Cancel</button>
                  <div className="btn text-white tracking-wider text-lg px-10 bg-green-600 hover:bg-green-300">
                    Save
                  </div>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default JewellerySubCategory;
