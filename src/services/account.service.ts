/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios";

export const accountService = {
  // 1. Lấy danh sách tài khoản
  getAccounts: async (type: "STUDENT" | "LECTURER" | "STAFF") => {
    try {
      console.log(`>>> [Get Accounts Request] Type: ${type}`);
      const res = await api.get("/account", { params: { type } });
      console.log(`<<< [Get Accounts Success] Count:`, res.data?.length || 0);
      return res.data;
    } catch (error: any) {
      console.error("!!! [Get Accounts Error]:", error.response?.data || error.message);
      toast.error(`Không thể lấy danh sách ${type}`);
      throw error;
    }
  },

  // 2. Lấy chi tiết tài khoản
  getAccountByCode: async (code: string, type: string) => {
    try {
      console.log(`>>> [Get Details] Code: ${code}, Type: ${type}`);
      const res = await api.get(`/account/${code}`, { params: { type } });
      console.log(`<<< [Get Details Success]:`, res.data);
      return res.data;
    } catch (error: any) {
      console.error("!!! [Get Details Error]:", error.response?.data || error.message);
      toast.error("Không thể lấy thông tin chi tiết");
      throw error;
    }
  },

  // 3. Import tài khoản hàng loạt
  importAccounts: async (type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/account", formData, {
        params: { type },
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("<<< [FULL IMPORT RESPONSE]:", res.data);

      const hasError = res.data?.error && res.data.error.length > 0;
      const hasSuccess = res.data?.response && res.data.response.length > 0;

      // TH1: Có lỗi nhưng vẫn có một vài dòng thành công (Partial Success)
      if (hasError && hasSuccess) {
        toast.warning(`Import một phần: ${res.data.response.length} thành công, ${res.data.error.length} lỗi.`);
        console.table(res.data.error); 
        return res.data;
      }

      // TH2: Toàn bộ đều lỗi
      if (hasError && !hasSuccess) {
        toast.error(`Import thất bại! Có ${res.data.error.length} lỗi xảy ra.`);
        return res.data;
      }

      // TH3: Thành công hoàn toàn
      toast.success(`Import danh sách ${type} thành công!`);
      return res.data;

    } catch (error: any) {
      console.error("!!! [IMPORT FATAL ERROR]:", error.response?.data || error);
      toast.error("Lỗi hệ thống khi tải tệp tin");
      throw error;
    }
  },

  // 4. Đổi trạng thái (Active/Inactive)
  changeStatus: async (code: string, type: string, status: string) => {
    try {
      console.log(`>>> [Change Status] Code: ${code}, Type: ${type}, Target: ${status}`);
      const res = await api.put(`/account/${code}/change-status`, JSON.stringify(status), {
        params: { type },
        headers: { "Content-Type": "application/json" },
      });
      console.log("<<< [Change Status Success]:", res.data);
      toast.success("Cập nhật trạng thái thành công");
      return res.data;
    } catch (error: any) {
      console.error("!!! [Change Status Error]:", error.response?.data || error.message);
      toast.error("Thao tác thất bại");
      throw error;
    }
  },

  // 5. Yêu cầu đổi mật khẩu (Bước 1)
 requestChangePassword: async (currentPassword: string) => {
    try {
      console.log(">>> [Phase 1] Validating old password...");
      const res = await api.post("/account/change-password/request", {
        password: currentPassword,
      });
      console.log("<<< [Phase 1 Response]:", res.data);
      return res.data; 
    } catch (error: any) {
      console.error("!!! [Phase 1 Error]:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Mật khẩu hiện tại không đúng");
      throw error;
    }
  },

// 6. Xác nhận đổi mật khẩu (Bước 2)
  confirmChangePassword: async (verifyToken: string, newPass: string, confirmPass: string) => {
    try {
      const loginToken = localStorage.getItem("token");

      const res = await api.put(
        "/account/change-password",
        {
          newPassword: newPass,
          confirmPassword: confirmPass,
        },
        {
          headers: {
            "Authorization": `Bearer ${loginToken}`,
            "Access-Token": verifyToken.trim() 
          }
        }
      );
      return res.data;
    } catch (error: any) {
      console.error("!!! [Phase 2 Error]:", error.response?.data || error.message);
      throw error;
    }
  },

  // 7. Lấy thông tin cá nhân
  getMyInfo: async () => {
    try {
      console.log(">>> [Get My Info]");
      const res = await api.get("/account/my-info");
      console.log("<<< [Get My Info Success]:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("!!! [Get My Info Error]:", error.response?.data || error.message);
      throw error;
    }
  },
};