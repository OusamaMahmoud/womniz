import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { VendorCategory } from "../services/vendor-category-sevice";

const useVendorCategories = () => {
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>(
    []
  );
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/categories", {
        signal: controller.signal,
      })
      .then((res) => {
        setVendorCategories(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { vendorCategories, error, isLoading, setVendorCategories, setError };
};

export default useVendorCategories;
