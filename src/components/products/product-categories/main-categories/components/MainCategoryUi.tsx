import { Delete, DeleteIcon, Edit } from "lucide-react";
import { TargetCategory } from "../../../../../hooks/useMainCategories";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
  categories: TargetCategory[];
  handleEditCategory: (id: string) => void;
  handleDeleteCategory: (id: string) => void;
}
const MainCategoryUi = ({
  categories,
  handleDeleteCategory,
  handleEditCategory,
}: CategoryProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50 ">
            Id
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Category Name
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Category Name
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Type
          </th>
          <th className="text-left text-lg capitalize px-4 py-2 bg-slate-50">
            Actions
          </th>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              onClick={() => navigate(`${category.id}/sub-categories`)}
              key={category.id}
              className="cursor-pointer"
            >
              <td>{category.id}</td>
              <td className="flex items-center gap-2">
                <p className="mask mask-squircle h-12 w-12">
                  <img src={category.image} alt="Category Image" />
                </p>
                <span className="text-lg ">{category.nameEn}</span>
              </td>
              <td className="text-lg">{category.nameAr}</td>
              <td>
                {category.isParent == true
                  ? "Main Category"
                  : category.isChild
                  ? "Sub Category"
                  : ""}
              </td>
              <td className="flex items-center gap-3">
                <Edit
                  className="cursor-pointer hover:bg-yellow-300 p-1 rounded-full transition duration-200 ease-in-out transform hover:scale-110"
                  size={30}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(category.id);
                  }}
                />
                <MdDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                  size={32}
                  className="text-red-400 cursor-pointer hover:bg-red-100 p-1 rounded-full transition duration-200 ease-in-out transform hover:scale-110"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainCategoryUi;
