/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card, Button, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
    const pendingTickets = data.filter((t: any) => t.status === 'PENDING');
    
    setTickets(pendingTickets);
  } catch (error) {
    message.error("Không thể tải danh sách phiếu mượn!");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleAction = async (ticketId: number, isApprove: boolean) => {
    try {
      const payload = {
        id: ticketId,
        approve: isApprove,
        note: isApprove ? "Đã phê duyệt yêu cầu mượn sách" : "Từ chối: Sách hiện không khả dụng"
      };
      await bookService.processBorrowRequest(payload);
      
      if (isApprove) {
        message.success(`Đã duyệt thành công phiếu #T-${ticketId}`);
      } else {
        message.warning(`Đã từ chối phiếu #T-${ticketId}`);
      }
      
      fetchAllTickets(); 
    } catch (error) {
      message.error("Thao tác thất bại, kiểm tra lại kết nối nhé!");
    }
  };

  const columns: any[] = [
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
          {titles?.map(t => <Tag color="processing" key={t}>{t}</Tag>)}
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
        if (status === 'RETURNED') color = 'green';
        if (status === 'REJECTED') color = 'red';
        return <Tag color={color} style={{ fontWeight: 600 }}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          {record.status === 'PENDING' ? (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                icon={<CheckCircleOutlined />}
                onClick={() => handleAction(record.ticketId, true)}
              >
                Duyệt
              </Button>
              <Button
                danger
                ghost
                icon={<CloseCircleOutlined />}
                onClick={() => handleAction(record.ticketId, false)}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <Tag color="default">Đã hoàn thành</Tag>
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