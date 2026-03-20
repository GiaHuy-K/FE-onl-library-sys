/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Typography, Tag, Divider, Progress, Tooltip, Flex } from "antd";

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
  roleDetails: RoleDetail[];
  loading: boolean;
}

const SystemStatus: React.FC<Props> = ({ stats, roleDetails, loading }) => {
  const activeRate = stats?.total > 0 
    ? parseFloat(((stats.active / stats.total) * 100).toFixed(1)) 
    : 0;

  return (
    <Card 
      title="Trạng thái hệ thống" 
      variant="borderless" 
      loading={loading}
      styles={{ body: { padding: "20px" } }} 
      style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
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

      {/* Phần 2: Thay thế List component bị deprecated bằng Flex và map */}
      <Flex vertical gap="middle">
        {roleDetails?.map((item, index) => (
          <div key={item.name || index}>
            <Flex justify="space-between" align="flex-end" style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: '12px' }}>{item.name}</Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {item.active}/{item.total} Active
              </Text>
            </Flex>
            
            <Tooltip title={`Inactive: ${item.inactive}`}>
              <Progress 
                percent={item.rate} 
                size="small" 
                strokeColor={item.rate > 80 ? '#52c41a' : '#faad14'} 
                showInfo={false}
              />
            </Tooltip>
          </div>
        ))}
        
        {/* Trường hợp roleDetails rỗng */}
        {(!roleDetails || roleDetails.length === 0) && !loading && (
          <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
            Chưa có dữ liệu chi tiết
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default SystemStatus;