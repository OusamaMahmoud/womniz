import create from "./http-service";

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  country: string;
  category: string[];
  status: string;
  password: string;
  role: string;
  image?: string; // Add photo to the Admin interface
}

export default create("/admins");
