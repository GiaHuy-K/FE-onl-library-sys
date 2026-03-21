/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  BookOutlined,
  ReadOutlined,
  AppstoreOutlined,
  HomeOutlined,
  PieChartOutlined,
  HistoryOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import UserDropdown from "../../common/UserDropdown";

const { Header, Content, Footer, Sider } = Layout;

// Hàm tạo Item cho Menu, trỏ về route /staff/...
function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: any[], isLink = true) {
  return {
    key,
    icon,
    children,
    label: isLink ? <Link to={`/staff/${key}`}>{label}</Link> : label,
  };
}

const items = [
  getItem("Tổng quan", "overview", <PieChartOutlined />),
  
  // Nhóm nghiệp vụ chính
  getItem("Quản lý Sách", "manage-books", <BookOutlined />),
  getItem("Danh mục hệ thống", "master-data", <AppstoreOutlined />),
  getItem("Giao dịch mượn/trả", "transactions", <SwapOutlined />, [
    getItem("Đang mượn", "borrowing", <HistoryOutlined />),
    getItem("Yêu cầu mới", "requests", <ReadOutlined />),
  ], false),

  getItem("Quay lại trang chủ", "home", <HomeOutlined />),
];

const StaffLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  // Lấy key cuối cùng của URL để highlight menu
  const selectedKey = location.pathname.split("/").pop() || "overview";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={220}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: "white", 
          fontWeight: "bold",
          fontSize: collapsed ? 14 : 18,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 16
        }}>
          {collapsed ? "LIB" : "LIB-SYS STAFF"}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          defaultOpenKeys={['master-data', 'transactions']}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: colorBgContainer, 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          zIndex: 1 
        }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            <span style={{ color: '#8c8c8c' }}>Khu vực:</span> <strong>Nhân viên</strong>
          </div>
          
          <UserDropdown />
        </Header>

        <Content style={{ margin: "24px 16px", overflow: 'initial' }}>
          <div style={{ 
            padding: 24, 
            minHeight: "100%", 
            background: colorBgContainer, 
            borderRadius: borderRadiusLG,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
          }}>
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center", color: '#8c8c8c' }}>
          Hệ thống quản lý thư viện LIB-SYS ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default StaffLayout;