import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../config/Authcontext";
import styles from "./LoginPage.module.css";
import { toast } from "react-toastify";
import api from "../../config/axios";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // 1. Gọi API thực tế từ Backend
      // Endpoint thường là /auth/login hoặc /login tùy BE của anh
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      // 2. Lấy dữ liệu trả về từ BE
      // Cấu trúc thông thường: { token: "...", user: { fullName: "...", role: "..." } }
      const { token, user } = response.data;

      // 3. Gọi hàm login từ AuthContext để lưu vào LocalStorage và State
      login(user, token);

      toast.success(`Chào mừng ${user.fullName} quay trở lại!`);

      // 4. Điều hướng dựa trên Role thực tế trả về từ DB
      if (user.role === "ADMIN") {
        navigate("/dashboard/overview");
      } else if (user.role === "STAFF") {
        navigate("/dashboardNurse/dashboardN"); // Hoặc dashboard cho Staff thư viện
      } else {
        navigate("/"); // Student hoặc Lecturer về trang chủ
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      // Xử lý lỗi từ BE trả về
      const message =
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.leftSide}>
        <div className={styles.overlayContent}>
          <h1>LIB-SYS</h1>
          <blockquote className={styles.quoteBox}>
            <p>
              "Đọc những cuốn sách hay cũng giống như được trò chuyện với những
              bộ óc tuyệt vời nhất của các thế kỷ đã trôi qua."
            </p>
            <cite>— René Descartes</cite>
          </blockquote>
        </div>
      </div>

      {/* Phần bên phải: Form đăng nhập */}
      <div className={styles.rightSide}>
        <Card className={styles.loginCard}>
          <div className={styles.headerSection}>
            <Title level={2} className={styles.brandTitle}>
              ĐĂNG NHẬP
            </Title>
            <Text type="secondary">
              Vui lòng nhập thông tin tài khoản để tiếp tục
            </Text>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập Email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                {/* <Link to="/forgot-password" className={styles.forgotPassword}>
                  Quên mật khẩu?
                </Link> */}
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className={styles.loginButton}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>

            <div className={styles.footerSection}>
              <Text type="secondary">
                Chưa có tài khoản?{" "}
                <Link to="/register" className={styles.registerLink}>
                  Đăng ký ngay
                </Link>
              </Text>

              
              <div className={styles.backHomeContainer}>
                <Link to="/" className={styles.backHomeLink}>
                  <ArrowLeftOutlined /> Quay lại trang chủ
                </Link>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
