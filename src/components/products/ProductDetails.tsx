import { BiEdit } from "react-icons/bi";
import orderSales from "../../../public/assets/products/orderSales.svg";
import cardPrev from "../../../public/assets/products/subCategory.svg";

const ProductDetails = () => {
  return (
    <div className="container mx-auto px-8 py-10 shadow-xl rounded-xl">
      <div>
        <div className="">
          <div className="flex justify-between items-center mb-10">
            <h1 className="mb-2 text-2xl font-bold tracking-wider">
              Product Details
            </h1>
            <p className="flex items-center gap-2 border p-4 rounded-md">
              <BiEdit /> Edit
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div>
                <img src={orderSales} />
              </div>
              <div>
                <div className="max-w-[600px] shadow-xl p-6 rounded-md">
                  <h1 className="text-2xl font-bold mb-4">
                    Product Information
                  </h1>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Product Name
                    </span>
                    <span>T-shirt</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Category</span>
                    <span>Clothes</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Sub Category
                    </span>
                    <span>Tops</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Brand</span>
                    <span>Zara</span>
                  </div>
                </div>
                <div className="max-w-[600px]  mt-8 shadow-xl p-6 rounded-md">
                  <h1 className="text-2xl font-bold mb-4">
                    Product Description
                  </h1>
                  <p className="text-xl text-[#00000066]">
                    White shirt with sleeves with unique design for sleeves
                    which make your look very awesome
                  </p>
                </div>
                <div className="max-w-[600px] mt-8 shadow-xl p-6 rounded-md">
                  <h1 className="text-2xl font-bold mb-4">Pricing Details</h1>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Product Name
                    </span>
                    <span>200 $</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Category</span>
                    <span>5%</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Sub Category
                    </span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" border p-4 *:rounded-lg">
              <div className="relative mx-auto mb-4 w-[600px] h-[650px] rounded-md  flex justify-center items-center">
                <img src={cardPrev} className="object-cover  w-full h-full  rounded-md "/>
                <p className="absolute bottom-0 w-full text-center text-white text-xl rounded-t-lg p-6 bg-slate-600">Default </p>
              </div>
              <div className="flex gap-6 items-center justify-center">
                <div>
                  <img src={cardPrev} />
                </div>
                <div>
                  <img src={cardPrev} />
                </div>
                <div>
                  <img src={cardPrev} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
