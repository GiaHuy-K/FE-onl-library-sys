import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../config/useAuth";
import { toast } from "react-toastify"; 

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null; 

  // 1. Chưa đăng nhập
  if (!isAuthenticated) {
    // Hiện thông báo trước khi chuyển trang
    toast.error("Vui lòng đăng nhập để tiếp tục!"); 
    return <Navigate to="/login" replace />;
  }

  // 2. Sai quyền
  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    toast.warning("Bạn không có quyền truy cập vào khu vực này!");
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. OK thì cho vào
  return <Outlet />;
};

export default ProtectedRoute;