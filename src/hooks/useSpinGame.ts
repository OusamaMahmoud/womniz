import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Spin } from "../services/spinGame-service";

const useSpinGame = () => {
  const [spinGameInform, setSpinGameInform] = useState<Spin>({} as Spin);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get("/spin/information", {
        signal: controller.signal,
      })
      .then((res) => {
        console.log(res.data.data);
        setSpinGameInform(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { spinGameInform, error, isLoading, setSpinGameInform, setError };
};

export default useSpinGame;
