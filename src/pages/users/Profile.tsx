/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, Descriptions, Button, Spin, Result, Avatar, Tag, Typography, Divider } from "antd";
import { UserOutlined, ArrowLeftOutlined, MailOutlined, CheckCircleOutlined, KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { accountService } from "../../services/account.service"; 


const { Text, Title } = Typography;

interface UserInfo {
  accountId: string;
  email: string;
  status: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State mở Modal đổi pass

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Đã chỉnh: Gọi đúng API từ Account Service
        const data = await accountService.getMyInfo();
        setUserInfo(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không thể tải thông tin");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <Spin size="large" tip="Đang tải thông tin cá nhân..." />
    </div>
  );

  if (error) return (
    <Result
      status="error"
      title="Lỗi tải dữ liệu"
      subTitle={error}
      extra={<Button type="primary" onClick={() => navigate(-1)}>Quay lại</Button>}
    />
  );

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: 20 }}
        type="link"
      >
        Quay lại trang trước
      </Button>

      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          <Title level={2} style={{ marginTop: 15, marginBottom: 0 }}>
            {userInfo?.email ? userInfo.email.split('@')[0].toUpperCase() : "ADMIN"}
          </Title>
          <Text type="secondary">Quản trị viên hệ thống LIB-SYS</Text>
        </div>

        <Descriptions 
          title="Thông tin định danh" 
          bordered 
          column={1} 
          labelStyle={{ fontWeight: "bold", width: "200px" }}
        >
          <Descriptions.Item label={<span><MailOutlined /> Email liên kết</span>}>
            {userInfo?.email}
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái tài khoản">
            {userInfo?.status === "ACTIVE" ? (
              <Tag color="green" icon={<CheckCircleOutlined />}>Đang hoạt động</Tag>
            ) : (
              <Tag color="red">Bị khóa</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            icon={<KeyOutlined />} 
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Đổi mật khẩu bảo mật
          </Button>
        </div>
      </Card>

      {/* Modal đổi mật khẩu 2 bước
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
      /> */}
    </div>
  );
};

export default ProfilePage;