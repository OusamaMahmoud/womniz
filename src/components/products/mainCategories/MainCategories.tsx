import React, { useEffect, useRef, useState } from "react";
import useMainCategories from "../../../hooks/useMainCategories";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import { TableSkeleton } from "../../reuse-components/TableSkeleton";
import apiClient from "../../../services/api-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainCategoryUi from "./sub/MainCategoryUi";
import CategoryForm from "./sub/CategoryForm";
interface Category {
  categoryImg: FileList | null;
  name_en: string;
  name_ar: string;
}
const MainCategories = () => {
  const { categories, isLoading, setCategories } = useMainCategories();
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [category, setCategory] = useState<Category>({
    categoryImg: null,
    name_en: "",
    name_ar: "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const toggleAddMainCategory = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
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

  const handleCreateCategoryBtn = async () => {
    const formData = new FormData();

    formData.append("name_en", category.name_en);
    formData.append("name_ar", category.name_ar);
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
      setCategories((prev) => [
        ...prev,
        {
          brands: [],
          childs: [],
          id: 0,
          image: preview,
          name: category.name_en,
        },
      ]);
      setCategory({ name_ar: "", name_en: "", categoryImg: null });
      setPreview("");
      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }
      handleCloseDialog();
    } catch (error) {
      console.log(error);
      toast.error("Oops!.. Something went wrong!");
    }
  };

  const handleCloseDialog = () => {
    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 shadow-xl pb-20">
      <ToastContainer />

      <CategoryForm
        category={category}
        handleCloseDialog={handleCloseDialog}
        handleCreateCategoryBtn={handleCreateCategoryBtn}
        handleInputChange={handleInputChange}
        imageRef={imageRef}
        isCreateCategoryLoading={isCreateCategoryLoading}
        preview={preview}
      />

      <HeadingOne marginBottom="mb-3" label="Main Categories" />

      <div className="flex items-center mb-10 justify-end gap-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleAddMainCategory}
        >
          Add Main Category
        </button>
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <div>
            <TableSkeleton noOfElements={6} />
          </div>
        ) : (
          <>{categories && <MainCategoryUi categories={categories} />}</>
        )}
      </div>
    </div>
  );
};

export default MainCategories;
