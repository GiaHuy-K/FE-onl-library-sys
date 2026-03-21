/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios";

export const authorService = {
  // Lấy tất cả tác giả
  getAll: async () => {
    try {
      const res = await api.get("/author");
      return res.data; 
    } catch (error: any) {
      toast.error("Không thể lấy danh sách tác giả");
      throw error;
    }
  },

  // Lấy chi tiết tác giả
  getById: async (id: number) => {
    try {
      const res = await api.get(`/author/${id}`);
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi lấy thông tin tác giả");
      throw error;
    }
  },

  // Tạo mới tác giả
  create: async (data: { name: string; biography?: string; status: string }) => {
    try {
      const res = await api.post("/author", data);
      toast.success("Thêm tác giả thành công!");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm tác giả");
      throw error;
    }
  },

  // Cập nhật thông tin
  update: async (id: number, data: { name: string; biography?: string; status: string }) => {
    try {
      const res = await api.put(`/author/${id}`, data);
      toast.success("Cập nhật tác giả thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Cập nhật thất bại");
      throw error;
    }
  },

  // Xóa tác giả
  delete: async (id: number) => {
    try {
      await api.delete(`/author/${id}`);
      toast.success("Đã xóa tác giả");
    } catch (error: any) {
      toast.error("Xóa thất bại (Có thể tác giả đang có sách trong hệ thống)");
      throw error;
    }
  },

  // Import danh sách tác giả từ Excel
  importExcel: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/author/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Import danh sách tác giả thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi import file tác giả");
      throw error;
    }
  },
};