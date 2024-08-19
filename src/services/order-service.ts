import create from "./http-service";

export interface TargetOrder {
  id: number;
  date: string;
  address: {
    id: number;
    apt_floor: string;
    label: string;
    map_address: string;
    street_address: string;
    lat: string;
    long: string;
  };
  numberofItems: number;
  paymentMethod: string;
  shipping: string;
  status: string;
  total: number;
  totalsub: number;
  user: {
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
  };
  orderDetails: {
    quantity: number;
    price: number;
    price_after_sale: number;
    sku: string;
    product_information: {
      id: number;
      name: string;
      brand: { id: number; name: string };
      model_id: number;
      discount: number;
      thumbnail: string;
      totalsub: number;
    };
  }[];
}
export interface Order {
  id: number;
}

export default create("/orders");
