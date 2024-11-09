import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";

export interface TargetCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  image: string;
  isLastLevel: boolean;
  isParent: boolean;
  isChild: boolean;
  hasProducts: boolean;
}

const useMainCategories = (refresh: boolean) => {
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
  }, [refresh]);

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
