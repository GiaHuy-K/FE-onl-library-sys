import React, { useState, useEffect } from "react";
import { Table, Button, Upload, Card, Space, Typography, Tag, Breadcrumb } from "antd";
import { UploadOutlined, UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho tài khoản dựa trên form CSV
interface AccountData {
  fullname: string;
  code: string;      // Mã SV, Mã GV hoặc Mã NV
  phone: string;
  email: string;
}

const AccountManager: React.FC = () => {
  // Lấy type từ URL (STUDENT, LECTURER, STAFF)
  const currentPath = window.location.pathname.split("/").pop() || "STUDENT";
  const userType = currentPath.toUpperCase();

  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/account?type=${userType}`);
      // Giả sử BE trả về mảng object khớp với form mới
      setAccounts(response.data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(`Không thể lấy danh sách ${userType}!`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userType]);

  // Cấu hình Upload khớp với file Excel/CSV 
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    action: `https://api.awsread.id.vn/api/v1/account?type=${userType}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        toast.success(`Import danh sách ${userType} thành công!`);
        fetchAccounts();
        setLoading(false);
      } else if (info.file.status === "error") {
        toast.error(`Lỗi: Không thể import file. Vui lòng kiểm tra lại định dạng!`);
        setLoading(false);
      }
    },
  };

  // 4. Định nghĩa cột dựa trên form data
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: userType === "STUDENT" ? "Mã Sinh Viên" : userType === "LECTURER" ? "Mã Giảng Viên" : "Mã Nhân Viên",
      // Ở đây mình dùng logic để chọn đúng Key dựa trên userType
      dataIndex: userType === "STUDENT" ? "studentCode" : userType === "LECTURER" ? "lecturerCode" : "staffCode",
      key: "code", // key này để React quản lý list, để gì cũng được
      render: (text: string) => (
        <Tag color="cyan" icon={<IdcardOutlined />}>
          {/* Nếu text bị null (do BE trả sai key) thì hiện "N/A" cho chắc ăn */}
          {text || "Chưa có mã"}
        </Tag>
      ),
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space>
          <MailOutlined style={{ color: '#1890ff' }} />
          <a href={`mailto:${text}`}>{text}</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý người dùng</Breadcrumb.Item>
        <Breadcrumb.Item>{userType}</Breadcrumb.Item>
      </Breadcrumb>

      <Card bordered={false} className="shadow-sm">
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Danh sách {userType === "STUDENT" ? "Sinh Viên" : userType === "LECTURER" ? "Giảng Viên" : "Nhân Viên"}
            </Title>
            <Text type="secondary">Dữ liệu được quản lý theo hệ thống LIB-SYS</Text>
          </div>
          
          <Space>
            <Upload {...uploadProps} showUploadList={false}>
              <Button type="primary" icon={<UploadOutlined />}>
                Import từ file Excel
              </Button>
            </Upload>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={accounts.map((a, i) => ({ ...a, key: i }))} 
          loading={loading} 
          bordered
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng số ${total} tài khoản` }}
        />
      </Card>
    </div>
  );
};

export default AccountManager;