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
  DeleteOutlined,
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
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleImportCSV = async (file: File) => {
    setLoading(true);
    try {
      await bookService.importBooks(file);
      message.success("Đã nạp dữ liệu sách thành công!");
      fetchBooks(); 
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
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
    } catch (error) { setBooks([]); }
    finally { setLoading(false); }
  };

  // Cập nhật
  const handleSaveBook = async (values: any, imageFile?: File) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.bookId, values);
      } else {
        await bookService.createBook(values, imageFile);
      }
      setIsFormOpen(false);
      fetchBooks();
    } catch (error) { console.error(error); }
  };

  const handleUploadCover = async (id: number, file: File) => {
    try {
      const updatedBook = await bookService.uploadBookCover(id, file);
      setBooks((prev) => prev.map((b) => (b.bookId === id ? updatedBook : b)));
    } catch (error) { console.error(error); }
    return false;
  };

  const columns: ColumnsType<any> = [
    {
      title: "Ảnh bìa",
      dataIndex: "coverImg",
      key: "coverImg",
      width: 100,
      render: (text, record) => {
        // Xử lý hiển thị ảnh 
        const isPlaceholder = text?.includes('SearchInventory') || !text;
        const displayImg = isPlaceholder ? "https://placehold.co/50x75?text=No+Cover" : text;
        
        return (
          <Space direction="vertical" align="center" size={2} onClick={(e) => e.stopPropagation()}>
            <img
              src={displayImg}
              alt="cover"
              style={{ width: 45, height: 65, borderRadius: 4, display: "block", objectFit: "cover", border: '1px solid #f0f0f0' }}
            />
            <Upload showUploadList={false} beforeUpload={(file) => handleUploadCover(record.bookId, file)}>
              <Button size="small" icon={<UploadOutlined />} style={{ fontSize: "10px" }}>Đổi ảnh</Button>
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
          <Text type="secondary" style={{ fontSize: '11px' }}>ISBN: {record.isbn}</Text>
        </Space>
      ),
    },
    {
      title: "Phân loại",
      key: "tags",
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <div style={{ maxWidth: '200px' }}>
            {record.authorNames?.map((name: string) => <Tag color="blue" key={name}>{name}</Tag>)}
          </div>
          <div>
            {record.categoryNames?.map((name: string) => <Tag color="cyan" key={name}>{name}</Tag>)}
          </div>
        </Space>
      ),
    },
    {
      title: "Giá & Kho",
      key: "stock",
      align: "right",
      render: (_, record) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold' }}>{record.price?.toLocaleString()}đ</div>
          <Tag color={record.quantity > 5 ? "green" : "red"} style={{ marginRight: 0, marginTop: 4 }}>Kho: {record.quantity}</Tag>
        </div>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Xem chi tiết"><Button type="text" icon={<EyeOutlined />} onClick={() => { setViewingBookId(record.bookId); setIsDetailOpen(true); }} /></Tooltip>
          <Tooltip title="Chỉnh sửa"><Button type="text" icon={<EditOutlined />} onClick={() => { setEditingBook(record); setIsFormOpen(true); }} /></Tooltip>
          <Popconfirm title="Xóa sách?" onConfirm={() => bookService.deleteBook(record.bookId).then(fetchBooks)} okText="Xóa" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Title level={2}>📚 Quản lý Sách</Title>
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
            onClick={() => { setEditingBook(null); setIsFormOpen(true); }}
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
        pagination={{ pageSize: 8, showTotal: (total) => `Tổng cộng ${total} cuốn sách` }}
        onRow={(record) => ({
          onClick: () => { setViewingBookId(record.bookId); setIsDetailOpen(true); },
          style: { cursor: 'pointer' }
        })}
      />

      
      <BookFormModal 
        open={isFormOpen} 
        editingBook={editingBook} 
        onCancel={() => setIsFormOpen(false)} 
        onSuccess={(values, file) => handleSaveBook(values, file)} 
      />
      
      <BookDetailModal open={isDetailOpen} bookId={viewingBookId} onCancel={() => setIsDetailOpen(false)} />
    </div>
  );
}

export default BookManagement;