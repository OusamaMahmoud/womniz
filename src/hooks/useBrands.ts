import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
export interface MainBrand {
  id: string;
  name_en: string;
  name_ar: string;
  icon: string;
}

const useBrands = (refreshCategories: boolean) => {
  const [brands, setBrands] = useState<MainBrand[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState("");

  useEffect(() => {
    try {
      setIsBrandsLoading(true);
      apiClient.get("/brands").then((res) => {
        console.log(res.data.data);
        setBrands(res.data.data);
      });
      setIsBrandsLoading(false);
    } catch (error) {
      console.log("brands error =>", error);
      setIsBrandsLoading(false);
    }
  }, [refreshCategories]);

  return {
    brands,
    isBrandsLoading,
  };
};
export default useBrands;
