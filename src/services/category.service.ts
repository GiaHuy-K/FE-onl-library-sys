
import { toast } from "react-toastify";
import api from "../config/axios";

export const categoryService = {
  getAll: async () => {
    const res = await api.get("/category");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/category/${id}`);
    return res.data;
  },

  create: async (data: { name: string; status: string }) => {
    const res = await api.post("/category", data);
    toast.success("Thêm thể loại thành công");
    return res.data;
  },

  update: async (id: number, data: { name: string; status: string }) => {
    const res = await api.put(`/category/${id}`, data);
    toast.success("Cập nhật thành công");
    return res.data;
  },

  delete: async (id: number) => {
    await api.delete(`/category/${id}`);
    toast.success("Đã xóa thể loại");
  },

  importExcel: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/category/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Import thành công");
    return res.data;
  }
};