/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth & Context
import { AuthProvider } from "./config/Authcontext";
import { CartProvider } from "./components/context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute"; 

// Layouts & Pages
import AdminLayout from "./components/layouts/AdminLayout/AdminLayout";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import Unauthorized from "./pages/error/Unauthorized";
import AccountManager from "./pages/Admin/AccountManager"; 
import ResetPasswordPage from "./pages/auth/ResetPassword"; 
import ProfilePage from "./pages/users/Profile";
import OverviewPage from "./pages/Admin/Overview/index";
import ChangePasswordPage from "./pages/users/ChangePasswordPage";
import StaffLayout from "./components/layouts/StaffLayout/StaffLayout";
import MasterDataPage from "./pages/Staff/MasterDataPage";
import BookManagement from "./pages/Staff/BookManagement";
import ChatAIWidget from "./components/ChatAIWidget/ChatAIWidget";
import MyTickets from "./pages/users/MyTickets";
import TicketManager from "./pages/Staff/TicketManager";
import ActiveLoans from "./pages/Staff/ActiveLoans";
import StaffOverview from "./pages/Staff/Overview/Overview";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ExplorePage from "./pages/Explore/ExplorePage";

const router = createBrowserRouter([
  // --- Public Routes  ---
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/explore", element: <ExplorePage /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  // --- Common Authenticated Routes ---
  {
    element: <ProtectedRoute allowedRoles={["ADMIN", "STAFF", "STUDENT", "LECTURER"]} />,
    children: [
      { path: "/change-password", element: <ChangePasswordPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/my-tickets", element: <MyTickets /> },
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
        element: <StaffLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: <StaffOverview /> },
          { path: "master-data", element: <MasterDataPage /> },
          { path: "manage-books", element: <BookManagement /> },
          { path: "active-loans", element: <ActiveLoans /> },
          { path: "ticket-requests", element: <TicketManager /> },
        ],
      },
    ],
  },

  // Bẫy lỗi 404
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <ChatAIWidget />
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  );
}