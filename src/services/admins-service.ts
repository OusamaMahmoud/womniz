import create from "./http-service";

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  country: string;
  countryId: string;
  category: string[];
  status: string;
  password: string;
  role: string;
  permissions: string[];
  image?: string; // Add photo to the Admin interface
}

export default create("/admins");
