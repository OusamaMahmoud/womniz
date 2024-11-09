import { Edit } from "lucide-react";
import { TargetCategory } from "../../../../../hooks/useMainCategories";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface SubCategoryProps {
  subCategories: TargetCategory[];
  handleEditCategory: (id: string) => void;
  handleDeleteCategory: (id: string) => void;
  onNewSubCategoriesId: (id: string, subCategoryName: string) => void;
}
const SubCategoryUi = ({
  subCategories,
  handleDeleteCategory,
  handleEditCategory,
  onNewSubCategoriesId,
}: SubCategoryProps) => {
  const openCantPassModel = () => {
    const modal = document.getElementById("Cant_Pass") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const closeCantPassModel = () => {
    const modal = document.getElementById("Cant_Pass") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const handleNavigateLogic = (id: string) => {
    const targetCategory = subCategories.find(
      (subCategory) => subCategory.id == id
    );
    if (
      targetCategory?.isLastLevel === true &&
      targetCategory?.hasProducts === false
    ) {
      onNewSubCategoriesId(id, targetCategory.nameEn);
    } else if (
      targetCategory?.isLastLevel === true &&
      targetCategory?.hasProducts === true
    ) {
      openCantPassModel();
    } else if (targetCategory?.isLastLevel === false) {
      onNewSubCategoriesId(id, targetCategory.nameEn);
    }
  };

  return (
    <div className="overflow-x-auto">
      <dialog id={"Cant_Pass"} className="modal">
        <div className="modal-box w-[600px]  " style={{ maxWidth: "none" }}>
          <div className="w-full">
            <div className="h-[300px]">
              <img
                src="/assets/products/cantPass.png"
                alt="Cant Pass"
                className="object-contain w-full h-full"
              />
            </div>
            <p className="text-lg tracking-wider">
              This category has product and cannot have subcategories. Please
              remove the products before adding subcategories
            </p>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <button
              onClick={closeCantPassModel}
              className="btn bg-[#B6C9B5] px-20 flex justify-center items-center mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      <table className="table w-full">
        <thead>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50 ">
            Id
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Sub Category Name
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Sub Category Name
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Type
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Actions
          </th>
        </thead>
        <tbody>
          {subCategories.map((subCategory) => (
            <tr
              onClick={() => {
                handleNavigateLogic(subCategory.id);
              }}
              key={subCategory.id}
              className="cursor-pointer"
            >
              <td>{subCategory.id}</td>
              <td className="flex items-center gap-2">
                <p className="mask mask-squircle h-12 w-12">
                  <img src={subCategory.image} alt="Category Image" />
                </p>
                <span className="text-lg ">{subCategory.nameEn}</span>
              </td>
              <td className="text-lg">{subCategory.nameAr}</td>
              <td>{subCategory.isChild && "Sub Category"}</td>
              <td className="flex items-center gap-3 ">
                <Edit
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(subCategory.id);
                  }}
                />{" "}
                <MdDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(subCategory.id);
                  }}
                  size={28}
                  className="text-red-400"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubCategoryUi;
