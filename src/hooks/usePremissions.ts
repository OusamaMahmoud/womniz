import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { PermissionCategory, PermissionObject } from "../services/permission-service";

const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionCategory[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get<{ data: Record<string, { grouping: string; permissions: PermissionObject[] }> }>("/permissions", {
        signal: controller.signal,
      })
      .then((res) => {
        const formattedPermissions = Object.entries(res.data.data).map(([key, value]) => {
          const permissionsWithChecked = value.permissions.map((permission) => ({
            ...permission,
            checked: true, // Set the "checked" property to true for each permission
          }));
          return {
            grouping: value.grouping,
            permissions: permissionsWithChecked,
          };
        });
        setPermissions(formattedPermissions);
        console.log(formattedPermissions)
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { permissions,setPermissions, error, isLoading };
};

export default usePermissions;
