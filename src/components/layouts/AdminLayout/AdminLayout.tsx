/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  MedicineBoxOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  PieChartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import UserDropdown from "../../common/UserDropdown";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: any[], link = true) {
  return {
    key,
    icon,
    children,
    label: link ? <Link to={`/dashboard/${key}`}>{label}</Link> : label,
  };
}

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
    false
  ),
  getItem("Về trang chủ", "home", <HomeOutlined />),
];

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ height: 32, margin: "16px", color: "white", fontWeight: "bold", textAlign: "center" }}>
          {collapsed ? "LIB" : "LIB-SYS ADMIN"}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname.split("/").pop() || "overview"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: colorBgContainer, 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" 
        }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>
            👋 Xin chào, <strong>Admin</strong>
          </div>
          
          {/* Component đã tách biệt */}
          <UserDropdown />
        </Header>

        <Content style={{ margin: "24px 16px" }}>
          <div style={{ padding: 24, minHeight: "100%", background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          LIB-SYS Management ©{new Date().getFullYear()} Created by 4TL
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;