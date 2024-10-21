import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Category } from "../services/category-service";

const useMainCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { categories, error, isLoading, setCategories, setError };
};

export default useMainCategories;
