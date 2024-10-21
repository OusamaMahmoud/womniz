import React from "react";
interface Category {
  categoryImg: FileList | null;
  name_en: string;
  name_ar: string;
}
interface CategoryFormProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateCategoryBtn: () => Promise<void>;
  handleCloseDialog: () => void;
  isCreateCategoryLoading: boolean;
  category: Category;
  imageRef: React.MutableRefObject<HTMLInputElement | null>;
  preview: string;
}

const CategoryForm = ({
  handleInputChange,
  handleCreateCategoryBtn,
  imageRef,
  preview,
  handleCloseDialog,
  isCreateCategoryLoading,
  category,
}: CategoryFormProps) => {
  return (
    <div>
      {" "}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div>
            <input
              name="categoryImg"
              className="file-input mb-4"
              type="file"
              ref={imageRef}
              multiple={false}
              onChange={handleInputChange}
            />
            <div className="my-2 rounded-md">
              {preview && (
                <img className="rounded-md" src={preview} alt="imgPreview" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <input
              name="name_en"
              className="input input-bordered"
              type="text"
              placeholder="name_en"
              value={category.name_en}
              onChange={handleInputChange}
            />
            <input
              name="name_ar"
              className="input input-bordered"
              type="text"
              placeholder="name_ar"
              value={category.name_ar}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-4 items-center  mt-4">
            <button
              onClick={handleCreateCategoryBtn}
              className="btn w-40 hover:bg-[#577656] hover:text-white"
            >
              {isCreateCategoryLoading ? " Submitting..." : "submit"}
            </button>
            <button onClick={handleCloseDialog} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CategoryForm;
