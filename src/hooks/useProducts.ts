import { useCallback, useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Product } from "../services/clothes-service";
import _ from "lodash";

interface AdminsFilter {
  category?: string;
  status?: string;
  search?: string;
  brand?: string;
}

const useProducts = ({ category, status, search, brand }: AdminsFilter) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        console.log(res.data.data.data);
        setProducts(res.data.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [category, status, search]);

  // Debounce the fetchAdmins function
  const debouncedFetchProducts = useCallback(
    _.debounce(fetchProducts, 500), // 500ms delay
    [fetchProducts]
  );

  useEffect(() => {
    debouncedFetchProducts();
    // Clean up the debounced function on unmount
    return debouncedFetchProducts.cancel;
  }, [debouncedFetchProducts]);

  const buildUrl = () => {
    const baseUrl = `/products`;
    const params = new URLSearchParams();

    if (category) {
      params.append(`category_id`, category);
    }

    if (brand) {
      params.append(`brand_id`, brand);
    }

    if (status) {
      params.append("status", status);
    }

    if (search) {
      params.append("search", search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    products,
    error,
    isLoading,
    setProducts,
    setError,
  };
};

export default useProducts;
