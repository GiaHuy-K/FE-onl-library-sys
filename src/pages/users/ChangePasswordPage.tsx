/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Card,
  Steps,
  Form,
  Input,
  Button,
  Typography,
  Result,
  Row,
  Col,
  Space,
} from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { accountService } from "../../services/account.service";

const { Title, Text } = Typography;

const ChangePasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRequest = async (values: any) => {
    setLoading(true);
    try {
      await accountService.requestChangePassword(values.currentPassword);
      setCurrentStep(1);
    } catch (err) {
      /* Toast service đã lo */
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (values: any) => {
    setLoading(true);
    try {
      await accountService.confirmChangePassword(
        values.newPassword,
        values.confirmPassword,
      );
      setCurrentStep(2);
    } catch (err) {
      /* Toast service đã lo */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 24px" }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={10}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <Title level={3}>Thay đổi mật khẩu</Title>
              <Text type="secondary">
                Cập nhật bảo mật cho tài khoản LIB-SYS của anh
              </Text>
            </div>

            <Steps
              current={currentStep}
              size="small"
              items={[
                { title: "Xác thực" },
                { title: "Mật khẩu mới" },
                { title: "Hoàn tất" },
              ]}
              style={{ marginBottom: 40 }}
            />

            {currentStep === 0 && (
              <Form form={form} layout="vertical" onFinish={handleRequest}>
                <div
                  style={{
                    backgroundColor: "#e6f7ff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: 24,
                  }}
                >
                  <Space align="start">
                    <MailOutlined style={{ color: "#1890ff" }} />
                    <Text>
                      Hệ thống sẽ gửi mã xác nhận về Email sau bước này.
                    </Text>
                  </Space>
                </div>
                <Form.Item
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu đang dùng"
                    size="large"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  Tiếp tục
                </Button>

                <Button
                  type="link"
                  block
                  onClick={() => navigate(-1)}
                  style={{ marginTop: 8, color: "rgba(0,0,0,0.45)" }}
                >
                  Quay lại
                </Button>
              </Form>
            )}

            {currentStep === 1 && (
              <Form form={form} layout="vertical" onFinish={handleConfirm}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, min: 6, message: "Tối thiểu 6 ký tự" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu mới"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value)
                          return Promise.resolve();
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!"),
                        );
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<CheckCircleOutlined />}
                    placeholder="Gõ lại mật khẩu mới"
                    size="large"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  Xác nhận đổi mật khẩu
                </Button>
              </Form>
            )}

            {currentStep === 2 && (
              <Result
                status="success"
                title="Thành công!"
                subTitle="Mật khẩu của anh đã được cập nhật."
                extra={
                  <Button type="primary" onClick={() => navigate("/")}>
                    Về trang chủ
                  </Button>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePasswordPage;
