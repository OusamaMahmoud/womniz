import {  Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainBrand } from "../../../../hooks/useBrands";

interface CategoryProps {
  brands: MainBrand[];
  handleEditCategory: (id: string) => void;
  handleDeleteCategory: (id: string) => void;
}

const MainBrandTableUi = ({
  brands,
  handleDeleteCategory,
  handleEditCategory,
}: CategoryProps) => {
  return (
    <div className="overflow-x-auto">
      <ToastContainer />
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
          {brands.map((brand) => (
            <tr
              // onClick={() => handleNavigateAction(brand.id)}
              key={brand.id}
              className="cursor-pointer"
            >
              <td>{brand.id}</td>
              <td className="flex items-center gap-2">
                <p className="mask mask-squircle h-12 w-12">
                  <img src={brand.icon} alt="brand Image" />
                </p>
                <span className="text-lg ">{brand.name_en}</span>
              </td>
              <td className="text-lg">{brand.name_ar}</td>
              <td>Main Brands</td>
              <td className="flex items-center gap-3">
                <Edit
                  className="cursor-pointer hover:bg-yellow-300 p-1 rounded-full transition duration-200 ease-in-out transform hover:scale-110"
                  size={30}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(brand.id);
                  }}
                />
                <MdDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(brand.id);
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

export default MainBrandTableUi;
