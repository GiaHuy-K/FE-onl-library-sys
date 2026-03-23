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
      width: 120,
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
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "orange";
        let icon = <ClockCircleOutlined />;
        if (status === "APPROVED") {
          color = "green";
          icon = <CheckCircleOutlined />;
        }
        if (status === "REJECTED") {
          color = "red";
          icon = <CloseCircleOutlined />;
        }
        return (
          <Tag
            icon={icon}
            color={color}
            style={{ borderRadius: "4px", fontWeight: 500 }}
          >
            {status}
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

          {/* Row Thống kê  */}
          <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
            <Col xs={24} sm={8}>
              <Card bordered={false} hoverable style={{ borderRadius: "12px" }}>
                <Statistic
                  title="Tổng số phiếu"
                  value={tickets.length}
                  prefix={<BookOutlined style={{ color: "#FF6E61" }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} hoverable style={{ borderRadius: "12px" }}>
                <Statistic
                  title="Đang chờ duyệt"
                  value={tickets.filter((t) => t.status === "PENDING").length}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} hoverable style={{ borderRadius: "12px" }}>
                <Statistic
                  title="Tiền phí dự kiến"
                  value={tickets.reduce((sum, t) => sum + (t.fee || 0), 0)}
                  suffix="đ"
                  prefix={<WalletOutlined style={{ color: "#52c41a" }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Bảng danh sách chính */}
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
                <BookOutlined style={{ marginRight: 12, color: "#FF6E61" }} />
                DANH SÁCH PHIẾU MƯỢN CÁ NHÂN
              </Title>
            }
          >
            <Table
              columns={columns}
              dataSource={tickets}
              loading={loading}
              rowKey="ticketId"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 700 }}
            />
          </Card>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default MyTickets;
