/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Spin } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  data: any[];
  loading: boolean;
}

const UserDistribution: React.FC<Props> = ({ data, loading }) => (
  <Card title="Phân bổ cấu trúc người dùng" bordered={false} bodyStyle={{ padding: "0 24px 20px 24px" }}>
    <div style={{ width: '100%', height: 320 }}>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: 120 }}><Spin /></div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
            <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ bottom: 0 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </Card>
);

export default UserDistribution;