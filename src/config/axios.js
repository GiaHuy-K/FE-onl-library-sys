import axios from "axios";

const api = axios.create({
  baseURL: "http://api.awsread.id.vn/api/",
});

// Chỉ cần giữ lại cái này để tự động đính Token khi gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;