import create from "./http-service";

export interface Category {
  id: number;
  name: string;
}

export default create('/categories');
