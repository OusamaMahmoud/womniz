import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Role } from "../services/role-service";

const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/roles", {
        signal: controller.signal,
      })
      .then((res) => {
        const response = res.data.data.data;

        const formattedRoles = response.map((role: Role) => {
          return {
            ...role,
            permissions: role.permissions.map((per) => ({
              name: per,
              isChecked: true,
            })),
          };
        });

        setRoles(formattedRoles);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { roles, error, isLoading, setRoles, setError };
};

export default useRoles;
