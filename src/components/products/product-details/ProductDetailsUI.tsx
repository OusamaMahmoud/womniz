import { Edit3Icon } from "lucide-react";

const ProductDetailsUI = () => {
  return (
    <div className="p-4 2xl:max-w-[1800px] flex flex-col mx-auto">
      <div className="p-4 shadow-md flex items-center flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Model ID:</span>
          <span>#12334</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Price:</span>
          <span>$100</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Sale:</span>
          <span>20%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Price After Sale:</span>
          <span>$100</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between lg:gap-10 items-center lg:items-start">
        <div className="w-full xl:min-w-[600px] order-2 lg:order-none ">

          <div className="border w-full  mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
            <ProductDetailsHeading
              label="Details"
              handleEditBtn={() => console.log("Edit")}
            />
            <div className="flex flex-col gap-4 my-4 px-4 ">
              <div className="flex items-center justify-between   ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Product Name:
                </span>
                <span>T-shirt</span>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Category:
                </span>
                <select className="select select-bordered">
                  <option value={1}>Clothes</option>
                  <option value={1}>Celebrates</option>
                  <option value={1}>jewelries</option>
                </select>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sub Category:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sub Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
            </div>
          </div>

          <div className="border w-full  mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
            <ProductDetailsHeading
              label="Details"
              handleEditBtn={() => console.log("Edit")}
            />
            <div className="flex flex-col gap-4 my-4 px-4 ">
              <div className="flex items-center justify-between   ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Product Name:
                </span>
                <span>T-shirt</span>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Category:
                </span>
                <select className="select select-bordered">
                  <option value={1}>Clothes</option>
                  <option value={1}>Celebrates</option>
                  <option value={1}>jewelries</option>
                </select>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sub Category:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
              <div className="flex items-center justify-between  ">
                <span className="font-bold opacity-45 min-w-36  text-lg">
                  Sub Brand:
                </span>
                <div className="flex items-center gap-3 flex-wrap">T-shirt</div>
              </div>
            </div>
          </div>
          
        </div>
        
        <ProductDetailsThumbnail
          handleEditBtn={() => console.log("thumbnail")}
          images={[
            "/assets/clothes/image1.webp",
            "/assets/clothes/image1.webp",
            "/assets/clothes/image1.webp",
            "/assets/clothes/image1.webp",
          ]}
          thumbnail="/assets/clothes/image1.webp"
        />
      </div>

      <ProductDetailsDescription
        description={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia maiores officiis quos ea, dicta quo, eveniet ut minus vero reprehenderit sapiente esse pariatur nemo nisi nulla sequi nihil et impedit."
        }
        handleEditBtn={() => console.log("desc")}
      />

      <ProductDetailsSpecification
        handleEditBtn={() => console.log("specicf eddit")}
        specifications={[
          {
            label: "Fit%Size",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab solutaenim debitis deleniti eveniet voluptates laudantium fugiat nihil nisivoluptatibus!",
          },
          {
            label: "Return",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab solutaenim debitis deleniti eveniet voluptates laudantium fugiat nihil nisivoluptatibus!",
          },
        ]}
      />
    </div>
  );
};

export default ProductDetailsUI;

const ProductDetailsHeading = ({
  label,
  handleEditBtn,
}: {
  label: string;
  handleEditBtn: () => void;
}) => {
  return (
    <div className="flex justify-between items-center bg-[#B6C9B599] p-4 ">
      <h1 className="text-xl font-semibold">{label}</h1>
      <span className="flex items-center gap-2 " onClick={handleEditBtn}>
        <Edit3Icon className="" width={20} />
        <span className="font-medium text-sm link">Edit</span>
      </span>
    </div>
  );
};

const ProductDetailsSpecification = ({
  specifications,
  handleEditBtn,
}: {
  specifications: { label: string; value: string }[];
  handleEditBtn: () => void;
}) => {
  return (
    <div className="border w-full xl:max-w-4xl mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Specification"
        handleEditBtn={handleEditBtn}
      />
      <div className="flex flex-col gap-4 my-4 px-4 ">
        {specifications.map((specific, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row gap-2 items-center justify-between   "
          >
            <span className="font-bold opacity-45 min-w-36  text-lg self-start">
              {specific.label}:
            </span>
            <span>{specific.value}</span>
            <p className="divider divider-vertical"></p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetailsDescription = ({
  handleEditBtn,
  description,
}: {
  handleEditBtn: () => void;
  description: string;
}) => {
  return (
    <div className="border w-full xl:max-w-4xl mt-4 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading
        label="Description"
        handleEditBtn={handleEditBtn}
      />
      <div className="p-4">{description}</div>
    </div>
  );
};

const ProductDetailsThumbnail = ({
  handleEditBtn,
  thumbnail,
  images,
}: {
  handleEditBtn: () => void;
  thumbnail: string;
  images: string[];
}) => {
  return (
    <div className="border w-full 2xl:max-w-3xl mt-4 rounded-s-xl rounded-e-xl overflow-hidden shadow-md order-1 lg:order-none">
      <ProductDetailsHeading
        handleEditBtn={handleEditBtn}
        label="Thumbnail & Images"
      />
      <div className="flex flex-col items-center justify-center">
        {/* Main Thumbnail */}
        <div className="w-96 h-96 overflow-hidden rounded-lg mt-4 relative">
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
              key={images[index]}
              className="w-24 h-24 overflow-hidden rounded-lg relative"
            >
              <img
                src={images[index]}
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
