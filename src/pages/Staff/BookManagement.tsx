/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  Upload,
  Popconfirm,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  LockOutlined, // Thêm icon Khóa
  UnlockOutlined, // Thêm icon Mở khóa
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { bookService } from "../../services/book.service";
import BookFormModal from "./BookFormModal";
import BookDetailModal from "../../components/common/BookDetailModal";

const { Title, Text } = Typography;

function BookManagement() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [viewingBookId, setViewingBookId] = useState<number | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // HÀM TOGGLE TRẠNG THÁI (THAY CHO DELETE)
const handleToggleStatus = async (record: any) => {
  const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const updateData = {
    status: newStatus
  };

  try {
    setLoading(true);
    await bookService.updateBook(record.bookId, updateData);
    message.success(`Đã ${newStatus === "ACTIVE" ? "kích hoạt" : "khóa"} sách thành công!`);
    fetchBooks(); 
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    message.error("Không thể cập nhật trạng thái sách!");
  } finally {
    setLoading(false);
  }
};

  const handleImportCSV = async (file: File) => {
    setLoading(true);
    try {
      await bookService.importBooks(file);
      message.success("Đã nạp dữ liệu sách thành công!");
      fetchBooks();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleSearch = async (value: string) => {
    const term = value.trim();
    if (!term) return fetchBooks();
    setLoading(true);
    try {
      if (/^[0-9-]+$/.test(term) && term.length >= 10) {
        const data = await bookService.getBookByISBN(term);
        setBooks(data ? [data] : []);
      } else {
        const data = await bookService.searchBooks(term);
        setBooks(data);
      }
    } catch (error) {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (values: any, imageFile?: File) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.bookId, values);
        message.success("Cập nhật sách thành công!");
      } else {
        await bookService.createBook(values, imageFile);
        message.success("Thêm sách mới thành công!");
      }
      setIsFormOpen(false);
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadCover = async (id: number, file: File) => {
    try {
      const updatedBook = await bookService.uploadBookCover(id, file);
      setBooks((prev) => prev.map((b) => (b.bookId === id ? updatedBook : b)));
      message.success("Cập nhật ảnh bìa thành công!");
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const columns: ColumnsType<any> = [
    {
      title: "Ảnh bìa",
      dataIndex: "coverImg",
      key: "coverImg",
      width: 100,
      render: (text, record) => {
        const isPlaceholder = text?.includes("SearchInventory") || !text;
        const displayImg = isPlaceholder
          ? "https://placehold.co/50x75?text=No+Cover"
          : text;

        return (
          <Space
            direction="vertical"
            align="center"
            size={2}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImg}
              alt="cover"
              style={{
                width: 45,
                height: 65,
                borderRadius: 4,
                display: "block",
                objectFit: "cover",
                border: "1px solid #f0f0f0",
              }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={(file) => handleUploadCover(record.bookId, file)}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                style={{ fontSize: "10px" }}
              >
                Đổi ảnh
              </Button>
            </Upload>
          </Space>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <b style={{ color: "#1677ff" }}>{text}</b>
          <Text type="secondary" style={{ fontSize: "11px" }}>
            ISBN: {record.isbn}
          </Text>
        </Space>
      ),
    },
    {
      title: "Phân loại",
      key: "tags",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <div style={{ maxWidth: "200px" }}>
            {record.authorNames?.map((name: string) => (
              <Tag color="blue" key={name}>
                {name}
              </Tag>
            ))}
          </div>
          <div>
            {record.categoryNames?.map((name: string) => (
              <Tag color="cyan" key={name}>
                {name}
              </Tag>
            ))}
          </div>
        </Space>
      ),
    },
    {
      title: "Giá & Kho",
      key: "stock",
      align: "right",
      render: (_, record) => (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold" }}>
            {record.price?.toLocaleString()}đ
          </div>
          <Tag
            color={record.quantity > 5 ? "green" : "red"}
            style={{ marginRight: 0, marginTop: 4 }}
          >
            Kho: {record.quantity}
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        let color = "default";
        let text = "KHÔNG XÁC ĐỊNH";

        if (status === "ACTIVE") {
          color = "green";
          text = "ĐANG HOẠT ĐỘNG";
        } else if (status === "INACTIVE" || status === "HIDDEN") {
          color = "red";
          text = "ĐANG KHÓA";
        } else if (status === "OUT_OF_STOCK") {
          color = "orange";
          text = "HẾT HÀNG";
        }

        return (
          <Tag color={color} style={{ fontWeight: 500, borderRadius: "4px" }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setViewingBookId(record.bookId);
                setIsDetailOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingBook(record);
                setIsFormOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title={record.status === "ACTIVE" ? "Khóa cuốn sách này?" : "Mở khóa cuốn sách này?"}
            onConfirm={() => handleToggleStatus(record)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ danger: record.status === "ACTIVE" }}
          >
            <Tooltip title={record.status === "ACTIVE" ? "Khóa sách" : "Mở khóa sách"}>
              <Button 
                type="text" 
                icon={record.status === "ACTIVE" ? <LockOutlined /> : <UnlockOutlined />} 
                style={{ color: record.status === "ACTIVE" ? "#ff4d4f" : "#52c41a" }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title
          level={2}
          style={{ margin: 0, color: "#FF6E61", fontSize: "24px" }}
        >
          📚 Quản lý sách
        </Title>
        <Space>
          <Upload
            accept=".csv"
            showUploadList={false}
            beforeUpload={handleImportCSV}
          >
            <Button icon={<FileExcelOutlined />}>Import CSV/Excel</Button>
          </Upload>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            onClick={() => {
              setEditingBook(null);
              setIsFormOpen(true);
            }}
          >
            Thêm sách mới
          </Button>
        </Space>
      </div>

      <Input.Search
        placeholder="Tìm theo tiêu đề, tác giả, ISBN..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={handleSearch}
        style={{ width: 500, marginBottom: 20 }}
      />

      <Table
        columns={columns}
        dataSource={books}
        rowKey="bookId"
        loading={loading}
        bordered
        pagination={{
          pageSize: 8,
          showTotal: (total) => `Tổng cộng ${total} cuốn sách`,
        }}
        onRow={(record) => ({
          onClick: () => {
            setViewingBookId(record.bookId);
            setIsDetailOpen(true);
          },
          style: { cursor: "pointer" },
        })}
      />

      <BookFormModal
        open={isFormOpen}
        editingBook={editingBook}
        onCancel={() => setIsFormOpen(false)}
        onSuccess={(values, file) => handleSaveBook(values, file)}
      />

      <BookDetailModal
        open={isDetailOpen}
        bookId={viewingBookId}
        onCancel={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

export default BookManagement;