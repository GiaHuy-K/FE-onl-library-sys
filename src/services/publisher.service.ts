/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios";

export const publisherService = {
  // Lấy tất cả nhà xuất bản
  getAll: async () => {
    try {
      const res = await api.get("/publisher");
      return res.data;
    } catch (error: any) {
      toast.error("Không thể lấy danh sách nhà xuất bản");
      throw error;
    }
  },

  // Lấy chi tiết theo ID
  getById: async (id: number) => {
    try {
      const res = await api.get(`/publisher/${id}`);
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi lấy thông tin nhà xuất bản");
      throw error;
    }
  },

  // Tạo mới
  create: async (data: { name: string; status: string }) => {
    try {
      const res = await api.post("/publisher", data);
      toast.success("Thêm nhà xuất bản thành công!");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo mới");
      throw error;
    }
  },

  // Cập nhật
  update: async (id: number, data: { name: string; status: string }) => {
    try {
      const res = await api.put(`/publisher/${id}`, data);
      toast.success("Cập nhật thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Cập nhật thất bại");
      throw error;
    }
  },

  // Xóa
  delete: async (id: number) => {
    try {
      await api.delete(`/publisher/${id}`);
      toast.success("Đã xóa nhà xuất bản");
    } catch (error: any) {
      toast.error("Xóa thất bại");
      throw error;
    }
  },

  // Import CSV
  importExcel: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/publisher/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Import danh sách thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi import file");
      throw error;
    }
  },
};