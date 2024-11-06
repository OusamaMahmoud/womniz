import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMainCategories, {
  TargetCategory,
} from "../../../../hooks/useMainCategories";
import apiClient from "../../../../services/api-client";
import { HeadingOne } from "../../../reuse-components/HeadingOne";
import { TableSkeleton } from "../../../reuse-components/TableSkeleton";
import CategoryForm from "./components/CategoryForm";
import MainCategoryUi from "./components/MainCategoryUi";
interface Category {
  categoryImg: FileList | null;
  name_en: string;
  name_ar: string;
}
const MainCategories = () => {
  const { mainCategories, isMainCategoriesLoading } = useMainCategories();
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [targetMainCategoryId, setTargetMainCategoryId] = useState("");
  const [targetMainCategory, setTargetMainCategory] =
    useState<TargetCategory>();

  const [category, setCategory] = useState<Category>({
    categoryImg: null,
    name_en: "",
    name_ar: "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const openAddCategoryModel = () => {
    const modal = document.getElementById(
      "Add_Main_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeAddCategoryModel = () => {
    const modal = document.getElementById(
      "Add_Main_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const openEditCategoryModel = () => {
    const modal = document.getElementById(
      "Edit_Main_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeEditCategoryModel = () => {
    const modal = document.getElementById(
      "Edit_Main_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
      setPreview("");
    }
  };

  useEffect(() => {
    if (category?.categoryImg !== null) {
      const imgPreview = URL?.createObjectURL(category?.categoryImg?.[0]);
      setPreview(imgPreview);
    }
  }, [category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.currentTarget;

    if (type === "file" && files) {
      setCategory((prev) => ({ ...prev, [name]: files }));
    } else {
      setCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCategoryBtn = async (key: string) => {
    const formData = new FormData();

    formData.append("name_en", category.name_en);
    formData.append("name_ar", category.name_ar);
    if (key == "edit") {
      formData.append("_method", "PUT");
    }
    if (category?.categoryImg !== null) {
      formData.append("image", category?.categoryImg[0]);
    }

    if (
      category?.name_en == "" ||
      category?.name_ar == "" ||
      category?.categoryImg == null
    ) {
      toast.warn("Please Add Category Name Or Image");
      return;
    }

    try {
      setIsCreateCategoryLoading(true);
      const res = await apiClient.post("/categories", formData);
      setIsCreateCategoryLoading(false);
      console.log(res);
      toast.success("Your Main Category has been Creating Successfully.");
      setCategory({ name_ar: "", name_en: "", categoryImg: null });
      setPreview("");
      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }
      closeAddCategoryModel();
    } catch (error) {
      console.log(error);
      toast.error("Oops!.. Something went wrong!");
    }
  };

  useEffect(() => {
    if (targetMainCategoryId) {
      const targetCategory = mainCategories.find(
        (category) => category.id == targetMainCategoryId
      );
      setTargetMainCategory(targetCategory);
    }
  }, [targetMainCategoryId]);

  useEffect(() => {
    console.log(targetMainCategory);
  }, [targetMainCategory]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <ToastContainer />

      <dialog id={"Add_Main_Category"} className="modal">
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
              onClick={() => handleCreateCategoryBtn("")}
              className="btn w-40 hover:bg-[#577656] hover:text-white"
            >
              {isCreateCategoryLoading ? " Submitting..." : "submit"}
            </button>
            <button onClick={closeAddCategoryModel} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id={"Edit_Main_Category"} className="modal">
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
              {targetMainCategory?.image && !preview && (
                <img
                  className="rounded-md"
                  src={targetMainCategory?.image}
                  alt="imgPreview"
                />
              )}
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
              value={targetMainCategory?.nameEn}
              onChange={handleInputChange}
            />
            <input
              name="name_ar"
              className="input input-bordered"
              type="text"
              placeholder="name_ar"
              value={targetMainCategory?.nameAr}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-4 items-center  mt-4">
            <button
              onClick={() => {
                handleCreateCategoryBtn("edit");
              }}
              className="btn w-40 hover:bg-[#577656] hover:text-white"
            >
              {isCreateCategoryLoading ? " Submitting..." : "submit"}
            </button>
            <button onClick={closeEditCategoryModel} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>

      <HeadingOne marginBottom="mb-3" label="Main Categories" />

      <div className="flex items-center mb-10 justify-end gap-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={openAddCategoryModel}
        >
          Add Main Category
        </button>
      </div>
      <div className="flex flex-col">
        {isMainCategoriesLoading ? (
          <div>
            <TableSkeleton noOfElements={6} />
          </div>
        ) : (
          <>
            {mainCategories && (
              <MainCategoryUi
                categories={mainCategories}
                handleDeleteCategory={(id) => {
                  setTargetMainCategoryId(id);
                }}
                handleEditCategory={(id) => {
                  openEditCategoryModel();
                  setTargetMainCategoryId(id);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainCategories;
