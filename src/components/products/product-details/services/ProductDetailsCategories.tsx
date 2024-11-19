import { useState } from "react";
import { useLoading } from "../../../../contexts/LoadingContext";
import apiClient from "../../../../services/api-client";
import { ProductDetailsHeading } from "../ProductDetailsUI";
import { showToast } from "../../../reuse-components/ShowToast";

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
      showToast("This category has been Deleted Successfully.", "success");
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      showToast(error.response.data.data.error, "error");
    }
  };

  return (
    <div className="border w-full xl:max-w-5xl mt-6 shadow-md rounded-s-xl rounded-e-xl overflow-hidden">
      <ProductDetailsHeading
        actionKey="Add"
        label="Categories"
        handleEditBtn={handleEditBtn}
      />
      <div className="flex flex-col items-start gap-2 py-2">
        {productCategories?.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between w-full gap-4 border-b py-2 px-10"
          >
            <span className="font-bold capitalize flex-1">{item.name}</span>
            <div
              className="cursor-pointer flex-shrink-0 "
              onClick={() => handleDeleteCategory(item.id)}
            >
              <img
                src="/assets/products/delete-category.png"
                alt="deleteIcon"
                className="w-5 h-5"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductDetailsCategories;
