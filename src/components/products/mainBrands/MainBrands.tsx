import { useEffect, useRef, useState } from "react";
import useBrands from "../../../hooks/useBrands";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import MainBrandTableUi from "./brands-components/MainBrandTableUi";
import DeletedModel from "../../models/DeletedModel";
import apiClient from "../../../services/api-client";
import { BiAddToQueue } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddBrandService from "./brands-components/AddBrandComponent";
import EditBrandService from "./brands-components/EditBrandService";
import { TableSkeleton } from "../../reuse-components/TableSkeleton";

interface TargetBrand {
  name_en: string;
  name_ar: string;
  brandImg: FileList | null;
}

const MainBrands = () => {
  const [refreshCategories, setRefreshCategories] = useState(false);
  const { brands, isBrandsLoading } = useBrands(refreshCategories);
  const [targetBrandId, setTargetBrandId] = useState("");
  const [isDeletedBrandLoading, setIsDeletedBrandLoading] = useState(false);
  const [, setPreview] = useState("");

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
  
  useEffect(() => {
    console.log(isBrandsLoading);
  }, []);

  return (
    <div className="px-4">
      <AddBrandService
        onBrandAdded={() => {
          setRefreshCategories((prev) => !prev);
          toggleAddNewBrandModel("CLOSE");
        }}
        onCloseAddMode={() => toggleAddNewBrandModel("CLOSE")}
      />

      <EditBrandService
        brandId={targetBrandId}
        brands={brands}
        onEditBrand={() => {
          setRefreshCategories((prev) => !prev);
          toggleEditModel("CLOSE");
          setTargetBrandId("");
        }}
        onCloseAddMode={() => toggleEditModel("CLOSE")}
      />

      <dialog id="delete_model" className="modal">
        <DeletedModel
          handleDeleteBtn={() => handleDeleteBrand()}
          handleCancelBtn={() => toggleDeleteModel("CLOSE")}
          isLoading={isDeletedBrandLoading}
        />
      </dialog>

      <div className=" flex justify-between items-center">
        <HeadingOne marginBottom="5" label="Brands" />
        <div className="mb-4">
          <button
            onClick={() => toggleAddNewBrandModel("OPEN")}
            className="btn  px-20 bg-womnizColor hover:bg-womnizColorLight text-white"
          >
            <BiAddToQueue /> Add New Brand
          </button>
        </div>
      </div>

      {isBrandsLoading ? (
        <TableSkeleton noOfElements={8} />
      ) : (
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
      )}
    </div>
  );
};

export default MainBrands;
