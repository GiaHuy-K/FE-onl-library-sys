/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Spin, Typography, Tag, Divider, Image, Space, Descriptions, Button } from "antd";
import { useEffect, useState } from "react";
import { bookService } from "../../services/book.service";
import { useAuth } from "../../config/useAuth"; 
import { InfoCircleOutlined, UserOutlined, TagsOutlined, BankOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const BookDetailModal = ({ open, bookId, onCancel }: any) => {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); 

  //Nếu không có user thì mặc định là STUDENT
  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  useEffect(() => {
    if (open && bookId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const data = await bookService.getBookById(bookId);
          setBook(data);
        } catch (error) {
          console.error("Lỗi detail:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [open, bookId]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>Đóng</Button>,
        !isStaff && book?.quantity > 0 && (
          <Button key="borrow" type="primary" style={{ backgroundColor: '#00BFA5' }} icon={<ShoppingCartOutlined />}>
            Mượn sách
          </Button>
        )
      ]}
      width={700}
      centered
      title={<span><InfoCircleOutlined /> {isStaff ? "Quản lý sách" : "Chi tiết tác phẩm"}</span>}
    >
      <Spin spinning={loading} description="Pé đang lấy sách xuống...">
        {book ? (
          <div style={{ display: "flex", gap: "24px", paddingTop: '10px' }}>
            <div style={{ flex: "0 0 200px" }}>
              <Image
                width={200}
                src={book.image || book.coverImg || "https://placehold.co/200x300?text=No+Cover"}
                fallback="https://placehold.co/200x300?text=Error"
                style={{ borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ color: "#FF6E61", marginBottom: 0 }}>{book.title}</Title>
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>ISBN: {book.isbn || 'N/A'}</Text>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text><UserOutlined /> Tác giả: <Text strong>{book.authorNames?.join(", ") || book.author || "N/A"}</Text></Text>
                <Text><TagsOutlined /> Thể loại: {book.categoryNames?.map((c: any) => <Tag color="cyan" key={c}>{c}</Tag>) || "Chung"}</Text>
                <Text><BankOutlined /> NXB: {book.publisherName || "N/A"}</Text>
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              <Descriptions column={1} size="small">
                {/* ROLE STAFF: HIỆN GIÁ & SỐ LƯỢNG */}
                {isStaff && (
                  <>
                    <Descriptions.Item label="Giá bán/mượn">
                      <Text type="danger" strong>{book.price?.toLocaleString()} đ</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trong kho">{book.quantity} cuốn</Descriptions.Item>
                  </>
                )}
                
                {/* ROLE STUDENT: CHỈ HIỆN TRẠNG THÁI */}
                {!isStaff && (
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={book.quantity > 0 ? "green" : "red"}>
                      {book.quantity > 0 ? "Còn sách để mượn" : "Đã hết sách"}
                    </Tag>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {book.description && (
                <div style={{ marginTop: 12 }}>
                  <Paragraph type="secondary" ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}>
                    {book.description}
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
        ) : !loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Không tìm thấy thông tin cho cuốn sách này (ID: {bookId})
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default BookDetailModal;