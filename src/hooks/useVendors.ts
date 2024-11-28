import { useCallback, useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import _ from "lodash";
import { Vendor } from "../services/vendors-service";
import {
  Pagination,
  Meta,
} from "../components/reuse-components/pagination/CustomPagination";

interface AdminsFilter {
  categories?: string;
  status?: string;
  search?: string;
  isFetching?: boolean;
  page?: string;
}

const useVendors = ({
  categories,
  status,
  search,
  isFetching,
  page,
}: AdminsFilter) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [meta, setMeta] = useState<Meta>({} as Meta);
  const [links, setLinks] = useState<Pagination>({} as Pagination);

  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const fetchVendors = useCallback(() => {
    setLoading(true);
    const controller = new AbortController();
    const request = apiClient.get<{
      data: {
        data: Vendor[];
        meta: Meta;
        links: Pagination;
      };
    }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setMeta(res.data.data.meta);
        setVendors(res.data.data.data);
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
  const debouncedFetchVendors = useCallback(
    _.debounce(fetchVendors, 500), // 500ms delayx
    [fetchVendors]
  );

  useEffect(() => {
    debouncedFetchVendors();
    // Clean up the debounced function on unmount
    return debouncedFetchVendors.cancel;
  }, [debouncedFetchVendors]);

  const buildUrl = () => {
    const baseUrl = `/vendors`;

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
    vendors,
    error,
    isLoading,
    setVendors,
    setError,
    meta,
    setMeta,
    links,
  };
};

export default useVendors;
