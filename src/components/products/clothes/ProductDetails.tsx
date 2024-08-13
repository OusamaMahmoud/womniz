import { BiEdit } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../../../services/clothes-service";
import apiClient from "../../../services/api-client";

const ProductDetails = () => {
  const [targetProduct, setTargetProduct] = useState<Product>();
  const [targetCategory, setTargetCategory] = useState("");

  const [, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    apiClient
      .get<{ data: Product }>(`products/${id}`)
      .then((res) => {
        setTargetProduct(res.data.data);
      })
      .catch((err: any) => setError(err.message));
  }, []);

  useEffect(() => {
    if (targetProduct) {
      console.log(targetProduct);
      setTargetCategory(targetProduct.product_type);
    }
  }, [targetProduct]);


  return (
    <div className="container mx-auto px-8 py-10 shadow-xl rounded-xl">
      {targetProduct ? (
        <div>
          <div className="">
            <div className="flex justify-between items-center mb-10">
              <h1 className="mb-2 text-3xl font-bold tracking-wider">
                Product Details
              </h1>
              <Link
                to={`/products/${targetCategory}/edit/${targetProduct?.id}`}
                className="flex items-center gap-2 border p-4 rounded-md"
              >
                <BiEdit /> Edit
              </Link>
            </div>

            <div className="flex justify-between items-start"  >
              <div className="flex flex-col ">
                <div className="max-w-[600px] xl:min-w-[600px] border p-6 rounded-md" data-aos="fade-right">
                  <h1 className="text-2xl font-bold mb-4">Details</h1>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Product Name
                    </span>
                    <span>{targetProduct?.name_en}</span>
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
                    <span>{targetProduct?.brand?.name}</span>
                  </div>
                </div>
                <div className="max-w-2xl mt-8 border p-6 rounded-md" data-aos="fade-right">
                  <h1 className="text-2xl font-bold mb-4">Pricing Details</h1>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">Price</span>
                    <span className="font-bold">{targetProduct?.price}$</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl text-[#00000066]">
                      Womniz Sale
                    </span>
                    <span className="font-bold">
                      {targetProduct?.discount}%
                    </span>
                  </div>
                </div>
              </div>

              {targetProduct.thumbnail && targetProduct.images ? (
                <div
                  className=" max-w-2xl border flex flex-col pt-4 items-center h-fit w-fit rounded-xl"
                  data-aos="fade-in"
                >
                  <div className="w-[80%] h-60 mb-2">
                    {targetProduct.thumbnail && (
                      <img
                        src={targetProduct.thumbnail}
                        className="object-cover rounded-lg w-[100%] h-[100%]"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap items-start justify-start gap-10  mt-6 rounded-lg w-full px-4">
                    {targetProduct.images &&
                      targetProduct.images.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          className="w-32 h-32 rounded-lg"
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <p>
                  <div className="skeleton"></div>
                  <div className="skeleton"></div>
                  <div className="skeleton"></div>
                  <div className="skeleton"></div>
                </p>
              )}
            </div>
            <div className="max-w-5xl mt-8 border p-6 rounded-md " data-aos="fade-up">
              <h1 className="text-2xl font-bold mb-4">Sizes</h1>
              <table className="max-w-xl border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Model ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Color
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {targetProduct &&
                    targetProduct.variants.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {targetProduct.model_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">yellow</td>
                        <td className="px-6 py-4 whitespace-nowrap">أصفر</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="max-w-5xl mt-8 border p-8 rounded-md " data-aos="fade-up">
              <h1 className="text-2xl font-bold mb-4">Details</h1>
              <div className=" flex gap-36 ">
                <div className="flex flex-col gap-4">
                  <p className="text-xl text-[#00000066]">Description</p>
                  <p className="text-xl text-[#00000066]">Fit & Size</p>
                  <p className="text-xl text-[#00000066]">
                    Shipping Information
                  </p>
                  <p className="text-xl text-[#00000066]">Return Orders</p>
                </div>
                <div className="flex flex-col gap-4">
                  {targetProduct && (
                    <p>{extractContent(targetProduct?.desc_en)}</p>
                  )}
                  {targetProduct && (
                    <p>{extractContent(targetProduct?.fit_size_desc_en)}</p>
                  )}
                  {targetProduct && (
                    <p>
                      {extractContent(targetProduct?.ship_information_desc)}
                    </p>
                  )}
                  {targetProduct && (
                    <p>
                      {extractContent(targetProduct?.return_order_desc)}
                    </p>
                  )}
                </div>
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
