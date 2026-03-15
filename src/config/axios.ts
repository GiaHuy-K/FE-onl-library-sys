import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Tạo instance với kiểu dữ liệu AxiosInstance tự động
const api = axios.create({
  baseURL: "https://api.awsread.id.vn/api/v1",
});

/**
 * Bộ chặn (Interceptor) cho Request
 * Tự động đính kèm Token vào Header của mỗi yêu cầu
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    
    // Kiểm tra nếu có token và config.headers tồn tại
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Xử lý lỗi khi gửi request
    return Promise.reject(error);
  }
);

/**
 * (Tùy chọn)  có thể thêm bộ chặn cho Response để xử lý lỗi 401 (hết hạn token) toàn cục
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ví dụ: Nếu token hết hạn thì đá ra trang login luôn
      // localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;