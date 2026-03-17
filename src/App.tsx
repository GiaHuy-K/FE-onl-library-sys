import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth & Context
import { AuthProvider } from "./config/Authcontext";
import ProtectedRoute from "./routes/ProtectedRoute"; 

// Layouts & Pages
import AdminLayout from "./components/layouts/AdminLayout/AdminLayout";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import Unauthorized from "./pages/error/Unauthorized";
import AccountManager from "./pages/Admin/AccountManager"; 
// import ResetPasswordPage from "./pages/auth/ResetPassword";       chưa dùng đến nên tạm ẩn
import ProfilePage from "./pages/users/Profile";
import OverviewPage from "./pages/Admin/Overview/index";
import ChangePasswordPage from "./pages/users/ChangePasswordPage";

const router = createBrowserRouter([
  // --- Public Routes  ---
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // --- Common Authenticated Routes ---
  {
    element: <ProtectedRoute allowedRoles={["ADMIN", "STAFF", "STUDENT", "LECTURER"]} />,
    children: [
      { path: "/change-password", element: <ChangePasswordPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ],
  },

  // --- Dashboard của ADMIN ---
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />, 
    children: [
      {
        path: "/dashboard",
        element: <AdminLayout />,
        children: [
          { path: "overview", element: <OverviewPage /> },
          { path: "STUDENT", element: <AccountManager /> },
          { path: "LECTURER", element: <AccountManager /> },
          { path: "STAFF", element: <AccountManager /> },
        ],
      },
    ],
  },

  // --- Dashboard cho STAFF ---
  {
    element: <ProtectedRoute allowedRoles={["STAFF"]} />,
    children: [
      {
        path: "/staff",
        element: <div>Trang của Staff</div>,
      },
    ],
  },

  // Bẫy lỗi 404
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}