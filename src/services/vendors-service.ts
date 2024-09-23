import create from "./http-service";

export interface Vendor {
  id: number;
  name: string;
  birthdate: string;
  bankName: string;
  contactName: string;
  email: string;
  image: string;
  phone: string;
  hqAddress: string;
  shippingAddress: string;
  commission: number;
  transfer_method: string;
  bankAccountName: string;
  accountNumber: string;
  ibanNumber: number;
  swiftNumber: string;
  status: string;
  legalDocs: string;
  commercialRegistration: string;
  vatCertificate: string;
  categories: [
    {
      id: number;
      name: string;
    }
  ];
}

export default create("/vendors");
