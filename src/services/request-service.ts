import create from "./http-service";

export interface Request {
  id: number;
  name: string;
  permissions: { name: string; isChecked: boolean }[];
}

export default create("/requests");
