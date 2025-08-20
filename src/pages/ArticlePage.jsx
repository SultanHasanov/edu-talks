import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Spin, 
  Alert, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Divider,
  Card,
  Modal
} from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, ExportOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [externalLinkModal, setExternalLinkModal] = useState({
    visible: false,
    url: ''
  });
  const contentRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Обработчик кликов по ссылкам после рендеринга контента
  useEffect(() => {
    const handleContentLinks = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        // Проверяем, является ли ссылка внешней
        const isExternal = link.href.startsWith('http') && 
                          !link.href.includes('edutalks.ru') &&
                          !link.href.includes('localhost');
        
        if (isExternal) {
          e.preventDefault();
          e.stopPropagation();
          setExternalLinkModal({
            visible: true,
            url: link.href
          });
          return false;
        }
      }
    };

    // Добавляем обработчик к контейнеру с контентом
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('click', handleContentLinks);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleContentLinks);
      }
    };
  }, [article]); // Зависимость от article, чтобы обработчик обновлялся при новом контенте

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

  const handleExternalLinkConfirm = () => {
    window.open(externalLinkModal.url, '_blank', 'noopener,noreferrer');
    setExternalLinkModal({ visible: false, url: '' });
  };

  const handleExternalLinkCancel = () => {
    setExternalLinkModal({ visible: false, url: '' });
  };

  // Функция для обработки HTML контента - добавляет target="_blank" к внешним ссылкам
  const processHtmlContent = (html) => {
    if (!html) return html;
    
    return html.replace(
      /<a\s+(?:[^>]*?\s+)?href=(["'])(http[^"']+)\1[^>]*>/gi, 
      (match, quote, href) => {
        if (!href.includes('edutalks.ru') && !href.includes('localhost')) {
          // Добавляем target="_blank" и rel="noopener noreferrer" к внешним ссылкам
          if (match.includes('target=')) {
            return match.replace(/target=["'][^"']*["']/, 'target="_blank"');
          } else {
            return match.replace('>', ' target="_blank" rel="noopener noreferrer">');
          }
        }
        return match;
      }
    );
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
    <div style={{ padding: '20px', margin: '0 auto' }}>
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
            ref={contentRef}
            dangerouslySetInnerHTML={{ 
              __html: processHtmlContent(article.bodyHtml) 
            }} 
            style={{ 
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          />
        </Space>
      </Card>

      {/* Модальное окно для внешних ссылок */}
      <Modal
        open={externalLinkModal.visible}
        title={
          <Space>
            <ExportOutlined style={{ color: '#faad14' }} />
            Внешняя ссылка
          </Space>
        }
        onOk={handleExternalLinkConfirm}
        onCancel={handleExternalLinkCancel}
        okText="Перейти"
        cancelText="Отмена"
        okButtonProps={{
          icon: <ExportOutlined />,
          style: { background: '#1890ff', borderColor: '#1890ff' }
        }}
        width={500}
        centered
      >
        <div style={{ lineHeight: '1.6' }}>
          <p>Вы собираетесь перейти по внешней ссылке:</p>
          <Text 
            code 
            style={{ 
              fontSize: '12px', 
              wordBreak: 'break-all', 
              margin: '8px 0', 
              display: 'block',
              background: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            {externalLinkModal.url}
          </Text>
          <p style={{ color: '#ff4d4f', margin: 0 }}>
            <strong>Внимание:</strong> Это внешний сайт. Будьте осторожны при вводе личных данных.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ArticlePage;