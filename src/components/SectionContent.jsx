// components/SectionContent.jsx
import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

const SectionContent = ({ section }) => {
  if (!section) {
    return (
      <Card>
        <Paragraph type="secondary">Секция не найдена</Paragraph>
      </Card>
    );
  }

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        
        {section.description && (
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
            {section.description}
          </Paragraph>
        )}

        
      </Space>
    </Card>
  );
};

export default SectionContent;