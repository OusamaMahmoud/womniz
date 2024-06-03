import create from "./http-service";

export interface Vendor {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  image: string;
  phone: string;
  hq_address: string;
  shipping_address: string;
  commission: number;
  transfer_method: string;
  bank_account_name: string;
  account_number: string;
  swift_number: number;
  iban_number: string;
  status: string;
  categories: [
    {
      id: number;
      name: string;
    }
  ];
}

export default create("/vendors");
