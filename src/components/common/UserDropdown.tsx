/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  SettingOutlined,
  DashboardOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Space, message, } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/useAuth";



const UserDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const getRoleLabel = (role?: string) => {
    const roles: Record<string, string> = {
      ADMIN: "Quản trị viên",
      STUDENT: "Sinh viên",
      LECTURER: "Giảng viên",
      STAFF: "Nhân viên",
    };
    return role ? roles[role] : "Người dùng";
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "logout":
        logout();
        message.success("Đã đăng xuất thành công");
        navigate("/login");
        break;
      case "changePassword":
        navigate("/change-password");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "dashboard":
        // Điều hướng dựa trên Role
        if (user?.role === "ADMIN") navigate("/dashboard/overview");
        else if (user?.role === "STAFF") navigate("/staff");
        break;
      case "my-tickets":
        navigate("/my-tickets");
        break;
      default:
        break;
    }
  };

  // Hàm tạo menu động dựa trên Role
  const getDynamicItems = (): MenuProps["items"] => {
    const baseItems: MenuProps["items"] = [];

    // 1. Thêm mục Dashboard cho ADMIN và STAFF
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      baseItems.push({
        key: "dashboard",
        label: "Bảng điều khiển",
        icon: <DashboardOutlined />,
      });
    }

    // 2. Thêm mục Mượn sách cho STUDENT và LECTURER
    if (user?.role === "STUDENT" || user?.role === "LECTURER") {
      baseItems.push({
        key: "my-tickets",
        label: "Phiếu mượn của tôi",
        icon: <BookOutlined />,
      });
    }

    // 3. Các mục chung
    baseItems.push(
      {
        key: "profile",
        label: "Thông tin cá nhân",
        icon: <SettingOutlined />,
      },
      {
        key: "changePassword",
        label: "Đổi mật khẩu",
        icon: <KeyOutlined />,
      },
      { type: "divider" },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        danger: true,
      },
    );

    return baseItems;
  };

  return (
    <Dropdown
      menu={{ items: getDynamicItems(), onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Space
        className="user-dropdown-trigger"
        style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "6px" }}
      >
        <Avatar
          style={{ backgroundColor: "#1890ff" }}
          icon={<UserOutlined />}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "1.2",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: "14px" }}>
            {user ? getRoleLabel(user.role) : "Đang tải..."}
          </span>
        </div>
      </Space>
    </Dropdown>
  );
};

export default UserDropdown;
