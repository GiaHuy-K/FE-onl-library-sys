/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios";

export const accountService = {
  // 1. Lấy danh sách tài khoản theo loại (STUDENT, LECTURER, STAFF)
  getAccounts: async (type: "STUDENT" | "LECTURER" | "STAFF") => {
    try {
      const res = await api.get("/account", { params: { type } });
      return res.data;
    } catch (error: any) {
      toast.error(`Không thể lấy danh sách ${type}`);
      throw error;
    }
  },

  // 2. Lấy chi tiết một tài khoản bằng mã code
  getAccountByCode: async (code: string, type: string) => {
    try {
      const res = await api.get(`/account/${code}`, { params: { type } });
      return res.data;
    } catch (error: any) {
      toast.error("Không thể lấy thông tin chi tiết tài khoản");
      throw error;
    }
  },

  // 3. Import tài khoản hàng loạt từ file Excel
  importAccounts: async (type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/account", formData, {
        params: { type },
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.status === "ERROR") {
        toast.error(res.data.message || "Dữ liệu không hợp lệ!");
        return res.data;
      }

      toast.success(`Import danh sách ${type} thành công!`);
      return res.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi tải lên tệp tin";
      toast.error(msg);
      throw error;
    }
  },

  // 4. Đổi trạng thái tài khoản (Active/Inactive)
  // Dùng JSON.stringify và ép header để tránh lỗi 415
  changeStatus: async (code: string, type: string, status: string) => {
    try {
      const res = await api.put(`/account/${code}/change-status`, JSON.stringify(status), {
        params: { type },
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Cập nhật trạng thái thành công");
      return res.data;
    } catch (error: any) {
      toast.error("Thao tác thất bại");
      throw error;
    }
  },

  // 5. Bước 1: Yêu cầu đổi mật khẩu (Xác thực mật khẩu cũ để BE gửi mã về Email)
  requestChangePassword: async (currentPassword: string) => {
    try {
      const res = await api.post("/account/change-password/request", {
        password: currentPassword,
      });
      toast.success("Xác thực thành công! Vui lòng kiểm tra email.");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Mật khẩu hiện tại không đúng");
      throw error;
    }
  },

  // 6. Bước 2: Thực hiện đổi mật khẩu mới (Sau khi đã có quyền từ bước 1)
  confirmChangePassword: async (newPass: string, confirmPass: string) => {
    try {
      const res = await api.put("/account/change-password", {
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      toast.success("Đổi mật khẩu thành công!");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cập nhật mật khẩu thất bại");
      throw error;
    }
  },

  // 7. Lấy thông tin tài khoản của chính mình (Dành cho Profile Admin)
  getMyInfo: async () => {
    try {
      const res = await api.get("/account/my-info");
      return res.data;
    } catch (error: any) {
      console.error("Không thể lấy thông tin cá nhân");
      throw error;
    }
  },
};