import { useState } from "react";
import { useLoading } from "../../../../contexts/LoadingContext";
import apiClient from "../../../../services/api-client";
import { showToast } from "../../../reuse-components/ShowToast";
import { Specification, ProductDetailsHeading } from "../ProductDetailsUI";

const ProductDetailsSpecification = ({
  specifications,
  handleEditBtn,
}: {
  specifications: Specification[];
  handleEditBtn: () => void;
}) => {
  const { setLoading } = useLoading();
  const [productSpecifications, setProductSpecifications] =
    useState<{ id: string; name: string; value: string }[]>(specifications);

  const handleDeleteCategory = async (id: string) => {
    console.log(id);
    try {
      setLoading(true);
      const res = await apiClient.post(`/product-specifications/${id}`, {
        _method: "delete",
      });
      console.log(res.data);
      setProductSpecifications((prev) =>
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
        label="Specification"
        handleEditBtn={handleEditBtn}
      />
      <div className="flex flex-col gap-4 my-4 px-4">
        {productSpecifications.map((specific) => (
          <div
            key={specific.id}
            className="flex items-center justify-between gap-4 border-b py-2  px-4"
          >
            <div className="flex flex-col md:flex-row gap-4 md:items-center flex-grow">
              <p className="font-bold text-gray-400 max-w-80">
                {specific.name}:
              </p>
              <p>{specific.value}</p>
            </div>
            <div
              className="cursor-pointer flex-shrink-0"
              onClick={() => handleDeleteCategory(specific.id)}
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
export default ProductDetailsSpecification;
