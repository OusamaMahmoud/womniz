import create from "./http-service";

export interface Product {
  id: number;
  vendor_id: number;
  name: string;
  brand: { id: number; name: string };
  price: number;
  categories: { id: number; name: string }[];
  variants: { size_id: number; stock: number; size: string; sku: string }[];
  country: string;
  status: string;
  images: { id: number; image: string }[];
  thumbnail: string;
  desc: string;
  fit_size_desc: string;
  ship_information_desc: string;
  return_order_desc: string;
  discount: number;
  model_id:number;
  material:string;
}

export default create("/products");
