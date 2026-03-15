import React, { useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  PieChartOutlined,
  HomeOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Avatar, Dropdown, Space, message } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../config/useAuth";

const { Header, Content, Footer, Sider } = Layout;

/**
 * Hàm hỗ trợ tạo cấu trúc Menu Item của Ant Design
 */
function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: any[], link = true) {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={`/dashboard/${key}`}>{label}</Link> : label,
  };
}

/**
 * Danh sách Menu cho Admin LIB-SYS
 * STUDENT, LECTURER, STAFF là 3 key con của "Quản lý tài khoản", sẽ dẫn đến 3 trang quản lý tương ứng
 */
const items = [
  getItem("Tổng quan", "overview", <PieChartOutlined />),
  getItem(
    "Quản lý tài khoản",
    "accounts",
    <SolutionOutlined />,
    [
      getItem("Sinh viên", "STUDENT", <TeamOutlined />),
      getItem("Giảng viên", "LECTURER", <MedicineBoxOutlined />),
      getItem("Nhân viên", "STAFF", <UserSwitchOutlined />),
    ],
    false // Header của sub-menu không click để chuyển trang được
  ),
  getItem("Về trang chủ", "home", <HomeOutlined />),
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Lấy token màu từ theme của Ant Design
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const { logout, user } = useAuth();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      logout();
      message.success("Đã đăng xuất thành công");
      navigate("/login");
    }  else if (key === "home") {
      navigate("/");
    }
  };

  // Menu thả xuống ở Avatar góc trên bên phải
  const userMenu = {
    items: [
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
    onClick: handleMenuClick,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div
          style={{
            height: 32,
            margin: "16px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
        >
          {collapsed ? "LIB" : "LIB-SYS ADMIN"}
        </div>
        <Menu
          theme="dark"
          // Tự động active menu dựa trên cái path cuối cùng của URL
          selectedKeys={[location.pathname.split("/").pop() || "overview"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            👋 Xin chào, <strong>Admin</strong>
          </div>

          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#1890ff" }}
                icon={<UserOutlined />}
              />
              <span style={{ fontWeight: 500 }}>{user?.role || "ADMIN"}</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: "24px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Đây là nơi nội dung của STUDENT, LECTURER... sẽ hiện ra */}
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          LIB-SYS Management ©{new Date().getFullYear()} Created by Khổng Trần Gia Huy
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;