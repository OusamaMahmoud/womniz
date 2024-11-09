import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HeadingOne } from "../../../reuse-components/HeadingOne";
import { TableSkeleton } from "../../../reuse-components/TableSkeleton";
import SubCategoryUi from "./components/SubCategoryUi";
import useSubCategories from "../../../../hooks/useSubCategories";
import apiClient from "../../../../services/api-client";
import CantPassModel from "./components/CantPassModel";
import { TargetCategory } from "../../../../hooks/useMainCategories";
import { IoWarning } from "react-icons/io5";

interface Category {
  categoryImg: FileList | null;
  name_en: string;
  name_ar: string;
}
const SubCategory = () => {
  const params = useParams();
  const [refreshCategories, setRefreshCategories] = useState(false); // State to trigger re-fetch
  const [preview, setPreview] = useState("");
  const location = useLocation();
  const categoryHeading = location?.state?.name;
  const [subCategoryHeading, setSubCategoryHeading] = useState(categoryHeading);
  const [subCategoryHeadingList, setSubCategoryHeadingList] = useState<
    string[]
  >([categoryHeading]);

  const [category, setCategory] = useState<Category>({
    categoryImg: null,
    name_en: "",
    name_ar: "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const openAddSubCategory = () => {
    const modal = document.getElementById(
      "Add_Sub_Category"
    ) as HTMLDialogElement;
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
  const openEditCategoryModel = () => {
    const modal = document.getElementById(
      "Edit_Sub_Category"
    ) as HTMLDialogElement;
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

  const closeEditCategoryModel = () => {
    const modal = document.getElementById(
      "Edit_Sub_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
      setPreview("");
    }
  };
  const openDeleteCategoryModel = () => {
    const modal = document.getElementById(
      "Delete_Sub_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeDeleteCategoryModel = () => {
    const modal = document.getElementById(
      "Delete_Sub_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };
  const handleCreateCategoryBtn = async (key: string) => {
    const formData = new FormData();

    formData.append("name_en", category.name_en);
    formData.append("name_ar", category.name_ar);
    if (key !== "edit") {
      formData.append("parent_id", navigatorParamsIds[navigatorParamsIds.length -1]);
    }

    if (key == "edit") {
      formData.append("_method", "PUT");
    }
    if (category?.categoryImg !== null) {
      formData.append("image", category?.categoryImg[0]);
    }

    // Skip validation check if key is "edit"
    if (
      key !== "edit" &&
      (!category?.name_en || !category?.name_ar || !category?.categoryImg)
    ) {
      toast.warn("Please Add Category Name Or Image");
      return;
    }

    try {
      setIsCreateCategoryLoading(true);
      if (key === "edit") {
        const res = await apiClient.post(
          `/categories/${targetMainCategoryId}`,
          formData
        );
        console.log(res);
      } else {
        const res = await apiClient.post(`/categories`, formData);
        console.log(res);
      }
      setIsCreateCategoryLoading(false);
      toast.success("Your Main Category has been Creating Successfully.");
      setCategory({ name_ar: "", name_en: "", categoryImg: null });
      setPreview("");
      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }
      setRefreshCategories((prev) => !prev);
      closeAddCategoryModel();
      closeEditCategoryModel();
    } catch (error) {
      console.log(error);
      toast.error("Oops!.. Something went wrong!");
      setIsCreateCategoryLoading(false);
    }
  };

  const closeAddCategoryModel = () => {
    const modal = document.getElementById(
      "Add_Sub_Category"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };
  const [navigatorParamsIds, setNavigatorParamsIds] = useState<string[]>([]);

  const [newParamId, setNewParamId] = useState("");
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);
  const navigate = useNavigate();
  const [targetMainCategoryId, setTargetMainCategoryId] = useState("");
  const [targetMainCategory, setTargetMainCategory] =
    useState<TargetCategory>();

  const handleNavigateBack = () => {
    setNavigatorParamsIds((prev) => {
      const newNavigator = prev.slice(0, -1);

      // Navigate to main categories if the navigator array is empty after removing
      if (newNavigator.length === 0) {
        navigate("/main-categories"); // Replace with the correct route to main categories
      }

      return newNavigator;
    });
    setSubCategoryHeadingList((prev) => {
      const newSubsList = prev.slice(0, -1);

      return newSubsList;
    });
  };

  useEffect(() => {
    if (params && params.id) {
      const paramId = params.id.toString();

      // Only add paramId if it's not already the last item in the array
      setNavigatorParamsIds((prev) =>
        prev[prev.length - 1] !== paramId ? [...prev, paramId] : prev
      );

      setNewParamId(paramId); // Set the main category ID
    }
  }, [params]);

  useEffect(() => {
    if (navigatorParamsIds.length > 0) {
      const lastParam = navigatorParamsIds[navigatorParamsIds.length - 1];
      if (lastParam !== undefined) setNewParamId(lastParam);
    }
    if (subCategoryHeadingList.length > 0) {
      const lastHeading =
        subCategoryHeadingList[subCategoryHeadingList.length - 1];
      if (lastHeading !== undefined) setSubCategoryHeading(lastHeading);
    }
  }, [navigatorParamsIds]);

  const { subCategories, isSubCategoriesLoading } = useSubCategories({
    mainCategoryID: newParamId ?? "",
    refreshCategories: refreshCategories,
  });
  useEffect(() => {
    if (targetMainCategoryId) {
      const targetCategory = subCategories.find(
        (subCategory) => subCategory.id == targetMainCategoryId
      );
      setTargetMainCategory(targetCategory);
    }
  }, [targetMainCategoryId]);

  useEffect(() => {
    if (targetMainCategory) {
      setCategory({
        ...category,
        name_ar: targetMainCategory?.nameAr,
        name_en: targetMainCategory?.nameEn,
      });
    }
  }, [targetMainCategory]);

  const [isMainCategoryDeleted, setIsMainCategoryDeleted] = useState(false);

  const handleDeleteCategory = async () => {
    const formData = new FormData();
    formData.append("_method", "delete");
    try {
      setIsMainCategoryDeleted(true);
      const res = await apiClient.post(
        `/categories/${targetMainCategoryId}`,
        formData
      );
      console.log(res);
      setIsMainCategoryDeleted(false);
      setCategory({ categoryImg: null, name_ar: "", name_en: "" });
      toast("Category Has Been Successfully Deleted!");
      setRefreshCategories((prev) => !prev);
      closeDeleteCategoryModel();
    } catch (error) {
      console.log(error);
      toast("Something Went wrong!");
      setIsMainCategoryDeleted(false);
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8  pb-20">
      <ToastContainer />

      <dialog id={"Add_Sub_Category"} className="modal">
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
              disabled={isCreateCategoryLoading}
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
      <dialog id={"Edit_Sub_Category"} className="modal">
        <div className="modal-box ">
          <div className="">
            <input
              name="categoryImg"
              className="file-input mb-4"
              type="file"
              ref={imageRef}
              multiple={false}
              onChange={handleInputChange}
            />
            <div className="my-4 rounded-md ">
              {targetMainCategory?.image && !preview && (
                <img
                  className="rounded-md  "
                  src={targetMainCategory?.image}
                  alt="imgPreview"
                />
              )}
              {preview && (
                <img
                  className="rounded-md object-cover "
                  src={preview}
                  alt="imgPreview"
                />
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
              disabled={isCreateCategoryLoading}
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

      <dialog id={"Delete_Sub_Category"} className="modal">
        <div className="modal-box ">
          <p className="  gap-1 text-xl mb-2 ">
            Are you sure you want to delete this category? This action cannot be
            undone.
            {/* This pushes the icon to the right */}
          </p>
          <span className="flex justify-center items-center mb-4">
            {" "}
            <IoWarning className="text-yellow-400" size={100} />
          </span>

          <div className="flex gap-4 items-center">
            <button
              disabled={isMainCategoryDeleted}
              onClick={handleDeleteCategory}
              className="btn w-40 text-white bg-red-400 hover:text-white"
            >
              {isMainCategoryDeleted ? " Deleting..." : "Delete"}
            </button>
            <button onClick={closeDeleteCategoryModel} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>
      <HeadingOne marginBottom="mb-3" label={subCategoryHeading} />

      <div className="flex items-center my-5  gap-4">
        {subCategories?.length > 0 && !isSubCategoriesLoading && (
          <div className="flex gap-4 items-center">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
             font-medium text-gray-700 bg-white hover:bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={openAddSubCategory}
            >
              Add Sub Category
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
             font-medium text-gray-700 bg-white hover:bg-gray-50
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleNavigateBack}
            >
              back
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {isSubCategoriesLoading ? (
          <TableSkeleton noOfElements={6} />
        ) : subCategories && subCategories?.length == 0 ? (
          <CantPassModel onAddSubs={openAddSubCategory} />
        ) : (
          <SubCategoryUi
            onNewSubCategoriesId={(id, subCategoryName) => {
              setNavigatorParamsIds((prev) => [...prev, id]);
              setNewParamId(id);
              setSubCategoryHeading(subCategoryName);
              setSubCategoryHeadingList((prev) => [...prev, subCategoryName]);
            }}
            subCategories={subCategories}
            handleDeleteCategory={(id) => {
              openDeleteCategoryModel();
              setTargetMainCategoryId(id);
            }}
            handleEditCategory={(id) => {
              openEditCategoryModel();
              setTargetMainCategoryId(id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubCategory;
