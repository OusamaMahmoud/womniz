import { ChiledCategory } from "../../../../services/category-service";
import { Link } from "react-router-dom";
import { BiRightArrowAlt } from "react-icons/bi";

const SubCategoryUi = ({
  subCategories,
}: {
  subCategories: ChiledCategory[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {subCategories.map((subCategory) => (
        <div key={subCategory.id} className="flex flex-col items-center justify-center gap-4">
          {/* Image with overlay */}
          <div className="relative rounded-full w-40 h-40 overflow-hidden">
            {/* Image */}
            <img
              src={subCategory.image}
              alt="subCategoryImage"
              className="object-cover w-full h-full"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Text over the image */}
            <div className="absolute inset-0 flex justify-center items-center">
              <h2 className="text-white text-lg font-semibold capitalize">
                {subCategory.name}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubCategoryUi;
