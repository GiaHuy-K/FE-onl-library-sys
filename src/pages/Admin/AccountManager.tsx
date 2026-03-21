/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Upload,
  Card,
  Space,
  Typography,
  Tag,
  Breadcrumb,
  Switch,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { accountService } from "../../services/account.service";
import AccountDetailModal from "../Admin/AccountDetailModal";

const { Title, Text } = Typography;

const AccountManager: React.FC = () => {
  const currentPath = window.location.pathname.split("/").pop() || "STUDENT";
  const userType = currentPath.toUpperCase() as
    | "STUDENT"
    | "LECTURER"
    | "STAFF";

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const openDetail = (code: string) => {
    setSelectedCode(code);
    setIsDetailModalOpen(true);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await accountService.getAccounts(userType);
      // Giả sử BE trả về array trực tiếp hoặc bọc trong data.content
      setAccounts(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [userType]);

  const handleStatusChange = async (record: any, checked: boolean) => {
    const newStatus = checked ? "ACTIVE" : "INACTIVE";
    const code = record.studentCode || record.lecturerCode || record.staffCode;

    try {
      setLoading(true);
      await accountService.changeStatus(code, userType, newStatus);
      await fetchAccounts();
    } catch (error) {
      console.error("Change status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      setLoading(true);
      try {
        const res = await accountService.importAccounts(userType, file as File);
        if (!res || res.status === "ERROR") {
          onError?.(new Error("Dữ liệu không hợp lệ"));
        } else {
          onSuccess?.(res);
          fetchAccounts();
        }
      } catch (err) {
        onError?.(err as any);
      } finally {
        setLoading(false);
      }
    },
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center" as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title:
        userType === "STUDENT"
          ? "MSSV"
          : userType === "LECTURER"
            ? "Mã GV"
            : "Mã NV",
      dataIndex:
        userType === "STUDENT"
          ? "studentCode"
          : userType === "LECTURER"
            ? "lecturerCode"
            : "staffCode",
      key: "code",
      render: (text: string) => (
        <Tag color="cyan" icon={<IdcardOutlined />}>
          {text || "Chưa có mã"}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <MailOutlined style={{ color: "#1890ff" }} />
          <a href={`mailto:${text}`}>{text}</a>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string, record: any) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Tooltip
            title={status === "ACTIVE" ? "Đang hoạt động" : "Đang bị khóa"}
          >
            <Switch
              checked={status === "ACTIVE"}
              loading={loading}
              onChange={(checked) => handleStatusChange(record, checked)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: "Admin" },
          { title: "Quản lý người dùng" },
          { title: userType },
        ]}
      />

      <Card
        variant="borderless"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Danh sách{" "}
              {userType === "STUDENT"
                ? "Sinh Viên"
                : userType === "LECTURER"
                  ? "Giảng Viên"
                  : "Nhân Viên"}
            </Title>
            <Text type="secondary">
              Cập nhật và quản lý tài khoản người dùng LIB-SYS
            </Text>
          </div>

          <Upload {...uploadProps}>
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              loading={loading}
            >
              Import CSV
            </Button>
          </Upload>
        </div>

        <Table
          columns={columns}
          dataSource={accounts.map((a, i) => ({
            ...a,
            key: a.accountId || a.studentCode || a.lecturerCode || i,
          }))}
          loading={loading}
          bordered
          onRow={(record) => ({
            onClick: () => {
              const code =
                record.studentCode || record.lecturerCode || record.staffCode;
              if (code) openDetail(code);
            },
            style: { cursor: "pointer" },
          })}
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng số ${total} tài khoản`,
          }}
        />
      </Card>

      <AccountDetailModal
        isModalOpen={isDetailModalOpen}
        handleCancel={() => setIsDetailModalOpen(false)}
        code={selectedCode}
        userType={userType}
      />
    </div>
  );
};

export default AccountManager;
