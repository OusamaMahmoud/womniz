import create from "./http-service";

export interface TargetOrder {
  id: number;
  date: string;
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
    addresses: { description: string }[];
  };
  orderDetails: {
    quantity: number;
    price: number;
    price_after_sale: number;
    sku:string;
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
  id:number;
}

export default create("/orders");
