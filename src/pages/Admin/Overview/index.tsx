/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Typography, Row, Col } from "antd";
import { accountService } from "../../../services/account.service";
import StatCards from "./StatCards";
import UserDistribution from "./UserDistribution";
import SystemStatus from './SystemStatus';

const { Title, Text } = Typography;

const OverviewPage: React.FC = () => {
  const [data, setData] = useState({ student: 0, lecturer: 0, staff: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Thêm State lưu tổng quát và chi tiết từng nhóm
  const [systemStats, setSystemStats] = useState({ active: 0, total: 0 });
  const [roleDetails, setRoleDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [s, l, st] = await Promise.all([
          accountService.getAccounts("STUDENT"),
          accountService.getAccounts("LECTURER"),
          accountService.getAccounts("STAFF"),
        ]);

        // Hàm hỗ trợ tính toán nhanh cho từng nhóm
        const calc = (users: any[], label: string) => {
          const total = users.length;
          const active = users.filter(u => u.status === "ACTIVE").length;
          return {
            name: label,
            total,
            active,
            inactive: total - active,
            rate: total > 0 ? Math.round((active / total) * 100) : 0
          };
        };

        const studentData = calc(s, "Sinh viên");
        const lecturerData = calc(l, "Giảng viên");
        const staffData = calc(st, "Nhân viên");

        // 2. Cập nhật dữ liệu hiển thị
        setData({ student: s.length, lecturer: l.length, staff: st.length });
        
        // 3. Cập nhật dữ liệu cho SystemStatus (tổng hợp & chi tiết)
        const totalAll = studentData.total + lecturerData.total + staffData.total;
        const activeAll = studentData.active + lecturerData.active + staffData.active;
        
        setSystemStats({ active: activeAll, total: totalAll });
        setRoleDetails([studentData, lecturerData, staffData]);

        setChartData([
          { name: "Sinh viên", value: s.length, color: "#3f8600" },
          { name: "Giảng viên", value: l.length, color: "#cf1322" },
          { name: "Nhân viên", value: st.length, color: "#faad14" },
        ]);
      } catch (error) {
         console.error("Lỗi fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Tổng quan người dùng</Title>
        <Text type="secondary">Phân tích hệ thống LIB-SYS thời gian thực</Text>
      </div>

      <StatCards stats={data} loading={loading} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <UserDistribution data={chartData} loading={loading} />
        </Col>
        <Col xs={24} lg={8}>
          {/* Truyền cả stats tổng và chi tiết từng role xuống */}
          <SystemStatus 
            stats={systemStats} 
            roleDetails={roleDetails} 
            loading={loading} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;