import { ChangeEvent, useEffect, useState } from "react";
import { TargetCategory } from "../../../../../hooks/useMainCategories";

interface TargetSubCategory {
  imageFile: File;
  name_en: string;
  name_ar: string;
}

const SubCategoryEditComponent = ({ sub_cat }: { sub_cat: TargetCategory }) => {
  const [sub, setSub] = useState<TargetSubCategory>({} as TargetSubCategory);
  const [imgPreview, setImgPreview] = useState("");
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files, name, value } = e.target;
    files
      ? setSub((prev) => ({ ...prev, [name]: files[0] }))
      : setSub((prev) => ({ ...prev, [name]: value }));

    if (files !== null && files[0]) {
      const blob = URL.createObjectURL(files[0]);
      setImgPreview(blob);
    }
  };

  const handleUpdateSub = () => {
    console.log(sub);
  };
  const handleToggleSub = (KEY: "OPEN" | "CLOSE") => {
    const model = document.getElementById("updateModel") as HTMLDialogElement;
    if (model && KEY === "OPEN") {
      model.showModal();
    } else {
      model.close();
    }
  };

  useEffect(() => {
    setSub((prev) => ({
      ...prev,
      name_ar: sub_cat.nameAr,
      name_en: sub_cat.nameEn,
    }));

    setImgPreview(sub_cat.image);
    console.log(sub_cat.image);
  }, [sub_cat]);

  return (
    <dialog className="modal" id="updateModel">
      <div className="modal-box flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <input
            name="imageFile"
            className="file-input"
            type="file"
            onChange={handleInputChange}
          />
          {imgPreview && <img src={imgPreview} alt="preview" />}
        </div>
        <input
          name="name_en"
          className="input input-bordered"
          type="text"
          value={sub.name_en}
          onChange={handleInputChange}
        />
        <input
          name="name_ar"
          className="input input-bordered"
          type="text"
          value={sub.name_ar}
          onChange={handleInputChange}
        />
        <div className=" flex items-center gap-4">
          <button className="btn px-10" onClick={handleUpdateSub}>
            Update
          </button>
          <button className="btn" onClick={() => handleToggleSub("CLOSE")}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SubCategoryEditComponent;
