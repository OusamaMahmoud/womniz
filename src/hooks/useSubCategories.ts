import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { TargetCategory } from "./useMainCategories";

const useSubCategories = ({ mainCategoryID }: { mainCategoryID: string }) => {
  const [subCategories, setSubCategories] = useState<TargetCategory[]>([]);
  const [error, setError] = useState("");
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(false);

  useEffect(() => {
    setIsSubCategoriesLoading(true);
    const controller = new AbortController();
    apiClient
      .get(`/categories/sub/${mainCategoryID}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setSubCategories(res.data.data);
        console.log(res.data.data);
        setIsSubCategoriesLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsSubCategoriesLoading(false);
      });
    return () => controller.abort();
  }, [mainCategoryID]);

  return {
    subCategories,
    error,
    setSubCategories,
    setError,
    isSubCategoriesLoading,
    setIsSubCategoriesLoading,
  };
};

export default useSubCategories;
