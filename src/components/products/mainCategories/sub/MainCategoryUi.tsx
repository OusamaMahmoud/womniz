import { Category } from "../../../../services/category-service";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";

const MainCategoryUi = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((mainCategory) => (
        <div key={mainCategory.id} className="flex flex-col gap-10">
          <div className="relative w-full h-56 rounded-md overflow-hidden">
            {/* Image background */}
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${mainCategory.image})` }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Text over the image */}
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-gray-100 text-2xl sm:text-3xl md:text-4xl font-bold capitalize">
                {mainCategory?.name}
              </span>
            </div>
          </div>

          <Link
            to={`/products/${mainCategory?.name}`}
            className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 justify-center text-gray-700 hover:text-blue-500 transition-colors duration-200"
          >
            Details <BiRightArrowAlt className="inline" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainCategoryUi;
