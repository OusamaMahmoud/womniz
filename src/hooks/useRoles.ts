import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Category } from "../services/category-service";

const useRoles = () => {
  const [roles, setRoles] = useState<Category[]>([]);
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
        console.log(res.data);
        setRoles(res.data);
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
