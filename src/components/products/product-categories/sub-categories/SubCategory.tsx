import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { HeadingOne } from "../../../reuse-components/HeadingOne";
import { TableSkeleton } from "../../../reuse-components/TableSkeleton";
import CategoryForm from "../main-categories/components/CategoryForm";
import SubCategoryUi from "./components/SubCategoryUi";
import useSubCategories from "../../../../hooks/useSubCategories";

interface Category {
  categoryImg: FileList | null;
  name_en: string;
  name_ar: string;
}
const SubCategory = () => {
  const params = useParams();

  const [preview, setPreview] = useState("");

  const [category, setCategory] = useState<Category>({
    categoryImg: null,
    name_en: "",
    name_ar: "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const openAddSubCategory = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseDialog = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) {
      modal.close();
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
    } catch (error) {
      console.log(error);
      toast.error("Oops!.. Something went wrong!");
    }
  };

  const [newParamId, setNewParamId] = useState("");

  useEffect(() => {
    if (params && params.id) {
      setNewParamId(params?.id?.toString());
    }
  }, [params]);

  const { subCategories } = useSubCategories({
    mainCategoryID: newParamId ?? "",
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8  pb-20">
      <ToastContainer />

      <CategoryForm
        dialogId={"my_modal_2"}
        category={category}
        handleCloseDialog={handleCloseDialog}
        handleCreateCategoryBtn={handleCreateCategoryBtn}
        handleInputChange={handleInputChange}
        imageRef={imageRef}
        isCreateCategoryLoading={false}
        preview={preview}
      />

      <HeadingOne marginBottom="mb-3" label={`Sub Categories`} />

      <div className="flex items-center my-10  gap-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
           font-medium text-gray-700 bg-white hover:bg-gray-50 
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={openAddSubCategory}
        >
          Add Sub Category
        </button>
      </div>
      <div className="flex flex-col">
        {false ? (
          <div>
            <TableSkeleton noOfElements={6} />
          </div>
        ) : (
          <SubCategoryUi
            onNewSubCategoriesId={(id) => setNewParamId(id)}
            subCategories={subCategories}
            handleDeleteCategory={(id) => console.log(id)}
            handleEditCategory={(id) => console.log(id)}
          />
        )}
      </div>
    </div>
  );
};

export default SubCategory;
