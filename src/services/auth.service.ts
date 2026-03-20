/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios"; 

export const authService = {
  // 1. Đăng nhập
  login: async (payload: any) => {
    try {
      console.log(">>> [Login Request]:", payload); // Log input để xem gửi gì lên
      const res = await api.post("/auth/login", payload);
      console.log("<<< [Login Response Success]:", res.data); 
      return res.data; 
    } catch (error: any) {
      console.error("!!! [Login Error]:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Đăng nhập thất bại!";
      toast.error(message);
      throw error; 
    }
  },

  // 2. Đăng xuất
  logout: async () => {
    try {
      const res = await api.post("/auth/logout");
      console.log("<<< [Logout Success]");
      toast.success("Đã đăng xuất");
      return res.data;
    } catch (error: any) {
      console.error("!!! [Logout Error]:", error.response?.data || error.message);
      toast.error("Lỗi khi đăng xuất");
      throw error;
    }
  },

  // 3. Yêu cầu Reset Password
  requestResetPassword: async (input: string) => {
    try {
      console.log(">>> [Reset Request for]:", input);
      const res = await api.post("/auth/reset-password/request", { input });
      console.log("<<< [Reset Request Success]:", res.data);
      toast.success("Yêu cầu đã được gửi!");
      return res.data;
    } catch (error: any) {
      console.error("!!! [Reset Request Error]:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Lỗi gửi yêu cầu";
      toast.error(message);
      throw error;
    }
  },

  // 4. Đặt lại mật khẩu mới
  resetPassword: async (resetToken: string, payload: any) => {
    try {
      console.log(">>> [Confirm Reset] Token:", resetToken, "Payload:", payload);
      const res = await api.put(`/auth/reset-password?resetToken=${resetToken}`, payload);
      console.log("<<< [Confirm Reset Success]:", res.data);
      toast.success("Đặt lại mật khẩu thành công!");
      return res.data;
    } catch (error: any) {
      console.error("!!! [Confirm Reset Error]:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Lỗi đặt lại mật khẩu";
      toast.error(message);
      throw error;
    }
  },
};