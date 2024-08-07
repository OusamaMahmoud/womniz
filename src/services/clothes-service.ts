import create from "./http-service";

export interface Product {
  id: number;
  vendor_id: number;
  name_ar: string;
  name_en: string;
  brand: { id: number; name: string };
  price: number;
  categories: { id: number; name: string }[];
  variants: { size_id: number; stock: number; size: string; sku: string }[];
  country: string;
  status: string;
  images: { id: number; image: string }[];
  thumbnail: string;
  desc_ar: string;
  desc_en: string;
  fit_size_desc_ar: string;
  fit_size_desc_en: string;
  ship_information_desc: string;
  return_order_desc: string;
  discount: number;
  model_id: number;
  material_ar: string;
  material_en: string;
  product_type: string;
  product_sub_type: string;
  chain_length: string;
  dimension: string;
  color: { id: number; color: string; hexa: string };
  ingredients_desc_en:string
  about_product_desc_ar:string
}

export default create("/products");
