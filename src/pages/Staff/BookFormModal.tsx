/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Form, Input, InputNumber, Select, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { authorService } from "../../services/author.service"; 
import { categoryService } from "../../services/category.service";
import { publisherService } from "../../services/publisher.service";

interface Props {
  open: boolean;
  editingBook: any | null;
  onCancel: () => void;
  onSuccess: (values: any, imageFile?: File) => void;
}

const BookFormModal = ({ open, editingBook, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      setDataLoading(true);
      try {
        const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
          authorService.getAll(),
          categoryService.getAll(),
          publisherService.getAll(),
        ]);
        setAuthors(authorsRes || []);
        setCategories(categoriesRes || []);
        setPublishers(publishersRes || []);
      } catch (error) {
        console.error("Lỗi master data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (open) loadMasterData();
  }, [open]);

  // Xử lý dữ liệu khi mở Modal (Thêm/Sửa)
  useEffect(() => {
    if (open) {
      if (editingBook) {
        form.setFieldsValue({
          ...editingBook,
          authorIds: editingBook.authors?.map((a: any) => a.authorId || a.id) || [],
          categoryIds: editingBook.categories?.map((c: any) => c.categoryId || c.id) || [],
          publisherId: editingBook.publisher?.publisherId || editingBook.publisherId
        });

        if (editingBook.coverImg) {
          setFileList([{ url: editingBook.coverImg, name: 'cover.png', status: 'done' }]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, editingBook, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      
      const imageFile = fileList[0]?.originFileObj;
      await onSuccess(values, imageFile);
      
      onCancel(); // Đóng modal sau khi thành công
    } catch (error) {
      console.log("Validate failed:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={editingBook ? "Chỉnh sửa tác phẩm" : "Thêm tác phẩm mới"}
      okText={editingBook ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Đóng"
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitLoading}
      width={650}
      centered
    >
      <Spin spinning={dataLoading}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tên sách!" }]}>
            <Input placeholder="Tên tác phẩm..." />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item name="isbn" label="Mã ISBN" rules={[{ required: true, message: "Nhập mã ISBN!" }]}>
              <Input placeholder="Mã định danh..." />
            </Form.Item>
            <Form.Item name="price" label="Giá bìa (VNĐ)" rules={[{ required: true, message: "Nhập giá!" }]}>
              <InputNumber 
                style={{ width: "100%" }} 
                formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={val => val!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </div>

          <Form.Item name="publisherId" label="Nhà xuất bản" rules={[{ required: true, message: "Chọn NXB!" }]}>
            <Select placeholder="Chọn đơn vị phát hành" showSearch optionFilterProp="children">
              {publishers.map(p => (
                <Select.Option key={p.publisherId || p.id} value={p.publisherId || p.id}>
                  {p.publisherName || p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="authorIds" label="Tác giả" rules={[{ required: true, message: "Chọn ít nhất 1 tác giả!" }]}>
            <Select mode="multiple" placeholder="Người chắp bút..." allowClear>
              {authors.map(a => (
                <Select.Option key={a.authorId || a.id} value={a.authorId || a.id}>
                  {a.fullName || a.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="categoryIds" label="Chủ đề / Thể loại">
            <Select mode="multiple" placeholder="Phân loại..." allowClear>
              {categories.map(c => (
                <Select.Option key={c.categoryId || c.id} value={c.categoryId || c.id}>
                  {c.categoryName || c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
            <Form.Item name="quantity" label="Số lượng kho" initialValue={1}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Hình ảnh minh họa">
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: fl }) => setFileList(fl)}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BookFormModal;