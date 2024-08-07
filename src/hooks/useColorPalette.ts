import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import {Color} from "../services/color-service";

const useColorPalette = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    apiClient
      .get(`/colors`, {
        signal: controller.signal,
      })
      .then((res) => {
        console.log(res.data.data);
        setColors(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();


  }, []);

  return {
    colors,
    error,
    isLoading,
    setColors,
    setError,
  };
};

export default useColorPalette;
