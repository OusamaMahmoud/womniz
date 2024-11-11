import { ProductDetailsHeading } from "../ProductDetailsUI";

export interface ProductImage {
  id: string;
  image: string;
}

const ProductDetailsThumbnail = ({
  handleEditBtn,
  thumbnail,
  images,
}: {
  handleEditBtn: () => void;
  thumbnail: string;
  images: ProductImage[];
}) => {
  return (
    <div className="border w-full 2xl:max-w-3xl mt-4 rounded-s-xl rounded-e-xl overflow-hidden shadow-md order-1 lg:order-none">
      <ProductDetailsHeading
        handleEditBtn={handleEditBtn}
        label="Thumbnail & Images"
      />
      <div className="flex flex-col items-center justify-center">
        {/* Main Thumbnail */}
        <div className="w-96 h-64 overflow-hidden rounded-lg mt-4 relative">
          <img
            src={thumbnail}
            className="w-full h-full object-cover object-center"
            alt="Thumbnail"
          />
          {/* Overlay for Main Thumbnail */}
          <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-semibold">Thumbnail Image</span>
          </div>
        </div>

        {/* Additional Thumbnails */}
        <div className="flex flex-wrap gap-4 justify-center items-center my-4 px-4">
          {images.map((_, index) => (
            <div
              key={_.id}
              className="w-36 h-36 overflow-hidden shadow-lg p-1 rounded-lg relative"
            >
              <img
                src={_.image}
                className="w-full h-full object-cover object-center"
                alt={`Thumbnail ${index + 1}`}
              />
              {/* Overlay for Each Thumbnail */}
              <div className="absolute inset-0 bg-black bg-opacity-55 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-semibold">
                  Image {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductDetailsThumbnail;
