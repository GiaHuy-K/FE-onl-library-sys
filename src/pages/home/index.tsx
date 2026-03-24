/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { 
  Layout, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Spin, 
  Empty, 
  ConfigProvider,
  Button 
} from "antd";
import { FireOutlined, RightOutlined, RocketOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom"; 
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import BookDetailModal from "../../components/common/BookDetailModal";
import FloatingCart from "../../components/context/FloatingCart";
import { useCart } from "../../components/context/CartContext"; 
import { bookService } from "../../services/book.service";
import styles from "./HomePage.module.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart(); 
  const navigate = useNavigate(); 
  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get("search");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = searchKeyword
        ? await bookService.searchBooks(searchKeyword)
        : await bookService.getAllBooks();
      
      if (!searchKeyword) {
        setBooks(data.slice(0, 5)); 
      } else {
        setBooks(data);
      }
    } catch (error) {
      console.error("Lỗi load sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchKeyword]);

  const handleOpenDetail = (id: number) => {
    setSelectedBookId(id);
    setIsModalOpen(true);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FF6E61",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout className={styles.mainWrapper}>
        <Header />
        <Content>
          {!searchKeyword && (
            <div className={styles.bannerSection}>
              <div className={styles.bannerContainer}>
                <img
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"
                  alt="Featured Book"
                  className={styles.bookCover}
                />
                <div className={styles.quoteWrapper}>
                  <Title level={2} className={styles.quoteText}>
                    "Một cuốn sách thực sự hay nên đọc trong tuổi trẻ, rồi đọc lại
                    khi đã trưởng thành, và một nửa lúc tuổi già. Giống như một
                    tòa nhà đẹp nên được chiêm ngưỡng trong ánh bình minh, nắng
                    trưa và ánh trăng."
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: "18px", display: "block", marginBottom: '24px' }}
                  >
                    - Robertson Davies
                  </Text>

                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<RocketOutlined />}
                    onClick={() => navigate("/explore")} 
                    style={{ 
                      height: '50px', 
                      padding: '0 40px', 
                      borderRadius: '25px', 
                      fontWeight: 700,
                      fontSize: '16px',
                      boxShadow: '0 4px 15px rgba(255, 110, 97, 0.4)'
                    }}
                  >
                    KHÁM PHÁ KỆ SÁCH NGAY
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.listSection}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                <FireOutlined style={{ color: "#FF6E61", marginRight: "8px" }} />
                {searchKeyword ? `KẾT QUẢ CHO: "${searchKeyword}"` : "TOP 5 TÁC PHẨM TIÊU BIỂU"}
              </Title>
              
              {!searchKeyword && (
                <Button 
                   type="link" 
                   onClick={() => navigate("/explore")}
                   icon={<RightOutlined />}
                   style={{ fontWeight: 600, color: '#FF6E61' }}
                >
                  Xem tất cả
                </Button>
              )}
            </div>

            <Spin spinning={loading} tip="đang chuẩn bị kệ sách...">
              <Row gutter={[32, 40]}>
                {books.length > 0 ? (
                  books.map((book) => (
                    <Col xs={12} sm={8} md={4.8} key={book.bookId}> 
                      <Badge.Ribbon
                        text={book.quantity > 0 ? "Sẵn có" : "Hết sách"}
                        color={book.quantity > 0 ? "cyan" : "volcano"}
                      >
                        <Card
                          hoverable
                          className={styles.bookCard}
                          cover={
                            <img
                              alt={book.title}
                              src={book.image || book.coverImg || "https://placehold.co/300x450?text=No+Cover"}
                              style={{ height: "280px", objectFit: "cover" }}
                            />
                          }
                          onClick={() => handleOpenDetail(book.bookId)}
                        >
                          <Card.Meta
                            title={<Text strong>{book.title}</Text>}
                            description={<Text type="secondary" ellipsis>{book.authorNames?.[0] || "N/A"}</Text>}
                          />
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))
                ) : (
                  !loading && <Col span={24}><Empty description="Kệ sách hiện đang trống !" /></Col>
                )}
              </Row>
            </Spin>
          </div>
        </Content>
        <Footer />

        <BookDetailModal
          open={isModalOpen}
          bookId={selectedBookId}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedBookId(null);
          }}
          addToCart={addToCart}
        />
        <FloatingCart />
      </Layout>
    </ConfigProvider>
  );
};

export default HomePage;