import create from "./http-service";

export interface ChiledCategory {
  id: string;
}
export interface ChiledBrand {
  id: string;
}
export interface Category {
  id: number;
  name: string;
  brands: ChiledBrand[];
  childs: ChiledCategory[];
}

export default create("/categories");
