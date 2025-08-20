import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Spin, 
  Alert, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Divider,
  Card 
} from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://edutalks.ru/api/articles/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Статья не найдена');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticle(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке статьи:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          style={{ marginBottom: '20px' }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Назад к списку
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Статья не найдена"
          type="warning"
          style={{ marginBottom: '20px' }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Назад к списку
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px',  margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: '20px' }}
      >
        Назад
      </Button>

      <Card>
        <Title level={1}>{article.title}</Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {article.summary}
          </Text>

          <Space>
            {article.tags?.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>

          {article.createdAt && (
            <Text type="secondary">
              <CalendarOutlined style={{ marginRight: '8px' }} />
              Опубликовано: {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          )}

          <Divider />

          <div 
            dangerouslySetInnerHTML={{ __html: article.bodyHtml }} 
            style={{ 
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default ArticlePage;