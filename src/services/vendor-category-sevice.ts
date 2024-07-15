import create from "./http-service";

interface Child {
  id: number;
  name: string;
  image: string;
}
export interface Brand {
  id: number;
  name_en: string;
  icon: string;
  categories: Child[];
}
export interface VendorCategory {
  id: number;
  name: string;
  childs: Child[];
  brands: Brand[];
}

export default create("/categories");
