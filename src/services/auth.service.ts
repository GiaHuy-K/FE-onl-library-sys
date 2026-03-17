/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios"; 

export const authService = {
  // 1. Đăng nhập
  login: async (payload: any) => {
    try {
      const res = await api.post("/auth/login", payload);
      
      return res.data; 
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      toast.error(message);
      throw error; 
    }
  },

  // 2. Đăng xuất
  logout: async () => {
    try {
      const res = await api.post("/auth/logout");
      toast.success("Đã đăng xuất");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi đăng xuất");
      throw error;
    }
  },

  // 3. Yêu cầu Reset Password (Gửi mail)
  requestResetPassword: async (input: string) => {
    try {
      const res = await api.post("/auth/reset-password/request", { input });
      toast.success("Yêu cầu đã được gửi! Vui lòng kiểm tra email.");
      return res.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể gửi yêu cầu đặt lại mật khẩu";
      toast.error(message);
      throw error;
    }
  },

  // 4. Đặt lại mật khẩu mới
  resetPassword: async (resetToken: string, payload: any) => {
    try {
      const res = await api.put(`/auth/reset-password?resetToken=${resetToken}`, payload);
      toast.success("Đặt lại mật khẩu thành công!");
      return res.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Mã xác thực không hợp lệ hoặc đã hết hạn";
      toast.error(message);
      throw error;
    }
  },

  
};