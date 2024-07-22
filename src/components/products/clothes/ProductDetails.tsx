import { BiEdit } from "react-icons/bi";
import orderSales from "../../../../public/assets/products/orderSales.svg";
import useProducts from "../../../hooks/useProducts";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProductDetails = () => {
  const { id } = useParams();

  const { products } = useProducts({})

  const targetProduct = products.find((item) => item.id === Number(id));
  useEffect(() => {
    console.log(targetProduct);
  }, [targetProduct]);

  return (
    <div className="container mx-auto px-8 py-10 shadow-xl rounded-xl">
      {targetProduct ? (
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
                <div className="max-w-[600px] shadow-xl p-6 rounded-md">
                  <h1 className="text-2xl font-bold mb-4">Details</h1>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">SKU</span>
                    <span>{targetProduct?.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Product Name
                    </span>
                    <span>{targetProduct?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Category</span>
                    <span>{targetProduct?.categories[0]?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Sub Category
                    </span>
                    <span>{targetProduct?.categories[1]?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Brand</span>
                    <span>{targetProduct?.brand.name}</span>
                  </div>
                </div>
              </div>
              <div className="max-w-2xl border flex flex-col items-center p-4 mt-20 h-fit">
                <div className="mb-5">
                  {targetProduct && (
                    <div className="min-w-[400px]">
                      <img
                        src={targetProduct.thumbnail}
                        className="w-[100%] object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-10  mt-16 ">
                  {targetProduct &&
                    targetProduct.images.map((item, idx) => (
                      <div key={idx} className="">
                        <img src={item.image} className="w-32 h-32" />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className=" mt-8 shadow-xl p-6 rounded-md">
              <h1 className="text-2xl font-bold mb-4">Details</h1>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-[#00000066]">Description</span>
                {targetProduct && (
                  <span>{extractContent(targetProduct?.desc)}</span>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-[#00000066]">Fit & Size</span>
                {targetProduct && (
                  <span>{extractContent(targetProduct?.fit_size_desc)}</span>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-[#00000066]">
                  Shipping Information
                </span>
                {targetProduct && (
                  <span>
                    {extractContent(targetProduct?.ship_information_desc)}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-[#00000066]">Return Orders</span>
                {targetProduct && (
                  <span>
                    {extractContent(targetProduct?.ship_information_desc)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-8 shadow-xl p-6 rounded-md">
              <h1 className="text-2xl font-bold mb-4">Pricing Details</h1>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl text-[#00000066]">Price</span>
                <span>{targetProduct?.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl text-[#00000066]">Womniz Sale</span>
                <span>{targetProduct?.discount}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-80 w-full"></div>
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-8 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

function extractContent(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}
