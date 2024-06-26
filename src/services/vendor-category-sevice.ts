import create from "./http-service";

export interface VendorCategory {
  id: number;
  name: string;
}

export default create("/categories");
