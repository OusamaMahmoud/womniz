import create from "./http-service";

export interface Color {
  id: number;
  hexa: string;
  color: string;
}

export default create("/colors");
