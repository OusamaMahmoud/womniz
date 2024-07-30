import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { TargetOrder } from "../services/order-service";

const useTargetOrder = ({ orderId }: { orderId: string }) => {
  const [targetOrder, setTargetOrder] = useState<TargetOrder>({} as TargetOrder);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setError('')
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get(`/orders/${orderId}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setTargetOrder(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [orderId]);

  return {
    targetOrder,
    error,
    isLoading,
    setTargetOrder,
    setError,
  };
};

export default useTargetOrder;
