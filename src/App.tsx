import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth & Context
import { AuthProvider } from "../src/config/Authcontext";


// Layouts
// import AdminLayout from "./components/layouts/adminLayout";
// import StaffLayout from "./components/layouts/staffLayout"; 

// Pages 
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import Unauthorized from "./pages/error/Unauthorized";
// ... Import các trang quản lý sách, sinh viên ở đây

// --- CÁC BỘ LỌC BẢO VỆ ROUTE ---

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   if (isLoading) return null;
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };


// --- CẤU HÌNH ROUTER ---

const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  // { path: "/forgot-password", element: <div>Trang quên mật khẩu</div> },

  // Dashboard của STAFF (Nhân viên thư viện - Quản lý sách/mượn trả)
  

  // Dashboard của ADMIN (Quản trị viên - Quản lý tài khoản/hệ thống)
  

  // Trang cá nhân (Dùng chung cho Student/Lecturer/Staff/Admin)
  
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}