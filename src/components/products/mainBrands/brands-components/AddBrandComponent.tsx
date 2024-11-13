import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { showToast } from "../../../reuse-components/ShowToast";
import apiClient from "../../../../services/api-client";

const AddBrandService = ({
  onBrandAdded,
  onCloseAddMode,
}: {
  onBrandAdded: () => void;
  onCloseAddMode: () => void;
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState("");
  const [isCreateCategoryLoading, setIsCreateCategoryLoading] = useState(false);
  const [targetBrand, setTargetBrand] = useState({
    brandImg: null,
    name_en: "",
    name_ar: "",
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
    console.log(targetBrand);
  }, [targetBrand]);

  const handleAddNewBrand = async () => {
    const formData = new FormData();

    formData.append("name_en", targetBrand.name_en);
    formData.append("name_ar", targetBrand.name_ar);
    if (targetBrand?.brandImg !== null) {
      formData.append("icon", targetBrand?.brandImg[0]);
    }

    if (
      !targetBrand?.name_en ||
      !targetBrand?.name_ar ||
      !targetBrand?.brandImg
    ) {
      showToast("Please Add Category Name Or Image", "info");
      return;
    }

    try {
      setIsCreateCategoryLoading(true);
      const res = await apiClient.post(`/brands`, formData);
      console.log(res);
      setIsCreateCategoryLoading(false);
      showToast("Your Main Brand has been Creating Successfully.", "success");
      setTargetBrand({ name_ar: "", name_en: "", brandImg: null });
      setPreview("");

      if (imageRef.current instanceof HTMLInputElement) {
        imageRef.current.value = "";
      }

      if (onBrandAdded) onBrandAdded();
    } catch (error) {
      console.log(error);
      showToast("Oops!.. Something went wrong!", "error");
      setIsCreateCategoryLoading(false);
    }
  };

  return (
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
            onClick={handleAddNewBrand}
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

export default AddBrandService;
