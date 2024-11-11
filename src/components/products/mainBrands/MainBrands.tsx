import { useEffect, useRef, useState } from "react";
import useBrands from "../../../hooks/useBrands";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import MainBrandTableUi from "./brands-components/MainBrandTableUi";
import DeletedModel from "../../models/DeletedModel";
import apiClient from "../../../services/api-client";
import { BiAddToQueue } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TargetBrand {
  name_en: string;
  name_ar: string;
  brandImg: FileList | null;
}

const MainBrands = () => {
  const [refreshCategories, setRefreshCategories] = useState(false);
  const { brands } = useBrands(refreshCategories);
  const [targetBrandId, setTargetBrandId] = useState("");
  const [isDeletedBrandLoading, setIsDeletedBrandLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const [targetBrand, setTargetBrand] = useState<TargetBrand>({
    name_en: "",
    name_ar: "",
    brandImg: null,
  });

  const toggleDeleteModel = (key: "OPEN" | "CLOSE") => {
    const deleteModel = document.getElementById(
      "delete_model"
    ) as HTMLDialogElement;

    if (key === "OPEN") {
      deleteModel.showModal();
    } else {
      deleteModel.close();
    }
  };

  const toggleEditModel = (key: "OPEN" | "CLOSE") => {
    const editModel = document.getElementById(
      "edit_model"
    ) as HTMLDialogElement;

    if (key === "OPEN") {
      editModel.showModal();
    } else {
      editModel.close();
    }
  };

  const toggleAddNewBrandModel = (key: "OPEN" | "CLOSE") => {
    const editModel = document.getElementById(
      "add_brand_model"
    ) as HTMLDialogElement;

    if (key === "OPEN") {
      editModel.showModal();
    } else {
      editModel.close();
    }
  };

  useEffect(() => {
    if (targetBrand?.brandImg && targetBrand.brandImg.length > 0) {
      const imgPreview = URL.createObjectURL(targetBrand.brandImg[0]);
      setPreview(imgPreview);

      // Clean up the object URL after the component unmounts to prevent memory leaks
      return () => URL.revokeObjectURL(imgPreview);
    }
  }, [targetBrand]);

  const handleDeleteBrand = async () => {
    try {
      setIsDeletedBrandLoading(true);
      const res = await apiClient.post(`/brands/${targetBrandId}`, {
        _method: "DELETE",
      });
      setIsDeletedBrandLoading(false);
      toast.success("Brand is Successfully Deleted!");
      toggleDeleteModel("CLOSE");
      setRefreshCategories((prev) => !prev);
      setTargetBrandId("");
      console.log(res);
    } catch (error) {
      console.log("delete brand =>", error);
      setIsDeletedBrandLoading(false);
      toast.error("Oops! Something went wrong!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.currentTarget;

    if (type === "file" && files) {
      setTargetBrand((prev) => ({ ...prev, [name]: files }));
    } else {
      setTargetBrand((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewBrand = async (key: string) => {
    const formData = new FormData();

    formData.append("name_en", targetBrand.name_en);
    formData.append("name_ar", targetBrand.name_ar);
    if (key == "edit") {
      formData.append("_method", "PUT");
    }
    if (targetBrand?.brandImg !== null) {
      formData.append("image", targetBrand?.brandImg[0]);
    }

    // Skip validation check if key is "edit"
    if (
      key !== "edit" &&
      (!targetBrand?.name_en || !targetBrand?.name_ar || !targetBrand?.brandImg)
    ) {
      toast.warn("Please Add Category Name Or Image");
      return;
    }

    try {
      setIsCreateCategoryLoading(true);
      if (key === "edit") {
        const res = await apiClient.post(`/brands/${targetBrandId}`, formData);
        console.log(res);
      } else {
        const res = await apiClient.post(`/brands`, formData);
        console.log(res);
      }
      setIsCreateCategoryLoading(false);
      toast.success("Your Main Category has been Creating Successfully.");
      setTargetBrand({ name_ar: "", name_en: "", brandImg: null });
      setPreview("");
      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }
      setRefreshCategories((prev) => !prev);
      toggleAddNewBrandModel("CLOSE");
      toggleEditModel("CLOSE");
    } catch (error) {
      console.log(error);
      toast.error("Oops!.. Something went wrong!");
      setIsCreateCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (targetBrandId) {
      const br = brands.find((br) => br.id == targetBrandId);
      if (br) {
        setTargetBrand({
          brandImg: null,
          name_ar: br.name_ar,
          name_en: br.name_en,
        });
      }
    }
  }, [targetBrandId]);

  return (
    <div>
      <div className=" flex justify-between items-center">
        <HeadingOne marginBottom="5" label="Brands" />
        <div className="mb-2 mr-10">
          <button
            onClick={() => toggleAddNewBrandModel("OPEN")}
            className="btn  px-20 bg-womnizColor hover:bg-womnizColorLight text-white"
          >
            <BiAddToQueue /> Add New Brand
          </button>
        </div>
      </div>

      <dialog id={"add_brand_model"} className="modal">
        <div className="modal-box">
          <div>
            <input
              name="brandImg"
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
              value={targetBrand.name_en}
              onChange={handleInputChange}
            />
            <input
              name="name_ar"
              className="input input-bordered"
              type="text"
              placeholder="name_ar"
              value={targetBrand.name_ar}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-4 items-center  mt-4">
            <button
              disabled={isCreateCategoryLoading}
              onClick={() => handleAddNewBrand("")}
              className="btn w-40 hover:bg-[#577656] hover:text-white"
            >
              {isCreateCategoryLoading ? " Submitting..." : "submit"}
            </button>
            <button
              onClick={() => toggleAddNewBrandModel("CLOSE")}
              className="btn"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="delete_model" className="modal">
        <DeletedModel
          handleDeleteBtn={() => handleDeleteBrand()}
          handleCancelBtn={() => toggleDeleteModel("CLOSE")}
          isLoading={isDeletedBrandLoading}
        />
      </dialog>

      <dialog id={"edit_model"} className="modal">
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
              {brands.find((br) => br.id == targetBrandId)?.icon &&
                !preview && (
                  <img
                    className="rounded-md  "
                    src={brands.find((br) => br.id == targetBrandId)?.icon}
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
              value={targetBrand.name_en}
              onChange={handleInputChange}
            />
            <input
              name="name_ar"
              className="input input-bordered"
              type="text"
              placeholder="name_ar"
              value={targetBrand.name_ar}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex gap-4 items-center  mt-4">
            <button
              disabled={isCreateCategoryLoading}
              onClick={() => {
                handleAddNewBrand("edit");
              }}
              className="btn w-40 hover:bg-[#577656] hover:text-white"
            >
              {isCreateCategoryLoading ? " Submitting..." : "submit"}
            </button>
            <button onClick={() => toggleEditModel("CLOSE")} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>

      <MainBrandTableUi
        brands={brands}
        handleDeleteCategory={(id) => {
          toggleDeleteModel("OPEN");
          setTargetBrandId(id);
        }}
        handleEditCategory={(id) => {
          toggleEditModel("OPEN");
          setTargetBrandId(id);
        }}
      />
    </div>
  );
};

export default MainBrands;
