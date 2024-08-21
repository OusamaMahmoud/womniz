import React, { useState } from "react";
import apiClient from "../services/api-client";
import { toast } from "react-toastify";
import { Product } from "../services/clothes-service";

const useDeleteProducts = ({
  products,
  selectedProducts,
  setSelectAll,
  setProducts,
  setIsDeleteEnabled,
}: {
  products: Product[];
  selectedProducts: Set<number>;
  setSelectAll: (value: boolean) => void;
  setProducts: (value: Product[]) => void;
  setIsDeleteEnabled: (value: boolean) => void;
}) => {
  const [isProductsDeleted, setProductsDeleted] = useState(false);

  const deleteProducts = async () => {
    if (selectedProducts.size > 0) {
      const data = new FormData();
      Array.from(selectedProducts).forEach((id, index) => {
        data.append(`ids[${index}]`, id.toString());
      });

      try {
        setProductsDeleted(true);
        await apiClient.post("/products/delete", data);
        toast.success("Products have been deleted successfully.");

        // Update the local products list
        const remainingProducts = products.filter(
          (product) => !selectedProducts.has(product.id)
        );
        setProducts(remainingProducts);
        setSelectAll(false);
        setIsDeleteEnabled(false);
      } catch (error) {
        toast.error("Failed to delete products");
        setProducts(products);
        setIsDeleteEnabled(false);
      } finally {
        setProductsDeleted(false);
        setIsDeleteEnabled(false);
      }
    }
  };

  return {
    isProductsDeleted,
    deleteProducts,
  };
};

export default useDeleteProducts;
