import { useEffect, useState } from "react";
import { Customer } from "../services/customer-service";
import apiClient from "../services/api-client";

const useAllCustomers = () => {
  const [allacustomers, setAllCustomers] = useState<Customer[]>([]);
  const [isAllCustomersError, setAllCustomersError] = useState("");
  const [isAllCustomersLoading, setAllCustomersLoading] = useState(false);

  useEffect(() => {
    setAllCustomersLoading(true)
    const controller = new AbortController();
    apiClient
      .get("/users/fulldata/export", {
        signal: controller.signal,
      })
      .then((res) => {
        setAllCustomers(res.data.data);
        setAllCustomersLoading(false)
      })
      .catch((err) => {
        setAllCustomersError(err.response?.data.message);
        setAllCustomersLoading(false)
      });

    return () => controller.abort();
  }, []);

  return {  allacustomers, isAllCustomersError, isAllCustomersLoading };
};
export default useAllCustomers;
