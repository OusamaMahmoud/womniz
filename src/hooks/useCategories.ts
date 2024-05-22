import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import categoryService, { Category } from "../services/category-service";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = categoryService.getAll<Category>();
    request
      .then((res) => {
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { categories, error, isLoading, setCategories, setError };
};

export default useCategories;
