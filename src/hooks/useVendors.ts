import { useEffect, useState } from "react";
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

const useVendors = ({
  categories,
  status,
  search,
  isFetching,
  page,
}: AdminsFilter) => {
  const [vendors, setVendors] = useState<Admin[]>([]);
  const [meta, setMeta] = useState<MetaObject>({} as MetaObject);
  const [next, setNext] = useState<string | null>("");
  const [prev, setPrev] = useState<string | null>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
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
        setVendors(res.data.data.data);
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

  const buildUrl = () => {
    const baseUrl = `/vendors`;
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page);
    }
    if (categories) {
      params.append(`category[0]`, categories);
    }

    if (status) {
      if (status === "Active") {
        params.append("status", "0");
      } else {
        params.append("status", "1");
      }
    }

    if (search) {
      params.append("search", search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return {
    vendors,
    error,
    isLoading,
    setVendors,
    setError,
    meta,
    setMeta,
    next,
    prev,
  };
};

export default useVendors;
