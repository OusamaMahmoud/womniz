import create from "./http-service";

export interface Size {
  id: number;
  title: string;
}

export default create("/sizes");
