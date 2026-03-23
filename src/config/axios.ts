import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://api.awsread.id.vn/api/v1",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.removeItem("token"); 
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;