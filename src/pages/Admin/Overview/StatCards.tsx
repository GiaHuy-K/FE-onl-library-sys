/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

interface Props {
  stats: any;
  loading: boolean;
}

const StatCards: React.FC<Props> = ({ stats, loading }) => {
  // Thêm giá trị mặc định 0 để tránh lỗi NaN nếu stats bị undefined
  const student = stats?.student || 0;
  const lecturer = stats?.lecturer || 0;
  const staff = stats?.staff || 0;
  const total = student + lecturer + staff;

  const items = [
    {
      title: "Tổng định danh",
      value: total,
      color: "#1890ff",
      icon: <TeamOutlined />,
    },
    {
      title: "Sinh viên",
      value: student,
      color: "#3f8600",
      icon: <UserOutlined />,
    },
    {
      title: "Giảng viên",
      value: lecturer,
      color: "#cf1322",
      icon: <SolutionOutlined />,
    },
    {
      title: "Nhân viên",
      value: staff,
      color: "#faad14",
      icon: <UserOutlined />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={24} lg={6} key={item.title}>
          <Card variant="borderless" hoverable style={{ borderRadius: "8px" }}>
            <Statistic
              title={item.title}
              value={item.value}
              styles={{
                content: { color: item.color, fontWeight: "bold" },
              }}
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
