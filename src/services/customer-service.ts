import create from "./http-service";

export interface Customer {
  id: number;
  name: string;
  email: string;
  image?: string; 
  phone: string;
  age: number;
  birthdate: string;
  address: string;
  country: string;
  status: string;
  city: string;
  adresses: string[];
  gender: string;
}

export default create("/users");
