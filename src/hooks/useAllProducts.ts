import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Vendor } from "../services/vendors-service";

const useAllProducts = () => {
  const [allProducts, setAllProducts] = useState<Vendor[]>([]);
  const [isAllProductsError, setAllProductsError] = useState("");
  const [isAllProductsLoading, setAllProductsLoading] = useState(false);

  useEffect(() => {
    setAllProductsLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/products/fulldata/export", {
        signal: controller.signal,
      })
      .then((res) => {
        setAllProducts(res.data.data);
        setAllProductsLoading(false);
      })
      .catch((err) => {
        setAllProductsError(err.response?.data.message);
        setAllProductsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { allProducts, isAllProductsError, isAllProductsLoading };
};
export default useAllProducts;
