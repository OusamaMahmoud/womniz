import { useCallback, useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Product } from "../services/clothes-service";
import _ from "lodash";
import { Meta, Pagination } from "../components/reuse-components/pagination/CustomPagination";
interface AdminsFilter {
  category?: string;
  status?: string;
  search?: string;
  brand?: string;
  page?: string;
}

const useProducts = ({
  category,
  status,
  search,
  brand,
  page
}: AdminsFilter) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [links, setLinks] = useState<Pagination>({} as Pagination);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const request = apiClient.get<{
      data: {
        data: Product[];
        meta: Meta;
        links:Pagination
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setProducts(res.data.data.data);
        console.log(res.data.data.data);
        setLoading(false);
        setMeta(res.data.data.meta);
        setLinks(res.data.data.links);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setLoading(false);
        setError(err.message);
      });

    return () => controller.abort();
  }, [category, status, search, brand ,page]);

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
  
  
  
    // If search is provided, return only the search parameter
    if (search) {
      return `${baseUrl}?search=${encodeURIComponent(search)}`;
    }
  
    // Otherwise, build the URL with other parameters
    const params = new URLSearchParams();
  
    if (category) {
      params.append("main_category_id", category);
    }
    if (brand) {
      params.append("brand_id", brand);
    }
    if (status) {
      params.append("status", status);
    }
    if (page) {
      params.append("page", page);
    }

    return `${baseUrl}?${params.toString()}`;
  };
  

  return {
    products,
    setProducts,
    isLoading,
    error,
    setError,
    meta,
    setMeta,
    links,
    setLinks
  };
};

export default useProducts;
