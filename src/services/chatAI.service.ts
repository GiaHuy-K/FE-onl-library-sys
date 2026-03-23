/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../config/axios";

export const chatService = {

  sendPrompt: async (conversationId: string, prompt: string) => {
    try {

      const res = await api.post("/rag/prompt", {
        conversationId,
        prompt,
      });
      return res.data; 
    } catch (error: any) {
      console.error("!!! [RAG Error]:", error.response?.data || error.message);
      throw error;
    }
  },

  // Khởi tạo session mới (nếu cần)
  initRAG: async () => {
    try {
      const res = await api.post("/rag");
      return res.data; 
    } catch (error: any) {
      console.error("!!! [Init RAG Error]:", error);
      throw error;
    }
  },
};