/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography,List, Tag } from 'antd';
import { 
  BookOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { bookService } from '../../../services/book.service';
import dayjs from 'dayjs';
import { Avatar } from 'antd';
const { Title, Text } = Typography;

const StaffOverview = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const res = await bookService.getAllTickets();
        setData(res);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Overview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  // Tính toán các chỉ số từ Array dữ liệu
  const stats = {
    total: data.length,
    pending: data.filter(t => t.status === 'PENDING').length,
    approved: data.filter(t => t.status === 'APPROVED').length,
    overdue: data.filter(t => t.expired === true).length,
  };

  return (
    <div style={{ padding: '0px' }}>
      <Title level={3} style={{ marginBottom: 24, color: '#FF6E61' }}>
        Bảng Điều Khiển Của Thủ Thư
      </Title>

      {/* Hàng thẻ thống kê */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic 
              title="Tổng lượt yêu cầu" 
              value={stats.total} 
              prefix={<BookOutlined style={{ color: '#1890ff' }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic 
              title="Cần xử lý gấp" 
              value={stats.pending} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic 
              title="Sách đang cho mượn" 
              value={stats.approved} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic 
              title="Phiếu quá hạn" 
              value={stats.overdue} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Danh sách các yêu cầu mượn mới nhất */}
        <Col xs={24} lg={16}>
          <Card title="Các yêu cầu mượn gần đây" bordered={false} extra={<a href="/staff/ticket-requests">Xem tất cả</a>}>
            <List
              loading={loading}
              dataSource={data.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                    title={<span>Mã phiếu: <b>#T-{item.ticketId}</b></span>}
                    description={`Yêu cầu: ${item.bookTitles?.join(", ")}`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Tag color={item.status === 'PENDING' ? 'orange' : 'green'}>{item.status}</Tag>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                      {dayjs(item.borrowFrom).format('DD/MM/YYYY')}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Cột thông tin phụ hoặc Tips */}
        <Col xs={24} lg={8}>
          <Card title="Ghi chú hệ thống" bordered={false} style={{ height: '100%' }}>
            <Text type="secondary">
              * Nhớ kiểm tra mục <b>Cần xử lý gấp</b> mỗi sáng để duyệt sách cho sinh viên nhé.
            </Text>
            <div style={{ marginTop: 20, padding: 16, background: '#fff7e6', borderRadius: 8 }}>
              <Text strong style={{ color: '#d46b08' }}>Mẹo nhỏ:</Text>
              <p style={{ margin: 0, fontSize: '13px' }}>
                Những phiếu quá hạn sẽ được hệ thống tự động tính phí phạt
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};



export default StaffOverview;