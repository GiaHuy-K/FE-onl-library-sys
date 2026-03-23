/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Row, Col, Typography, Divider } from "antd";
import BaseEntityManager from "../../components/common/BaseEntityManager";
import { categoryService } from "../../services/category.service";
import { authorService } from "../../services/author.service";
import { publisherService } from "../../services/publisher.service";

const { Title } = Typography;

const MasterDataPage: React.FC = () => {
  return (
    <div style={{ padding: "12px" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#FF6E61', fontSize: '24px' }}>Quản lý danh mục hệ thống</Title>
      </div>

      <Divider />

      {/* Chia làm 3 cột, mỗi cột chiếm 8 phần  */}
      <Row gutter={[16, 24]}>
        {/* Cột 1: Thể loại */}
        <Col xs={24} xl={8}>
          <BaseEntityManager 
            title="Thể loại" 
            service={categoryService} 
            idField="categoryId" 
          />
        </Col>

        {/* Cột 2: Tác giả */}
        <Col xs={24} xl={8}>
          <BaseEntityManager 
            title="Tác giả" 
            service={authorService} 
            idField="authorId" 
          />
        </Col>

        {/* Cột 3: Nhà xuất bản */}
        <Col xs={24} xl={8}>
          <BaseEntityManager 
            title="Nhà xuất bản" 
            service={publisherService} 
            idField="publisherId" 
          />
        </Col>
      </Row>
    </div>
  );
};

export default MasterDataPage;