import { useEffect, useState, useCallback } from "react";
import _ from 'lodash';
import apiClient, { CanceledError } from "../services/api-client";
import { Admin } from "../services/admins-service";

interface MetaObject {
  current_page: number;
  from: number;
  per_page: number;
  to: number;
}
interface AdminsFilter {
  categories: string;
  status: string;
  search: string;
  isFetching: boolean;
  page: string;
}

const useAdmins = ({
  categories,
  status,
  search,
  isFetching,
  page,
}: AdminsFilter) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [meta, setMeta] = useState<MetaObject>({} as MetaObject);
  const [next, setNext] = useState<string | null>("");
  const [prev, setPrev] = useState<string | null>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get<{
      data: {
        data: Admin[];
        meta: MetaObject;
        links: { next: string | null; prev: string | null };
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setMeta(res.data.data.meta);
        setAdmins(res.data.data.data);
        setNext(res.data.data.links.next);
        setPrev(res.data.data.links.prev);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [categories, status, search, isFetching, page]);

  // Debounce the fetchAdmins function
  const debouncedFetchAdmins = useCallback(
    _.debounce(fetchAdmins, 500), // 500ms delay
    [fetchAdmins]
  );

  useEffect(() => {
    debouncedFetchAdmins();
    // Clean up the debounced function on unmount
    return debouncedFetchAdmins.cancel;
  }, [debouncedFetchAdmins]);

  const buildUrl = () => {
    const baseUrl = `/admins`;
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page);
    }
    if (categories) {
      params.append(`category[0]`, categories);
    }

    if (status) {
      if (status === "Active") {
        params.append("status", "1");
      } else {
        params.append("status", "0");
      }
    }

    if (search) {
      params.append("search", search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    admins,
    error,
    isLoading,
    setAdmins,
    setError,
    meta,
    setMeta,
    next,
    prev,
  };
};

export default useAdmins;
