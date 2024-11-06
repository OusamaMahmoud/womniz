import { Delete, DeleteIcon, Edit } from "lucide-react";
import { TargetCategory } from "../../../../../hooks/useMainCategories";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SubCategoryProps {
  subCategories: TargetCategory[];
  handleEditCategory: (id: string) => void;
  handleDeleteCategory: (id: string) => void;
  onNewSubCategoriesId: (id: string) => void;
}
const SubCategoryUi = ({
  subCategories,
  handleDeleteCategory,
  handleEditCategory,
  onNewSubCategoriesId,
}: SubCategoryProps) => {

  return (
    <div className="overflow-x-auto">
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
              onClick={() => onNewSubCategoriesId(subCategory.id)}
              key={subCategory.id}
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
              <td className="flex items-center gap-3">
                <Edit
                  size={20}
                  onClick={() => handleEditCategory(subCategory.id)}
                />{" "}
                <MdDelete
                  onClick={() => handleDeleteCategory(subCategory.id)}
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
