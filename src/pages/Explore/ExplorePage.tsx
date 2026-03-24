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
  Checkbox,
  Divider,
  Space,
  Select,
  Tag,
  Button,
  Tooltip,
  Modal,
  List,
  Avatar,
} from "antd";
import {
  FilterOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import BookDetailModal from "../../components/common/BookDetailModal";
import FloatingCart from "../../components/context/FloatingCart";
import { useCart } from "../../components/context/CartContext";
import { useAuth } from "../../config/useAuth"; 
import { bookService } from "../../services/book.service";
import { categoryService } from "../../services/category.service";
import { authorService } from "../../services/author.service";
import styles from "./ExplorePage.module.css";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const ExplorePage = () => {
  const location = useLocation();
  const { user } = useAuth(); 
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [displayBooks, setDisplayBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- QUẢN LÝ MODAL PHIẾU MƯỢN ---
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const searchKeyword = new URLSearchParams(location.search).get("search") || "";

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  useEffect(() => {
    const handleOpenModal = () => {
      if (!isStaff) setIsCartVisible(true);
    };

    window.addEventListener("open-borrow-modal", handleOpenModal);

    const params = new URLSearchParams(location.search);
    if (params.get("openCart") === "true" && !isStaff) {
      setIsCartVisible(true);
    }

    return () => {
      window.removeEventListener("open-borrow-modal", handleOpenModal);
    };
  }, [location.search, isStaff]);

  const initData = async () => {
    setLoading(true);
    try {
      const [booksRes, catsRes, authorsRes] = await Promise.all([
        bookService.getAllBooks(),
        categoryService.getAll(),
        authorService.getAll(),
      ]);
      setAllBooks(booksRes);
      setDisplayBooks(booksRes);
      setCategories(catsRes);
      setAuthors(authorsRes.map((a: any) => ({ value: a.name, label: a.name })));
    } catch (error) {
      console.error("Lỗi khởi tạo Explore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    let filtered = [...allBooks];
    if (searchKeyword) {
      const key = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(key) ||
          b.authorNames?.some((a: string) => a.toLowerCase().includes(key))
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((b) =>
        b.categoryNames?.some((cat: string) => selectedCategories.includes(cat))
      );
    }
    if (selectedAuthors.length > 0) {
      filtered = filtered.filter((b) =>
        b.authorNames?.some((a: string) => selectedAuthors.includes(a))
      );
    }
    setDisplayBooks(filtered);
  }, [searchKeyword, selectedCategories, selectedAuthors, allBooks]);

  const handleConfirmBorrow = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const ids = cart.map((item: any) => item.bookId);
      const today = dayjs().format("YYYY-MM-DD");
      await bookService.borrowBook(ids, today);
      clearCart();
      setIsCartVisible(false);
    } catch (error) {
      console.error("Lỗi gửi yêu cầu mượn:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout className={styles.mainWrapper}>
      <Header />
      <Content className={styles.exploreSection}>
        <Layout className={styles.outerLayout}>
          <Sider width={280} className={styles.filterSider}>
            <Title level={4} className={styles.filterTitle}>
              <FilterOutlined className={styles.filterHeaderIcon} /> BỘ LỌC
            </Title>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ marginBottom: 24 }}>
              <Text className={styles.filterItemLabel}>THỂ LOẠI</Text>
              <Checkbox.Group
                className={styles.checkboxGroup}
                value={selectedCategories}
                onChange={(vals) => setSelectedCategories(vals as string[])}
              >
                <Space direction="vertical" style={{ width: "100%", marginTop: 12 }}>
                  {categories.map((cat: any) => (
                    <Checkbox key={cat.id} value={cat.name} className={styles.checkboxItem}>
                      {cat.name}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </div>
            <Divider />
            <div>
              <Text className={styles.filterItemLabel}>TÁC GIẢ</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", marginTop: 12 }}
                placeholder="Chọn tác giả..."
                value={selectedAuthors}
                onChange={(vals) => setSelectedAuthors(vals)}
                options={authors}
                maxTagCount="responsive"
              />
            </div>
          </Sider>

          <Content className={styles.listContent}>
            <div className={styles.resultInfoBar}>
              <Text className={styles.resultCount}>
                Tìm thấy <b>{displayBooks.length}</b> tác phẩm phù hợp
              </Text>
              <div className={styles.activeTags}>
                {selectedCategories.map((c) => (
                  <Tag color="orange" closable key={c} onClose={() => setSelectedCategories(prev => prev.filter(i => i !== c))}>
                    {c}
                  </Tag>
                ))}
                {selectedAuthors.map((a) => (
                  <Tag color="blue" closable key={a} onClose={() => setSelectedAuthors(prev => prev.filter(i => i !== a))}>
                    {a}
                  </Tag>
                ))}
              </div>
            </div>

            <Spin spinning={loading}>
              <Row gutter={[24, 32]}>
                {displayBooks.map((book) => (
                  <Col xs={12} sm={12} md={8} lg={6} key={book.bookId}>
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
                            className={styles.bookCardCover}
                            src={book.coverImg || "https://placehold.co/300x450?text=No+Cover"}
                          />
                        }
                        actions={[
                          !isStaff && (
                            <Tooltip title="Thêm vào phiếu mượn" key="add">
                              <Button
                                type="text"
                                icon={<PlusCircleOutlined style={{ fontSize: "20px", color: "#FF6E61" }} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(book);
                                }}
                                disabled={book.quantity <= 0}
                              />
                            </Tooltip>
                          ),
                          <Tooltip title="Xem chi tiết" key="view">
                            <Button
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => {
                                setSelectedBookId(book.bookId);
                                setIsModalOpen(true);
                              }}
                            />
                          </Tooltip>,
                        ].filter(Boolean)}
                      >
                        <Card.Meta
                          title={<Text className={styles.cardMetaTitle} ellipsis>{book.title}</Text>}
                          description={<Text className={styles.cardMetaDesc} ellipsis>{book.authorNames?.[0] || "N/A"}</Text>}
                        />
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                ))}
              </Row>
            </Spin>
          </Content>
        </Layout>
      </Content>

      <BookDetailModal
        open={isModalOpen}
        bookId={selectedBookId}
        onCancel={() => setIsModalOpen(false)}
        addToCart={!isStaff ? addToCart : undefined} 
      />
      <Modal
        title={<Title level={4} style={{ margin: 0 }}><ShoppingOutlined /> Phiếu mượn chờ gửi</Title>}
        open={isCartVisible}
        onCancel={() => setIsCartVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsCartVisible(false)}>Chọn thêm</Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleConfirmBorrow}
            style={{ backgroundColor: '#FF6E61', borderColor: '#FF6E61' }}
          >
            Gửi yêu cầu mượn
          </Button>,
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={cart}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeFromCart(item.bookId)} />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size={64} src={item.coverImg || "https://placehold.co/50x75"} />}
                title={<Text strong>{item.title}</Text>}
                description={`Tác giả: ${item.authorNames?.[0] || "N/A"}`}
              />
            </List.Item>
          )}
        />
        <Divider />
        <div style={{ textAlign: "right" }}>
          <Text type="secondary">Dự kiến mượn ngày: <b>{dayjs().format("DD/MM/YYYY")}</b></Text>
        </div>
      </Modal>
      <FloatingCart />
      <Footer />
    </Layout>
  );
};

export default ExplorePage;