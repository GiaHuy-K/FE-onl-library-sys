import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


// 1. Định nghĩa kiểu dữ liệu User theo 5 Actor của hệ thống
interface User {
  fullName: string;
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

// 2. Khai báo và EXPORT Context để file useAuth.ts có thể sử dụng
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

      if (token && savedRole && savedFullName) {
        setUser({
          role: savedRole,
          fullName: savedFullName,
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
    localStorage.setItem("userFullname", userData.fullName);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Hàm Logout: Xóa sạch dấu vết và đẩy về trang Login
  const logout = () => {
    localStorage.clear(); // Xóa hết token, role, fullname
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