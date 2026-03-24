/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card, Space, message, Button, Modal, Input, Popconfirm } from 'antd';
import { 
  ExclamationCircleOutlined, 
  BookOutlined, 
  ExportOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { bookService } from '../../services/book.service';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ActiveLoans = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActiveLoans = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllTickets();
      const activeData = data.filter((t: any) => 
        t.status === 'APPROVED' || t.status === 'BORROWING'
      );
      setLoans(activeData);
    } catch (error) {
      message.error("Không thể tải danh sách sách đang mượn!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const handleCheckout = async (ticketId: number) => {
    try {
      await bookService.checkoutBook(ticketId);
      fetchActiveLoans();
    } catch (error) {
      console.error("Checkout error");
    }
  };

  const handleReturn = async (ticketId: number) => {
    try {
      await bookService.returnBook(ticketId);
      fetchActiveLoans();
    } catch (error) {
      console.error("Return error");
    }
  };

  // --- HÀM HỦY ĐƠN VỚI LÝ DO ---
  const handleCancel = (record: any) => {
    let reason = ""; 

    Modal.confirm({
      title: `Xác nhận hủy phiếu mượn #T-${record.ticketId}`,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div style={{ marginTop: 16 }}>
          <Text strong>Lý do hủy đơn:</Text>
          <Input 
            placeholder="Nhập lý do (ví dụ: SV không đến nhận sách quá hạn...)" 
            onChange={(e) => { reason = e.target.value; }}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      okText: 'Xác nhận Hủy',
      okType: 'danger',
      cancelText: 'Quay lại',
      onOk: async () => {
        if (!reason.trim()) {
          message.warning("Phải nhập lý do thì mới hủy được !");
          return Promise.reject(); 
        }
        try {
          await bookService.cancelBorrowRequest(record, reason); 
          fetchActiveLoans();
        } catch (error) {
          console.error("Cancel error");
        }
      },
    });
  };

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'ticketId',
      key: 'ticketId',
      width: 90,
      render: (id: number) => <b>#T-{id}</b>,
    },
    {
      title: 'Thông tin sách',
      dataIndex: 'bookTitles',
      key: 'bookTitles',
      render: (titles: string[]) => (
        <Space direction="vertical" size={0}>
          {titles?.map(t => <Text key={t}><BookOutlined style={{marginRight: 8}} /> {t}</Text>)}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'BORROWING' ? 'blue' : 'cyan'} style={{ fontWeight: 500 }}>
          {status === 'BORROWING' ? 'ĐANG MƯỢN' : 'CHỜ XUẤT KHO'}
        </Tag>
      )
    },
    {
      title: 'Hạn trả sách',
      dataIndex: 'borrowTo',
      key: 'borrowTo',
      render: (date: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          {record.expired && (
            <Tag color="error" icon={<ExclamationCircleOutlined />} style={{fontSize: '10px', margin: 0}}>
              Quá hạn
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác nghiệp vụ',
      key: 'actions',
      width: 400, 
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* NÚT XUẤT KHO */}
          <Button 
            type="primary" 
            size="small"
            icon={<ExportOutlined />}
            onClick={() => handleCheckout(record.ticketId)}
            disabled={record.status === 'BORROWING'}
            style={{ 
                backgroundColor: record.status === 'APPROVED' ? '#1890ff' : '#f5f5f5',
                borderColor: record.status === 'APPROVED' ? '#1890ff' : '#d9d9d9',
                color: record.status === 'APPROVED' ? '#fff' : '#bfbfbf'
            }}
          >
            Xuất kho
          </Button>

          {/* NÚT THU HỒI */}
          <Popconfirm
            title="Xác nhận sinh viên đã trả sách?"
            onConfirm={() => handleReturn(record.ticketId)}
            disabled={record.status === 'APPROVED'}
          >
            <Button 
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              disabled={record.status === 'APPROVED'}
              style={{ 
                backgroundColor: record.status === 'BORROWING' ? '#52c41a' : '#f5f5f5',
                borderColor: record.status === 'BORROWING' ? '#52c41a' : '#d9d9d9',
                color: record.status === 'BORROWING' ? '#fff' : '#bfbfbf'
              }}
            >
              Thu hồi
            </Button>
          </Popconfirm>

          {/* NÚT HỦY ĐƠN  */}
          <Button 
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleCancel(record)} 
            style={{ 
              display: record.status === 'APPROVED' ? 'inline-flex' : 'none' 
            }}
          >
            Hủy đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      bordered={false} 
      style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      title={
        <Title level={4} style={{ margin: 0, color: '#FF6E61', fontSize: '20px' }}>
          Quản Lý Mượn & Trả Hệ Thống
        </Title>
      }
    >
      <Table 
        columns={columns} 
        dataSource={loans} 
        loading={loading} 
        rowKey="ticketId"
        pagination={{ pageSize: 8 }}
        size="middle"
      />
    </Card>
  );
};

export default ActiveLoans;