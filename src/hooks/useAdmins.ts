import { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import apiClient, { CanceledError } from "../services/api-client";
import { Admin } from "../services/admins-service";
import {
  Pagination,
  Meta,
} from "../components/reuse-components/pagination/CustomPagination";

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
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [error, setError] = useState("");
  const [links, setLinks] = useState<Pagination>({} as Pagination);
  const [isLoading, setLoading] = useState(false);

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get<{
      data: {
        data: Admin[];
        meta: Meta;
        links: Pagination;
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setMeta(res.data.data.meta);
        setAdmins(res.data.data.data);
        setLinks(res.data.data.links);
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
    admins,
    error,
    isLoading,
    setAdmins,
    setError,
    meta,
    setMeta,
    links,
    setLinks,
  };
};

export default useAdmins;
