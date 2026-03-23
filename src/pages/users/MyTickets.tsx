/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Layout,
  Card,
  Space,
  Row,
  Col,
  Statistic,
  Breadcrumb,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  WalletOutlined,
  HomeOutlined,
  CalendarOutlined,
  SyncOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { bookService } from "../../services/book.service";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;

const MyTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const data = await bookService.getMyTickets();
        setTickets(data);
      } catch (error) {
        console.error("Lỗi fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "ticketId",
      key: "ticketId",
      width: 100,
      render: (id: number) => <Text strong>#T-{id}</Text>,
    },
    {
      title: "Tác phẩm",
      dataIndex: "bookTitles",
      key: "bookTitles",
      render: (titles: string[]) => (
        <Space direction="vertical" size={0}>
          {titles.map((title) => (
            <Text key={title}>
              <BookOutlined style={{ marginRight: 8, color: "#8c8c8c" }} />
              {title}
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowFrom",
      key: "borrowFrom",
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            Bắt đầu
          </Text>
          <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
        </Space>
      ),
    },
    {
      title: "Hạn trả sách",
      dataIndex: "borrowTo",
      key: "borrowTo",
      render: (date: string, record: any) => {
        const showDate =
          record.status === "APPROVED" ||
          record.status === "BORROWING" ||
          record.status === "RETURNED";
        if (!showDate) return <Text type="secondary">---</Text>;

        return (
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Hạn cuối
            </Text>
            <Text
              strong
              style={{ color: record.expired ? "#ff4d4f" : "#1677ff" }}
            >
              {dayjs(date).format("DD/MM/YYYY")}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        let icon = <ClockCircleOutlined />;
        let label = status;

        switch (status) {
          case "PENDING":
            color = "orange";
            icon = <ClockCircleOutlined spin />;
            label = "CHỜ DUYỆT";
            break;
          case "APPROVED":
            color = "cyan";
            icon = <CheckCircleOutlined />;
            label = "ĐÃ DUYỆT";
            break;
          case "BORROWING":
            color = "processing";
            icon = <SyncOutlined spin />;
            label = "ĐANG MƯỢN";
            break;
          case "RETURNED":
            color = "success";
            icon = <HistoryOutlined />;
            label = "ĐÃ TRẢ SÁCH";
            break;
          case "REJECTED":
            color = "error";
            icon = <CloseCircleOutlined />;
            label = "BỊ TỪ CHỐI";
            break;
        }

        return (
          <Tag
            icon={icon}
            color={color}
            style={{ borderRadius: "4px", fontWeight: 600, padding: "2px 8px" }}
          >
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Phí mượn",
      dataIndex: "fee",
      key: "fee",
      render: (fee: number) => (
        <Text type={fee > 0 ? "danger" : "success"} strong>
          {fee > 0 ? `${fee.toLocaleString()} đ` : "Miễn phí"}
        </Text>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f4f7f6" }}>
      <Header />
      <Content style={{ padding: "24px 50px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Breadcrumb style={{ marginBottom: "24px" }}>
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item>Phiếu mượn của tôi</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
            {/* 1. Nhóm Đang xử lý  */}
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                hoverable
                style={{ borderRadius: "12px", borderTop: "4px solid #faad14" }}
              >
                <Statistic
                  title="Đang xử lý"
                  value={
                    tickets.filter(
                      (t) => t.status === "PENDING" || t.status === "APPROVED",
                    ).length
                  }
                  valueStyle={{ color: "#faad14" }}
                  prefix={<ClockCircleOutlined />}
                  suffix={
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      /{tickets.length}
                    </Text>
                  }
                />
              </Card>
            </Col>

            {/* 2. Sách đang mượn  */}
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                hoverable
                style={{ borderRadius: "12px", borderTop: "4px solid #1890ff" }}
              >
                <Statistic
                  title="Đang cầm sách"
                  value={tickets.filter((t) => t.status === "BORROWING").length}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={
                    <SyncOutlined
                      spin={tickets.some((t) => t.status === "BORROWING")}
                    />
                  }
                />
              </Card>
            </Col>

            {/* 3. Lịch sử đã trả  */}
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                hoverable
                style={{ borderRadius: "12px", borderTop: "4px solid #52c41a" }}
              >
                <Statistic
                  title="Sách đã trả"
                  value={tickets.filter((t) => t.status === "RETURNED").length}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<HistoryOutlined />}
                />
              </Card>
            </Col>

            {/* 4.  (Phí phạt) */}
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                hoverable
                style={{ borderRadius: "12px", borderTop: "4px solid #ff4d4f" }}
              >
                <Statistic
                  title="Phí cần nộp"
                  value={tickets.reduce((sum, t) => sum + (t.fee || 0), 0)}
                  suffix="đ"
                  valueStyle={{ color: "#ff4d4f" }}
                  prefix={<WalletOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
            title={
              <Title
                level={4}
                style={{ margin: 0, display: "flex", alignItems: "center" }}
              >
                <CalendarOutlined
                  style={{ marginRight: 12, color: "#FF6E61" }}
                />
                DANH SÁCH PHIẾU MƯỢN CÁ NHÂN
              </Title>
            }
          >
            <Table
              columns={columns}
              dataSource={tickets}
              loading={loading}
              rowKey="ticketId"
              pagination={{ pageSize: 6 }}
              scroll={{ x: 1000 }}
            />
          </Card>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MyTickets;
