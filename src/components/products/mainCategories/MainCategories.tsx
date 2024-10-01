import React, { useEffect } from "react";
import useMainCategories from "../../../hooks/useMainCategories";
import { HeadingOne } from "../../reuse-components/HeadingOne";
import { BiRightArrow, BiRightArrowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { TableSkeleton } from "../../reuse-components/TableSkeleton";

const MainCategories = () => {
  const { categories, isLoading } = useMainCategories();
  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const toggleAddMainCategory = () => {};
  const toggleAddSubCategory = () => {};

  return (
    <div className="container px-20 shadow-xl pb-20">
      <HeadingOne label="Main Categories" />
      <div className="flex items-center mb-10 justify-end gap-4">
        <button className="btn btn-outline" onClick={toggleAddMainCategory}>
          Add Main Category
        </button>
        <button className="btn btn-outline" onClick={toggleAddSubCategory}>
          Add Sub Category
        </button>
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <div>
            <TableSkeleton noOfElements={6} />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-10">
            {categories &&
              categories.map((mainCategory) => (
                <div className="flex flex-col gap-4">
                  <div className="bg-[url('/assets/clothes/image1.webp')] bg-cover bg-center w-56 h-56 rounded-md  flex justify-center items-center text-white text-4xl font-extrabold">
                    {mainCategory?.name}
                  </div>
                  <Link
                    to={`/products/${mainCategory?.name}`}
                    className="text-2xl flex items-center gap-2 justify-center hover: hover:text-blue-300 cursor-pointer"
                  >
                    Details <BiRightArrowAlt />
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainCategories;
