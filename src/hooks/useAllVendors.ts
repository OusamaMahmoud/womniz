import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { Vendor } from "../services/vendors-service";

const useAllVendors = () => {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [isAllVendorsError, setAllVendorsError] = useState("");
  const [isAllVendorsLoading, setAllVendorsLoading] = useState(false);

  useEffect(() => {
    setAllVendorsLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/vendors/fulldata/export", {
        signal: controller.signal,
      })
      .then((res) => {
        setAllVendors(res.data.data);
        setAllVendorsLoading(false);
      })
      .catch((err) => {
        setAllVendorsError(err.response?.data.message);
        setAllVendorsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { allVendors, isAllVendorsError, isAllVendorsLoading };
};
export default useAllVendors;
