import React from "react";
import { Card, Typography, Tag, Divider, Progress, List, Tooltip } from "antd";

const { Title, Text } = Typography;

interface RoleDetail {
  name: string;
  total: number;
  active: number;
  inactive: number;
  rate: number;
}

interface Props {
  stats: {
    active: number;
    total: number;
  };
  roleDetails: RoleDetail[]; // Thêm prop dữ liệu chi tiết role
  loading: boolean;
}

const SystemStatus: React.FC<Props> = ({ stats, roleDetails, loading }) => {
  const activeRate = stats?.total > 0 
    ? parseFloat(((stats.active / stats.total) * 100).toFixed(1)) 
    : 0;

  return (
    <Card 
      title="Trạng thái hệ thống" 
      bordered={false} 
      loading={loading}
      bodyStyle={{ padding: "20px" }}
    >
      {/* Phần 1: Tổng quan (Số to) */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Text strong type="secondary">Tỷ lệ hoạt động tổng thể</Text>
        <Title level={2} style={{ margin: '4px 0', color: '#13c2c2' }}>
          {activeRate}%
        </Title>
        <Tag color={activeRate >= 80 ? "cyan" : "gold"}>
          {activeRate >= 80 ? "Rất tốt" : "Ổn định"}
        </Tag>
      </div>

      <Divider style={{ margin: '16px 0' }}>Chi tiết từng nhóm</Divider>

      {/* Phần 2: List biểu đồ hàng ngang cho từng Role */}
      <List
        dataSource={roleDetails}
        renderItem={(item) => (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text strong style={{ fontSize: '12px' }}>{item.name}</Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {item.active}/{item.total} Active
              </Text>
            </div>
            <Tooltip title={`Inactive: ${item.inactive}`}>
              <Progress 
                percent={item.rate} 
                size="small" 
                strokeColor={item.rate > 80 ? '#52c41a' : '#faad14'} 
                showInfo={false}
              />
            </Tooltip>
          </div>
        )}
      />
    </Card>
  );
};

export default SystemStatus;