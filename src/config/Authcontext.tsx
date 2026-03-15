import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// 1. Định nghĩa kiểu dữ liệu User
interface User {
  id?: string; // Thêm id từ trường 'sub' trong token
  fullName?: string; // Thêm dấu '?' để không bắt buộc phải có tên
  role: 'ADMIN' | 'STAFF' | 'STUDENT' | 'LECTURER' | string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// 2. Khai báo Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Kiểm tra trạng thái đăng nhập khi load lại trang (F5)
  useEffect(() => {
    const checkLocalAuth = () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("userRole");
      const savedFullName = localStorage.getItem("userFullname");
      const savedId = localStorage.getItem("userId");

      // Chỉ cần có token và role là đủ để duy trì phiên đăng nhập
      if (token && savedRole) {
        setUser({
          id: savedId || "",
          role: savedRole,
          fullName: savedFullName || "",
        });
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkLocalAuth();
  }, []);

  // Hàm Login: Lưu data vào localStorage và cập nhật State
  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userFullname", userData.fullName || "");
    localStorage.setItem("userId", userData.id || "");
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Hàm Logout: Xóa sạch dấu vết và đẩy về trang Login
  const logout = () => {
    localStorage.clear(); 
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {!isLoading ? (
        children
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          color: '#FF6E61',
          fontWeight: 700,
          backgroundColor: '#f8f9fa'
        }}>
          ĐANG KHỞI TẠO LIB-SYS...
        </div>
      )}
    </AuthContext.Provider>
  );
};