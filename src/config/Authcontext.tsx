import React, { createContext, useState, useContext, useEffect,  } from "react";
import { ReactNode } from "react";
// 1. Định nghĩa kiểu dữ liệu User theo 5 Actor
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

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Kiểm tra trạng thái đăng nhập khi vừa load web (F5)
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

  // Hàm Login: Nhận data từ LoginPage và lưu vào máy
  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userFullname", userData.fullName);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Hàm Logout: Xóa data và chuyển về trang Login
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {!isLoading ? children : (
        <div style={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          height: '100vh', color: '#FF6E61', fontWeight: 700 
        }}>
          ĐANG KHỞI TẠO LIB-SYS...
        </div>
      )}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};