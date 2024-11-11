import { useEffect, useRef, useState } from "react";
import { MainBrand } from "../../../../hooks/useBrands";
import { showToast } from "../../../reuse-components/ShowToast";
import apiClient from "../../../../services/api-client";

const EditBrandService = ({
  brandId,
  brands,
  onEditBrand,
  onCloseAddMode,
}: {
  brandId: string;
  brands: MainBrand[];
  onEditBrand: () => void;
  onCloseAddMode: () => void;
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);

  const [targetBrand, setTargetBrand] = useState({
    name_en: "",
    name_ar: "",
    brandImg: null,
  });

  useEffect(() => {
    if (targetBrand?.brandImg) {
      const imgPreview = URL.createObjectURL(targetBrand.brandImg[0]);
      setPreview(imgPreview);

      // Clean up the object URL after the component unmounts to prevent memory leaks
      return () => URL.revokeObjectURL(imgPreview);
    }
  }, [targetBrand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.currentTarget;

    if (type === "file" && files) {
      setTargetBrand((prev) => ({ ...prev, [name]: files }));
    } else {
      setTargetBrand((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const brand = brands.find((br) => br.id == brandId);
    if (brand) {
      setTargetBrand({
        brandImg: null,
        name_ar: brand?.name_ar,
        name_en: brand?.name_en,
      });
      setPreview(brand.icon);
    }
  }, [brandId]);

  const handleAddNewBrand = async () => {
    const formData = new FormData();

    formData.append("name_en", targetBrand.name_en);
    formData.append("name_ar", targetBrand.name_ar);
    formData.append("_method", "PUT");
    if (targetBrand?.brandImg !== null) {
      formData.append("icon", targetBrand?.brandImg[0]);
    }

    // Skip validation check if key is "edit"
    if (!targetBrand?.name_en || !targetBrand?.name_ar) {
      showToast("Please Add Category Name Or Image", "info");
      return;
    }

    try {
      setIsCreateCategoryLoading(true);
      const res = await apiClient.post(`/brands/${brandId}`, formData);
      console.log(res);

      setIsCreateCategoryLoading(false);
      showToast("Your Main Category has been Editing Successfully.", "success");
      setTargetBrand({ name_ar: "", name_en: "", brandImg: null });
      setPreview("");
      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }
      if (onEditBrand) onEditBrand();
    } catch (error) {
      console.log(error);
      showToast("Oops!.. Something went wrong!", "error");
      setIsCreateCategoryLoading(false);
    }
  };

  return (
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
              handleAddNewBrand();
            }}
            className="btn w-40 hover:bg-[#577656] hover:text-white"
          >
            {isCreateCategoryLoading ? " Submitting..." : "submit"}
          </button>
          <button onClick={() => onCloseAddMode()} className="btn">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditBrandService;
