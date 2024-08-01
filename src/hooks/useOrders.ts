import { useCallback, useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Product } from "../services/clothes-service";
import _ from "lodash";
interface MetaObject {
  current_page: number;
  from: number;
  per_page: number;
  to: number;
}
interface AdminsFilter {
  status?: string;
  search?: string;
  page?: string;
  date?: string;
}

const useOrders = ({ status, search, page ,date }: AdminsFilter) => {
  const [orders, setOrders] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [meta, setMeta] = useState<MetaObject>({} as MetaObject);
  const [next, setNext] = useState<string | null>("");
  const [prev, setPrev] = useState<string | null>("");

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const request = apiClient.get(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setOrders(res.data.data.data);
        setLoading(false);
        setMeta(res.data.data.meta);
        setNext(res.data.data.links.next);
        setPrev(res.data.data.links.prev);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setLoading(false);
        setError(err.message);
      });

    return () => controller.abort();
  }, [status, search, page ,date]);

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
    const baseUrl = `/orders`;
    const params = new URLSearchParams();

    if (status) {
      params.append("status", status);
    }

    if (search) {
      params.append("search", search);
    }
    
    if (page) {
      params.append("page", page);

    }
    if (date) {
      params.append("date", date);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    orders,
    error,
    isLoading,
    setOrders,
    setError,
    meta,
    setMeta,
    next,
    prev,
  };
};

export default useOrders;
