import create from "./http-service";

export interface Color {
  id: number;
  hexa: string;
  name: string;
}

export default create("/colors");
