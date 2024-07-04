import { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import apiClient, { CanceledError } from "../services/api-client";
import { Request } from "../services/request-service";

interface RequestFilter {
  date: string;
  search: string;
}

const useRequests = ({ date, search }: RequestFilter) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const fetchRequests = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get(buildUrl(), {
      signal: controller.signal,
    });
    console.log(buildUrl());
    request
      .then((res) => {
         console.log(res.data.data.data);
         setRequests(res.data.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [search, date]);

  // Debounce the fetchAdmins function
  const debouncedFetchAdmins = useCallback(
    _.debounce(fetchRequests, 500), // 500ms delay
    [fetchRequests]
  );

  useEffect(() => {
    debouncedFetchAdmins();
    // Clean up the debounced function on unmount
    return debouncedFetchAdmins.cancel;
  }, [debouncedFetchAdmins]);

  const buildUrl = () => {
    const baseUrl = `/restoreAccountRequest`;
    const params = new URLSearchParams();

    if (date) {
      params.append("date", date);
    }

    if (search) {
      params.append("search", search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    requests,
    error,
    isLoading,
    setRequests,
    setError,
  };
};

export default useRequests;
