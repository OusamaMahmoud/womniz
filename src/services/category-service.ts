import create from "./http-service";

export interface Category {
  id: number;
  title: string;
}

export default create('/data');
