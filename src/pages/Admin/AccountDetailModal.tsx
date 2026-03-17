/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Tag, Typography, Spin, Avatar, Row, Col, } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, CheckCircleOutlined, StopOutlined, PhoneOutlined } from "@ant-design/icons";
import { accountService } from "../../services/account.service";

const { Title, Text } = Typography;

interface Props {
  isModalOpen: boolean;
  handleCancel: () => void;
  code: string | null;
  userType: "STUDENT" | "LECTURER" | "STAFF";
}

const AccountDetailModal: React.FC<Props> = ({ isModalOpen, handleCancel, code, userType }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!isModalOpen || !code) return;
      setLoading(true);
      try {
        const res = await accountService.getAccountByCode(code, userType);
        setData(res);
      } catch {
        // Lỗi đã có service lo qua toast
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [isModalOpen, code, userType]);

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Hồ sơ chi tiết</Title>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null} // Để null cho gọn, chỉ cần bấm X hoặc ra ngoài là đóng
      width={700}
      centered
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <div style={{ padding: "10px 0" }}>
          <Row gutter={24} align="middle">
            <Col span={8} style={{ textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
              <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {data?.name || "N/A"}
              </Title>
              <Tag color="blue">{userType}</Tag>
              <div style={{ marginTop: 12 }}>
                {data?.status === "ACTIVE" ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>Hoạt động</Tag>
                ) : (
                  <Tag color="red" icon={<StopOutlined />}>Đã khóa</Tag>
                )}
              </div>
            </Col>

            <Col span={16}>
              <Descriptions column={1} size="middle" labelStyle={{ fontWeight: 'bold', width: '150px' }}>
                <Descriptions.Item label={<span><IdcardOutlined /> {userType === "STUDENT" ? "MSSV" : "Mã định danh"}</span>}>
                  <Text copyable>{code}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<span><MailOutlined /> Email</span>}>
                  {data?.email}
                </Descriptions.Item>
                <Descriptions.Item label={<span><PhoneOutlined /> Điện thoại</span>}>
                  {data?.phone || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tham gia">
                  {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : "---"}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  );
};

export default AccountDetailModal;