import create from "./http-service";
export interface PermissionObject {
  name: string;
  checked: boolean;
}
export interface PermissionCategory {
  grouping: string;
  permissions: PermissionObject[];
}

export default create("/permissions");
