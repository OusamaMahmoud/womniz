import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";
import { Admin } from "../services/admins-service";

interface AdminsFilter {
  categories: string[];
  status: string;
  search: string;
  isFetching: boolean;
}

const useAdmins = ({
  categories,
  status,
  search,
  isFetching,
}: AdminsFilter) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    console.log(buildUrl());
    const request = apiClient.get<{ data: { data: Admin[] } }>(buildUrl(), {
      signal: controller.signal,
    });
    request
      .then((res) => {
        setAdmins(res.data.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [categories, status, search, isFetching]);

  const buildUrl = () => {
    const baseUrl = `/admins`;
    const params = new URLSearchParams();

    categories.forEach((category, index) => {
      if (category) {
        params.append(`category[0]`, category);
      }
    });

    if (status) {
      if(status === 'Active'){
        params.append("status", '0');
      }else{
        params.append("status", '1');
      }
    }

    if (search) {
      params.append("search", search);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return { admins, error, isLoading, setAdmins, setError };
};

export default useAdmins;
