import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
type Image = { id: number; image: string };
type Size = {
  discount: number;
  price: number;
  price_after_Sale: number;
  quantity: 4;
  size: string;
  sku_id: number;
};
type Color = {
  color: string;
  has_quantity: boolean;
  quantities: number;
  sizes: Size[];
};
interface TargetProduct {
  id: number;
  discount: number;
  thumbnail: string;
  desc_ar: string;
  desc_en: string;
  images: Image[];
  status: string;
  specifications: { name: string; value: string }[];
  price_after_sale: number;
  price: number;
  name_en: string;
  name_ar: string;
  model_id: string;
  country_id: number;
  country: string;
  brand: { id: number; name: string };
  categories: { id: number; name: string }[];
  colors: Color[];
}
const useTargetProduct = ({ productID }: { productID: string }) => {
  const [targetProduct, setTargetProduct] = useState<TargetProduct>(
    {} as TargetProduct
  );
  const [isGetProductLoading, setGetProductLoading] = useState(false);
  const [getProductError, setGetProductError] = useState("");

  useEffect(() => {
    const fetchTargetProduct = async () => {
      try {
        setGetProductLoading(true);
        const res = await apiClient.get(`/products/${productID}`);
        setGetProductLoading(false);
        setTargetProduct(res.data.data);
        console.log(res.data.data);
      } catch (error: any) {
        console.log(
          "Get Target product to update",
          error.response.data.message
        );
        setGetProductError(error.response.data.message);
      }
    };
    fetchTargetProduct();
  }, []);

  return {
    targetProduct,
    isGetProductLoading,
    getProductError,
    setTargetProduct,
    setGetProductLoading,
    setGetProductError,
  };
};
export default useTargetProduct;
