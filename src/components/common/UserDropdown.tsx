import React from "react";
import {
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Space, message, Typography } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/useAuth";

const { Text } = Typography;

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
      case "changePassword": // Đã chỉnh: Khớp với key ở menuItems bên dưới
        navigate("/change-password");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: '4px 8px' }}>
          <Text strong>{user?.email?.split('@')[0].toUpperCase() || "ADMIN"}</Text>
          <Text type="secondary">{getRoleLabel(user?.role)}</Text>
        </div>
      ),
      disabled: true, // Chỉ hiển thị thông tin, không cho click
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <SettingOutlined />,
    },
    {
      key: "changePassword", // Đã chỉnh: Khớp với logic switch case
      label: "Đổi mật khẩu",
      icon: <KeyOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Space className="user-dropdown-trigger" style={{ cursor: "pointer", padding: '4px 8px', borderRadius: '6px' }}>
        <Avatar
          style={{ backgroundColor: "#1890ff" }}
          icon={<UserOutlined />}
        />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
           <span style={{ fontWeight: 500, fontSize: '14px' }}>
             {user ? getRoleLabel(user.role) : "Đang tải..."}
           </span>
        </div>
      </Space>
    </Dropdown>
  );
};

export default UserDropdown;