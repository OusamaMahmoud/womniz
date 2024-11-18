import { useState } from "react";
import { useLoading } from "../../../../contexts/LoadingContext";
import apiClient from "../../../../services/api-client";
import { ProductDetailsHeading } from "../ProductDetailsUI";

const ProductDetailsCategories = ({
  handleEditBtn,
  categories,
  productId,
}: {
  handleEditBtn: () => void;
  categories: any;
  productId: string;
}) => {
  const { setLoading } = useLoading();
  const [productCategories, setProductCategories] =
    useState<{ id: string; name: string }[]>(categories);

  const handleDeleteCategory = async (id: string) => {
    console.log(id);
    try {
      setLoading(true);
      const res = await apiClient.get(
        `/product-categories/delete/${productId}/${id}`
      );
      console.log(res.data);
      setProductCategories((prev) =>
        prev.filter((category) => category.id !== id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="border w-full xl:max-w-5xl mt-6 shadow-md rounded-s-xl rounded-e-xl overflow-hidden  ">
      <ProductDetailsHeading label="Categories" handleEditBtn={handleEditBtn} />
      <div className="flex flex-col gap-2 py-2 ">
        {productCategories?.map((item: any) => (
          <>
            <div key={item.id} className="flex items-center justify-around ">
              <span className="font-bold capitalize">{item.name}</span>
              <div
                className="cursor-pointer"
                onClick={() => handleDeleteCategory(item.id)}
              >
                <img
                  src="/assets/products/delete-category.png"
                  alt="deleteIcon"
                />
              </div>
            </div>
            <p className="divider divider-vertical m-0"></p>
          </>
        ))}
      </div>
    </div>
  );
};
export default ProductDetailsCategories;
