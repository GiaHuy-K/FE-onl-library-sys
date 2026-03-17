/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../config/useAuth";
import { authService } from "../../services/auth.service"; 
import styles from "./LoginPage.module.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; 

const { Title, Text } = Typography;

interface LoginFormValues {
  input: string; 
  password: string;
  remember?: boolean;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    // Xóa sạch dữ liệu cũ để tránh xung đột session
    localStorage.clear(); 

    try {
      // 1. Gọi API thông qua Service 
      const data = await authService.login({
        input: values.input,
        password: values.password,
      });

      const { token } = data;

      if (!token) {
        throw new Error("Không nhận được Token từ server!");
      }

      // 2. Giải mã JWT
      const decoded: any = jwtDecode(token);
      
      const user = {
        id: decoded.sub,
        role: decoded.scope || "USER", 
      };

      // 3. Lưu vào Context & LocalStorage 
      login(user, token); 

      toast.success(`Chào mừng quay trở lại, ${user.role}!`);

      // 4. Điều hướng (Sử dụng vai trò từ JWT)
      if (user.role === "ADMIN") {
        navigate("/dashboard/overview"); // Điều hướng vào trang mặc định của Admin
      } else {
        navigate("/");
      }

    } catch (error: any) {
      console.error(">>> Login Error:", error);
      const errorMessage = error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
      toast.error(errorMessage);
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

      <div className={styles.rightSide}>
        <Card className={styles.loginCard}>
          <div className={styles.headerSection}>
            <Title level={2} className={styles.brandTitle}>ĐĂNG NHẬP</Title>
            <Text type="secondary">Vui lòng nhập thông tin tài khoản để tiếp tục</Text>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="input"
              rules={[{ required: true, message: "Vui lòng nhập Email hoặc Tên đăng nhập!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email / Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ tôi</Checkbox>
                </Form.Item>
                {/* Nên có link quên mật khẩu ở đây  */}
                <Link to="/forgot-password" style={{ color: "#1890ff" }}>Quên mật khẩu?</Link>
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
              <Link to="/" className={styles.backHomeLink}>
                <ArrowLeftOutlined /> Quay lại trang chủ
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;