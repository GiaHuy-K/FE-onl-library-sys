import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f8f9fa' 
    }}>
      <Result
        status="403"
        title={<span style={{ color: '#FF6E61', fontWeight: 800, fontSize: '2rem' }}>403</span>}
        subTitle={
          <div style={{ fontSize: '1.1rem', color: '#555' }}>
            <p>Rất tiếc, bạn không có quyền truy cập vào khu vực này.</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
              "Mỗi cuốn sách có một vị trí, và mỗi độc giả cũng vậy."
            </p>
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
            >
              Quay lại trang trước
            </Button>
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              style={{ backgroundColor: '#FF6E61', borderColor: '#FF6E61' }}
              onClick={() => navigate('/')}
            >
              Về Trang Chủ
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Unauthorized;