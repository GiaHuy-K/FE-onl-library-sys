/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const { Title} = Typography;

const ForgotPassword = () => {
  const onFinish = async (values: { email: string }) => {
    try {
      await authService.requestResetPassword(values.email);
      message.success("Đã gửi mail thành công! Bạn check hòm thư nhé.");
    } catch (error) {
      message.error("Lỗi gửi mail rồi bạn, thử lại xem sao!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f7f6' }}>
      <Card style={{ width: 400, borderRadius: '12px' }}>
        <Title level={3} style={{ color: '#FF6E61', textAlign: 'center' }}>Quên mật khẩu</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email của anh" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#FF6E61', border: 'none' }}>
            Gửi yêu cầu
          </Button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login" style={{ color: '#8c8c8c' }}><ArrowLeftOutlined /> Quay lại đăng nhập</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};
export default ForgotPassword;