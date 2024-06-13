import create from "./http-service";

export interface Role {
  id: number;
  name: string;
  permissions: { name: string; isChecked: boolean }[];
}

export default create("/roles");
