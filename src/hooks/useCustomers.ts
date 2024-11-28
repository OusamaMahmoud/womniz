import { useCallback, useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Customer } from "../services/customer-service";
import _ from "lodash";
import {
  Meta,
  Pagination,
} from "../components/reuse-components/pagination/CustomPagination";

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
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [links, setLinks] = useState<Pagination>({} as Pagination);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get<{
      data: {
        data: Customer[];
        meta: Meta;
        links: Pagination;
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setMeta(res.data.data.meta);
        setLinks(res.data.data.links);
        setCustomers(res.data.data.data);
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
  const debouncedFetchCustomers = useCallback(
    _.debounce(fetchCustomers, 500), // 500ms delayx
    [fetchCustomers]
  );

  useEffect(() => {
    debouncedFetchCustomers();
    // Clean up the debounced function on unmount
    return debouncedFetchCustomers.cancel;
  }, [debouncedFetchCustomers]);

  const buildUrl = () => {
    const baseUrl = `/users`;

    // If search is provided, return only the search parameter
    if (search) {
      return `${baseUrl}?search=${encodeURIComponent(search)}`;
    }

    // Otherwise, build the URL with other parameters
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page);
    }
    if (categories) {
      params.append(`category[0]`, categories);
    }
    if (status) {
      params.append("status", status === "Active" ? "1" : "0");
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
    links,
  };
};

export default useCustomers;
