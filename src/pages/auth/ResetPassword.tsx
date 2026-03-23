/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { authService } from '../../services/auth.service';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('resetToken');
  const onFinish = async (values: any) => {
    if (!token) {
      message.error("Không tìm thấy mã xác thực, vui lòng kiểm tra lại email!");
      return;
    }

    try {
      await authService.resetPassword(token, {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      message.success("Mật khẩu đã được thay đổi thành công!");
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || "Mã xác thực đã hết hạn !");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#FF6E61' }}>Thiết lập mật khẩu mới</Title>
          <Text type="secondary">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Mật khẩu phải từ 6 ký tự!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#FF6E61', borderColor: '#FF6E61', marginTop: 8 }}>
            Cập nhật mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;