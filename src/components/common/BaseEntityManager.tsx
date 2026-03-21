/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, Upload, Switch, Typography, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Props {
  title: string;
  service: any;
  idField: string;
}

const BaseEntityManager: React.FC<Props> = ({ title, service, idField }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await service.getAll();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Hàm đổi trạng thái nhanh bằng Switch
  const handleToggleStatus = async (record: any, checked: boolean) => {
    try {
      const newStatus = checked ? "ACTIVE" : "INACTIVE";
      await service.update(record[idField], { ...record, status: newStatus });
      loadData();
    } catch (error) {
      // Service đã toast lỗi
    }
  };

  const columns = [
    { 
      title: "Tên", 
      dataIndex: "name", 
      key: "name",
      ellipsis: true,
    },
    {
      title: "Thao tác", 
      key: "action",
      width: 120, // Tăng nhẹ width để đủ chỗ cho 3 nút
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* Nút Bật/Tắt - Chỉ hiện nếu KHÔNG PHẢI Tác giả */}
          {idField !== 'authorId' && (
            <Tooltip title={record.status === 'ACTIVE' ? "Đang bật" : "Đang tắt"}>
              <Switch 
                size="small" 
                checked={record.status === "ACTIVE"} 
                onChange={(checked) => handleToggleStatus(record, checked)}
              />
            </Tooltip>
          )}

          <Button 
            size="small" 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      background: '#fff', 
      padding: '16px', 
      borderRadius: '12px', 
      border: '1px solid #f0f0f0', 
      height: '100%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text strong style={{ fontSize: 15, color: '#262626' }}>{title}</Text>
        <Space size={4}>
          <Upload customRequest={({file}: any) => service.importExcel(file).then(loadData)} showUploadList={false}>
            <Tooltip title="Import Excel">
              <Button size="small" type="text" icon={<UploadOutlined />} />
            </Tooltip>
          </Upload>
          <Button 
            size="small" 
            type="primary" 
            shape="circle" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setIsModalOpen(true);
            }} 
          />
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey={idField} 
        loading={loading} 
        size="small" 
        pagination={{ pageSize: 6, simple: true }}
      />

      <Modal 
        title={editingItem ? `Sửa ${title}` : `Thêm ${title}`} 
        open={isModalOpen} 
        onOk={() => form.submit()} 
        onCancel={() => setIsModalOpen(false)}
        width={320}
      >
        <Form form={form} layout="vertical" onFinish={(v) => {
          const action = editingItem ? service.update(editingItem[idField], v) : service.create(v);
          action.then(() => { setIsModalOpen(false); loadData(); });
        }}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
          {idField !== 'authorId' && (
            <Form.Item name="status" label="Trạng thái" initialValue="ACTIVE">
              <Select options={[{ value: "ACTIVE", label: "Hoạt động" }, { value: "INACTIVE", label: "Khóa" }]} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default BaseEntityManager;