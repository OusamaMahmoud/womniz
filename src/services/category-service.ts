import create from "./http-service";

export interface ChiledCategory {
  id: number;
  image: string;
  name: string;
}
export interface SubBrand {
  id: number;
  name: string;
  image: string;
}

export interface BrandOfMainCategory {
  id: string;
  name_en: string;
  icon: string;
  categories: SubBrand[];
}
export interface Category {
  id: number;
  name: string;
  image: string;
  brands: BrandOfMainCategory[];
  childs: ChiledCategory[];
}

export default create("/categories");
