import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";

export interface TargetCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  image: string;
  isLastLevel: string;
  isParent: boolean;
  isChild: boolean;
}

const useMainCategories = () => {
  const [mainCategories, setMainCategories] = useState<TargetCategory[]>([]);
  const [error, setError] = useState("");
  const [isMainCategoriesLoading, setIsMainCategoriesLoading] = useState(false);

  useEffect(() => {
    setIsMainCategoriesLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/categories/main", {
        signal: controller.signal,
      })
      .then((res) => {
        setMainCategories(res.data.data);
        setIsMainCategoriesLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsMainCategoriesLoading(false);
      });
    return () => controller.abort();
  }, []);

  return {
    mainCategories,
    error,
    isLoading: isMainCategoriesLoading,
    setMainCategories,
    setError,
    isMainCategoriesLoading,
    setIsMainCategoriesLoading,
  };
};

export default useMainCategories;
