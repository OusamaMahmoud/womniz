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
  addresses: {
    id: string;
    label: string;
    map_address: string;
    street_address: string;
    apt_floor: string;
    lat: string;
    long: string;
  }[];
  gender: string;
}

export default create("/users");
