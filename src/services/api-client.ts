import axios, { CanceledError } from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const apiClient = axios.create({
  baseURL: "https://admin.womniz.com/api/v1/dashboard",
});

export { CanceledError };

// Request interceptor to add the token to each request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Adjust based on your storage method
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      // Optionally remove the token and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
