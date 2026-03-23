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
      const message = error.response?.data?.message || "Đăng nhập thất bại!";
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

// 3. Gửi yêu cầu đặt lại mật khẩu 
requestResetPassword: async (input: string) => {
  try {
    const res = await api.post("/auth/reset-password/request", { input });
    console.log(">>> Request Reset Password Success");
    return res.data;
  } catch (error: any) {
    console.error(">>> Request Reset Error:", error.response?.data);
    throw error;
  }
},

// 4. Thực hiện đặt lại mật khẩu mới 
resetPassword: async (resetToken: string, payload: any) => {
  try {
    const res = await api.put("/auth/reset-password", payload, {
      params: { resetToken } 
    });
    return res.data;
  } catch (error: any) {
    console.error(">>> Reset Password Error:", error.response?.data);
    throw error;
  }
},
};