import { useEffect, useState } from "react";
import { Admin } from "../services/admins-service";
import apiClient from "../services/api-client";
import { useAuth } from "../contexts/AuthProvider";

const useAllAdmins = () => {
  const { auth } = useAuth();
  const [alladmins, setAllAdmins] = useState<Admin[]>([]);
  const [isAllAdminsError, setAllAdminsError] = useState("");
  const [isAllAdminsLoading, setAllAdminsLoading] = useState(false);

  useEffect(() => {
    if (!auth?.permissions.find((per) => per === "admin-export")) return;
    setAllAdminsLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/admins/fulldata/export", {
        signal: controller.signal,
      })
      .then((res) => {
        setAllAdmins(res.data.data);
        setAllAdminsLoading(false);
      })
      .catch((err) => {
        setAllAdminsError(err.response?.data.message);
        setAllAdminsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { alladmins, isAllAdminsError, isAllAdminsLoading };
};
export default useAllAdmins;
