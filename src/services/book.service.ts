/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import api from "../config/axios";

export const bookService = {
  // --- 1. QUẢN LÝ SÁCH (CRUD) ---
  // 1. Lấy danh sách tất cả sách
  getAllBooks: async () => {
    try {
      const res = await api.get("/book");
      return res.data;
    } catch (error: any) {
      toast.error("Không thể tải danh sách sách");
      throw error;
    }
  },
  // 2. Lấy chi tiết sách theo ID
  getBookById: async (id: number | string) => {
    try {
      const res = await api.get(`/book/${id}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.warning("Cuốn sách này không còn tồn tại.");
      } else {
        toast.error("Không thể lấy thông tin chi tiết sách.");
      }
      throw error;
    }
  },
  // 3. Tạo mới sách (với hỗ trợ upload ảnh bìa)
  createBook: async (values: any, imageFile?: File) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(values)], { type: "application/json" });
      formData.append("data", jsonBlob);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await api.post("/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Thêm sách mới thành công!");
      return res.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Lỗi khi tạo sách";
      toast.error(message);
      throw error;
    }
  },
  // 4. Cập nhật thông tin sách 
  updateBook: async (id: number | string, payload: any) => {
    try {
      const res = await api.put(`/book/${id}`, payload);
      toast.success("Cập nhật thông tin thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật sách");
      throw error;
    }
  },
  // 5. Xóa sách
  deleteBook: async (id: number | string) => {
    try {
      const res = await api.delete(`/book/${id}`);
      toast.success("Đã xóa sách");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi xóa sách");
      throw error;
    }
  },

  // --- 2. TRA CỨU & IMPORT ---
  // 6. Tìm kiếm sách theo từ khóa 
  searchBooks: async (keyword: string) => {
    const res = await api.get(`/book/search`, {
      params: { keyword }
    });
    return res.data;
  },
  // 7. Lấy sách theo ISBN 
  getBookByISBN: async (isbn: string) => {
    try {
      const res = await api.get(`/book/isbn/${isbn}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.info(`Không tìm thấy ISBN: ${isbn}`);
        return null;
      }
      throw error;
    }
  },
  // 8. Cập nhật ảnh bìa sách
  uploadBookCover: async (id: number | string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post(`/book/${id}/cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật ảnh bìa thành công!");
      return res.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi upload ảnh");
      throw error;
    }
  },
  // 9. Import sách từ file CSV
  importBooks: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/book/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Import thành công!");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi import file CSV");
      throw error;
    }
  },

  // --- 3. NGHIỆP VỤ MƯỢN TRẢ (BORROWING) ---

  // 10. User yêu cầu mượn sách

borrowBook: async (bookIds: number[], borrowDate: string) => {
  
  const payload = {
    bookIds: bookIds.map(id => Number(id)),
    borrowDate: borrowDate || new Date().toISOString().split('T')[0]
  };

  console.log(">>> Debug Borrow Payload (Swagger Match):", payload);

  try {
    const res = await api.post("/book/borrow", payload);
    toast.success(`Gửi yêu cầu thành công! Nhân viên sẽ duyệt và liên hệ bạn sớm.`);
    return res.data;
  } catch (error: any) {
    console.error(">>> Borrow Error Detail:", error.response?.data);
    const serverMsg = error.response?.data?.message || "Lỗi khi mượn sách bạn ơi!";
    toast.error(serverMsg);
    throw error;
  }
},

  // 11. Lấy phiếu mượn cá nhân (User)
 getMyTickets: async () => {
  try {
    const res = await api.get("/book/borrow/my-tickets"); 
    return res.data;
  } catch (error: any) {
    console.error(">>> Get My Tickets Error:", error.response?.data || error.message);
    throw error;
  }
},

  // 12. Lấy tất cả phiếu mượn (Staff)
  getAllTickets: async () => {
    try {
      const res = await api.get("/book/borrow/tickets");
      return res.data;
    } catch (error: any) {
      console.error(">>> Get All Tickets Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // 13. Staff duyệt yêu cầu mượn (Process)
  processBorrowRequest: async (payload: any) => {
    try {
      const res = await api.put("/book/borrow/process", payload);
      toast.success("Đã xử lý yêu cầu mượn");
      return res.data;
    } catch (error: any) {
      console.error(">>> Process Borrow Request Error:", error.response?.data || error.message);
      toast.error("Lỗi khi duyệt phiếu mượn");
      throw error;
    }
  },

  // 14. Checkout (Thực xuất sách cho user)
  checkoutBook: async (ticketId: number | string) => {
    try {
      const res = await api.put(`/book/borrow/${ticketId}/checkout`);
      toast.success("Sách đã được xuất kho!");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi checkout");
      throw error;
    }
  },

  // 15. Trả sách (Return)
  returnBook: async (ticketId: number | string) => {
    try {
      const res = await api.put(`/book/borrow/${ticketId}/return`);
      toast.success("Xác nhận trả sách thành công");
      return res.data;
    } catch (error: any) {
      toast.error("Lỗi khi xác nhận trả sách");
      throw error;
    }
  },
  // 16. Hủy yêu cầu mượn (Cancel)
cancelBorrowRequest: async (record: any, reason: string) => {
  try {
    const tId = record.ticketId; 
    const payload = {
      ...record,
      note: reason,     
    };
    console.log(">>> Sending Cancel Payload:", payload);
    const res = await api.put(`/book/borrow/${tId}/cancel`, payload);
    toast.success("Đã hủy đơn và hoàn sách về kho!");
    return res.data;
  } catch (error: any) {
    console.error(">>> Cancel Borrow Request Error:", error.response?.data || error.message);
    const serverMsg = error.response?.data?.message || "Lỗi hệ thống khi hủy đơn";
    toast.error(serverMsg);
    throw error;
  }
},
};