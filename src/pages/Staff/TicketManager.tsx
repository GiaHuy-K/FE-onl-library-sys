/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card, Button, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { bookService } from '../../services/book.service';
import dayjs from 'dayjs';

const { Title } = Typography;

const StaffTicketManager = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllTickets(); 
      setTickets(data);
    } catch (error) {
      message.error("Không thể tải danh sách phiếu mượn!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const columns = [
    {
      title: 'Mã số',
      dataIndex: 'ticketId',
      key: 'ticketId',
      width: 100,
      render: (id: number) => <b>#T-{id}</b>,
    },
    {
      title: 'Sách yêu cầu',
      dataIndex: 'bookTitles',
      key: 'bookTitles',
      render: (titles: string[]) => (
        <Space size={[0, 4]} wrap>
          {titles.map(t => <Tag color="processing" key={t}>{t}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'borrowFrom',
      key: 'borrowFrom',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'APPROVED') color = 'green';
        if (status === 'REJECTED') color = 'red';
        return <Tag color={color} style={{ fontWeight: 600 }}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === 'PENDING' ? (
            <>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => message.success(`Đã duyệt phiếu ${record.ticketId}`)}
              >
                Duyệt
              </Button>
              <Button 
                danger 
                ghost
                icon={<CloseCircleOutlined />}
                onClick={() => message.warning(`Đã từ chối phiếu ${record.ticketId}`)}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <Button icon={<EyeOutlined />} size="small">Chi tiết</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        margin: '0' 
      }}
      title={
        <Title level={4} style={{ margin: 0, color: '#FF6E61', fontSize: '24px' }}>
          Phiếu Mượn Đang Chờ Xử Lý
        </Title>
      }
    >
      <Table 
        columns={columns} 
        dataSource={tickets} 
        loading={loading} 
        rowKey="ticketId"
        pagination={{ pageSize: 10, size: 'small' }}
        size="middle"
      />
    </Card>
  );
};

export default StaffTicketManager;