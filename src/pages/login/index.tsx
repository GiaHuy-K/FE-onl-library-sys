import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../config/useAuth";
import styles from "./LoginPage.module.css";
import { toast } from "react-toastify";
import api from "../../config/axios";
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
    console.log(">>> Dữ liệu gửi đi (Payload):", values);
    localStorage.clear(); // Xóa dữ liệu cũ trước khi lưu mới
    try {
      // 1. Gọi API thực tế
      const response = await api.post("/auth/login", {
        input: values.input,
        password: values.password,
      });

      console.log(">>> Response từ Backend:", response.data);
      const { token } = response.data;

      if (!token) {
        throw new Error("Không nhận được Token từ server!");
      }

      // 2. Giải mã JWT để lấy thông tin User
      const decoded: any = jwtDecode(token);
      console.log(">>> Dữ liệu giải mã từ JWT (Decoded):", decoded);

       
      // - 'scope' chứa Role (ADMIN)
      // - 'sub' chứa User ID
      const user = {
        id: decoded.sub,
        role: decoded.scope || "USER", 
      };

      console.log(">>> Object User sau khi xử lý:", user);

      // 3. Lưu vào AuthContext / LocalStorage
      login(user, token); 

      toast.success(`Đăng nhập thành công với quyền ${user.role}!`);

      // 4. Điều hướng dựa trên 'scope' (ADMIN)
      if (user.role === "ADMIN") {
        console.log(">>> Hướng người dùng tới: Dashboard");
        navigate("/dashboard");
      } else {
        console.log(">>> Hướng người dùng tới: Home");
        navigate("/");
      }

    } catch (error: any) {
      console.error(">>> Lỗi đăng nhập cụ thể:", error);
      
      const message =
        error.response?.data?.message || "Thông tin đăng nhập không chính xác!";
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
              name="input"
              rules={[
                { required: true, message: "Vui lòng nhập Email hoặc Tên đăng nhập!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email / Username" />
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