import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { TargetCategory } from "./useMainCategories";

const useSubCategories = ({
  mainCategoryID,
  refreshCategories,
}: {
  mainCategoryID: string;
  refreshCategories: boolean;
}) => {
  const [subCategories, setSubCategories] = useState<TargetCategory[]>([]);
  const [error, setError] = useState("");
  const [isSubCategoriesLoading, setIsSubCategoriesLoading] = useState(false);

  useEffect(() => {
    setIsSubCategoriesLoading(true);
    console.log("this in Sub Categories Hook ", mainCategoryID);
    const controller = new AbortController();
    apiClient
      .get(`/categories/sub/${mainCategoryID}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setSubCategories(res.data.data);
        setIsSubCategoriesLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setIsSubCategoriesLoading(false);
      });
    return () => controller.abort();
  }, [mainCategoryID, refreshCategories]);

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
