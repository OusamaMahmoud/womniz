import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Customer } from "../services/customer-service";

interface MetaObject {
  current_page: number;
  from: number;
  per_page: number;
  to: number;
}
interface CustomersFilter {
  categories: string;
  status: string;
  search: string;
  isFetching: boolean;
  page: string;
}

const useCustomers = ({
  categories,
  status,
  search,
  isFetching,
  page,
}: CustomersFilter) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
        data: Customer[];
        meta: MetaObject;
        links: { next: string | null; prev: string | null };
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setMeta(res.data.data.meta);
        setCustomers(res.data.data.data);
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
    const baseUrl = `/users`;
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
    customers,
    error,
    isLoading,
    setCustomers,
    setError,
    meta,
    setMeta,
    next,
    prev,
  };
};

export default useCustomers;
