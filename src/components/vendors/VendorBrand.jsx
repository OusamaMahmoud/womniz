import React, { useState } from "react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiAddToQueue, BiEdit } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import avatar from "/assets/admin/avatar.svg";
const VendorBrand = () => {
  const [isDotsOpen, setDotsOpen] = useState(false);
  const [isAddingBrandOpen, setAddingBrandOpen] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isDeleteBrandOpen, setDeleteBrandOpen] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
    }
  };
  const handleDeleteButton = () => {};
  const { register, handleSubmit, formState = { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", imageFile);
  };
  return (
    <>
      <div className=" shadow-xl p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-semibold mb-10">Clothes Brands</h1>
          <span
            className="flex gap-2 items-center border p-3 rounded-md cursor-pointer"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Add <BiAddToQueue />
          </span>
        </div>
        <div className="flex flex-col  max-w-sm  border shadow-lg rounded-lg p-10 gap-2">
          <div className="relative self-end cursor-pointer font-semibold">
            <PiDotsThreeVerticalBold
              className="text-xl"
              onClick={(e) => setDotsOpen(!isDotsOpen)}
            />
            {isDotsOpen && (
              <div className="absolute flex flex-col gap-2 border p-3 right-3 cursor-pointer">
                <span className="border-b-2 pb-3">Edit</span>
                <span onClick={(e) => document.getElementById('deletion-brand-modal').showModal()}>Delete</span>
              </div>
            )}
          </div>
          <p className="w-36 relative">
            <img
              src="/assets/vendor/zara.svg"
              className="object-cover w-[100%]"
            />
          </p>
          <p className="self-center flex items-center gap-4 text-lg font-bold">
            Details
            <FaArrowRightLong />
          </p>
        </div>
      </div>
      {isAddingBrandOpen && (
        <div>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box relative ">
              <div className="flex justify-center items-center my-8">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-36 h-36 object-cover rounded-full"
                  />
                ) : (
                  <img src={avatar} alt="" />
                )}
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <label
                  className={`absolute top-[130px] right-[200px] z-100  flex items-center   gap-3 rounded-md   bg-gray-50 cursor-pointer`}
                >
                  <span className="text-3xl">
                    <FaEdit />
                  </span>
                  <input
                    type="file"
                    className="file-input file-input-bordered"
                    hidden
                    name="image"
                    onChange={handleFileChange}
                  />
                </label>
                <div className="flex flex-col gap-4 mb-10">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    {...register("name")}
                    className="input input-bordered"
                  />
                </div>

                <div className="flex justify-around">
                  <button type="submit" className="btn px-10">
                    Save
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("my_modal_1").close()
                    }
                    className="btn px-10"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      )}
      {isDeleteBrandOpen && (
        <dialog
          id="deletion-brand-modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">Do you really want to delete this Account?</p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() =>
                  document.getElementById("deletion-brand-modal").close()
                }
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDeleteButton}>
                Confirm
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default VendorBrand;
