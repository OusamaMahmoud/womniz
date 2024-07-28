import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Size } from "../services/size-service";

const useSizes = ({ productType }: { productType: string }) => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get(`/sizes?product_sub_type=${productType}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setSizes(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [productType]);

  return {
    sizes,
    error,
    isLoading,
    setSizes,
    setError,
  };
};

export default useSizes;