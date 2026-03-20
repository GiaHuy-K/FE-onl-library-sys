/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Spin } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  data: any[];
  loading: boolean;
}

const UserDistribution: React.FC<Props> = ({ data, loading }) => (
  <Card 
    title="Phân bổ cấu trúc người dùng" 
    variant="borderless" 
    styles={{ body: { padding: "0 24px 20px 24px" } }} 
    style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
  >
    {/* Thêm minHeight và minWidth để Recharts tính toán đúng kích thước ban đầu */}
    <div style={{ width: '100%', height: 320, minWidth: 0, position: 'relative' }}>
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <Spin size="large" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              // Check nếu data rỗng thì không render Pie để tránh lỗi
              data={data || []}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0} // Thêm cái này để chart mượt hơn
              animationDuration={800}
            >
              {/* Kiểm tra data trước khi map Cell */}
              {data?.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || '#ccc'} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
            />
            <Legend 
              iconType="circle" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: 10 }} 
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </Card>
);

export default UserDistribution;