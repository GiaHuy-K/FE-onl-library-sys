/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { UserOutlined, TeamOutlined, SolutionOutlined } from "@ant-design/icons";

interface Props {
  stats: any;
  loading: boolean;
}

const StatCards: React.FC<Props> = ({ stats, loading }) => {
  const total = stats.student + stats.lecturer + stats.staff;
  
  const items = [
    { title: "Tổng định danh", value: total, color: "#1890ff", icon: <TeamOutlined /> },
    { title: "Sinh viên", value: stats.student, color: "#3f8600", icon: <UserOutlined /> },
    { title: "Giảng viên", value: stats.lecturer, color: "#cf1322", icon: <SolutionOutlined /> },
    { title: "Nhân viên", value: stats.staff, color: "#faad14", icon: <UserOutlined /> },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={24} lg={6} key={item.title}>
          <Card bordered={false} hoverable>
            <Statistic
              title={item.title}
              value={item.value}
              valueStyle={{ color: item.color }}
              prefix={item.icon}
              loading={loading}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;