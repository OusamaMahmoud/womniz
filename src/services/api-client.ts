import axios, { CanceledError } from "axios";

const apiClient = axios.create({
  baseURL: "https://admin.womniz.com/api/v1/dashboard",
});

export { CanceledError };

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("womnizAuthToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isRedirecting && !window.location.pathname.includes("/login")) {
        isRedirecting = true;
        localStorage.removeItem("womnizAuth");
        localStorage.removeItem("womnizAuthToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
