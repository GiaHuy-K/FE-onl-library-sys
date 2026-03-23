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
  ConfigProvider 
} from "antd";
import { FireOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import BookDetailModal from "../../components/common/BookDetailModal";
import { bookService } from "../../services/book.service";
import styles from "./HomePage.module.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get("search");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = searchKeyword
        ? await bookService.searchBooks(searchKeyword)
        : await bookService.getAllBooks();
      setBooks(data);
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
          {/* 1. Banner: Ảnh & Quote */}
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
                    khi đã trưởng thành, và một nửa lúc tuổi già, giống như một
                    tòa nhà đẹp nên được chiêm ngưỡng trong ánh bình minh, nắng
                    trưa và ánh trăng.”
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: "18px", display: "block", fontStyle: "normal" }}
                  >
                    - Robertson Davies
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* 2. Danh sách sách */}
          <div className={styles.listSection}>
            <div className={styles.sectionHeader}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                <FireOutlined style={{ color: "#FF6E61", marginRight: "8px" }} />
                {searchKeyword
                  ? `KẾT QUẢ CHO: "${searchKeyword}"`
                  : "NHỮNG TÁC PHẨM TIÊU BIỂU"}
              </Title>
            </div>

            <Spin spinning={loading} tip="đang chuẩn bị kệ sách...">
              <Row gutter={[32, 40]}>
                {books.length > 0 ? (
                  books.map((book) => (
                    <Col xs={12} sm={8} md={6} key={book.bookId}>
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
                              src={
                                book.image ||
                                book.coverImg ||
                                "https://placehold.co/300x450?text=No+Cover"
                              }
                              style={{ height: "320px", objectFit: "cover" }}
                              onError={(e: any) =>
                                (e.target.src =
                                  "https://placehold.co/300x450?text=Image+Error")
                              }
                            />
                          }
                          onClick={() => handleOpenDetail(book.bookId)}
                        >
                          <Card.Meta
                            title={
                              <Text strong style={{ fontSize: "16px" }}>
                                {book.title}
                              </Text>
                            }
                            description={
                              <Text type="secondary" style={{ display: 'block' }}>
                                {book.authorNames?.[0] || book.author || "N/A"}
                              </Text>
                            }
                          />
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))
                ) : (
                  !loading && (
                    <Col span={24}>
                      <Empty description="Kệ sách hiện đang trống !" />
                    </Col>
                  )
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
        />
      </Layout>
    </ConfigProvider>
  );
};

export default HomePage;