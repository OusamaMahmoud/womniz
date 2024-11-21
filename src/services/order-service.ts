import create from "./http-service";
interface Vendor {
  id: string;
  contactName: string;
}
export interface Order {
  id: number;
}
export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  addresses: {
    description: string;
    lat: string;
    long: string;
    label: string;
  }[];
}
export interface Address {
  id: number;
  apt_floor: string;
  label: string;
  map_address: string;
  street_address: string;
  lat: string;
  long: string;
}
export interface TargetOrder {
  id: number;
  date: string;
  address: Address;
  numberofItems: number;
  paymentMethod: string;
  shipping: string;
  status: string;
  total: number;
  totalsub: number;
  user: User;
  orderDetails: {
    quantity: number;
    price: number;
    price_after_sale: number;
    sku: string;
    product_information: {
      id: number;
      name: string;
      brand: { id: number; name_en: string };
      model_id: number;
      discount: number;
      thumbnail: string;
      totalsub: number;
      vendor: Vendor;
      seller_sku: string;
      name_en: string;
      price: string;
      price_after_sale: string;
    };
  }[];
}

export default create("/orders");
