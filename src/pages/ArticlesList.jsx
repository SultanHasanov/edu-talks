import React, { useState, useEffect } from "react";
import { List, Card, Tag, Spin, Alert, Typography, Space, Button, Avatar, Divider, Input, Select, Row, Col } from "antd";
import { EyeOutlined, SearchOutlined, CalendarOutlined, UserOutlined, TagOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Use real navigation function
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedTag]);

  // Функция для расчета времени чтения
const calculateReadTime = (article) => {
  const WORDS_PER_MINUTE = 200;
  const textToCount = `${article.title || ''} ${article.summary || ''} ${article.content || ''}`;
  const wordCount = textToCount.trim().split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, readTimeMinutes);
};

// Обновленный fetchArticles
const fetchArticles = async () => {
  try {
    setLoading(true);
    const response = await fetch("https://edutalks.ru/api/articles?published=true");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let articlesData = data.data || [];

    // Добавляем расчет времени чтения
    articlesData = articlesData.map(article => ({
      ...article,
      readTime: calculateReadTime(article)
    }));

    setArticles(articlesData);
  } catch (err) {
    setError(err.message);
    console.error("Ошибка при загрузке статей:", err);
  } finally {
    setLoading(false);
  }
};

  const filterArticles = () => {
    let filtered = articles.filter(article => article.isPublished !== false);
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(article =>
        article.tags?.includes(selectedTag)
      );
    }
    
    setFilteredArticles(filtered);
  };

  const getAllTags = () => {
    const allTags = articles.flatMap(article => article.tags || []);
    return [...new Set(allTags)];
  };

  const handleArticleClick = (articleId) => {
    navigate(`/zavuch/${articleId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTagColor = (tag) => {
    const colors = {
      'образование': 'blue',
      'технологии': 'green',
      'методика': 'orange',
      'психология': 'purple',
      'педагогика': 'cyan',
      'мотивация': 'pink',
      'интерактив': 'lime',
      'оборудование': 'volcano',
      'подростки': 'magenta',
      'поведение': 'gold'
    };
    return colors[tag] || 'default';
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "400px",
        flexDirection: "column"
      }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, color: '#666' }}>Загружаем статьи...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки"
        description={`Не удалось загрузить статьи: ${error}`}
        type="error"
        showIcon
        style={{ margin: "20px", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}
        action={
          <Button size="small" onClick={fetchArticles}>
            Попробовать снова
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ 
      padding: "24px", 
      maxWidth: 1400, 
      margin: "0 auto",
      background: "#f5f5f5",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div style={{ 
        background: "white", 
        padding: "32px", 
        borderRadius: "12px", 
        marginBottom: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
      }}>
        <Title level={1} style={{ margin: 0, color: "#1890ff" }}>
          📚 База знаний
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Изучайте лучшие материалы по педагогике и образованию
        </Text>
        
        <Divider />
        
        {/* Search and Filters */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12} lg={8}>
            <Search
              placeholder="Поиск по статьям..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Select
              placeholder="Фильтр по тегам"
              allowClear
              size="large"
              style={{ width: "100%" }}
              value={selectedTag}
              onChange={(value) => setSelectedTag(value)}
              suffixIcon={<TagOutlined />}
            >
              {getAllTags().map(tag => (
                <Select.Option key={tag} value={tag}>
                  <Tag color={getTagColor(tag)} style={{ margin: 0 }}>
                    {tag}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Text type="secondary">
              Найдено статей: <strong>{filteredArticles.length}</strong>
            </Text>
          </Col>
        </Row>
      </div>

      {/* Articles Grid */}
      <Row gutter={[24, 24]}>
        {filteredArticles.map((article) => (
          <Col xs={24} md={12} lg={8} key={article.id}>
            <Card
              hoverable
              style={{ 
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              bodyStyle={{ padding: "24px" }}
              onClick={() => handleArticleClick(article.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              {/* Article Header */}
              <div style={{ marginBottom: 16 }}>
                <Title level={4} style={{ 
                  margin: 0, 
                  marginBottom: 8,
                  lineHeight: 1.3,
                  color: "#262626"
                }}>
                  {article.title}
                </Title>
                
                {/* Meta Info */}
                <Space style={{ marginBottom: 12 }}>
                  {article.author && (
                    <>
                      <Avatar icon={<UserOutlined />} size="small" />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {article.author}
                      </Text>
                      <Divider type="vertical" />
                    </>
                  )}
                  <CalendarOutlined style={{ fontSize: 12, color: '#999' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(article.createdAt)}
                  </Text>
                </Space>
              </div>

              {/* Article Content */}
              <Paragraph 
                ellipsis={{ rows: 3, expandable: false }}
                style={{ 
                  marginBottom: 16,
                  color: "#595959",
                  lineHeight: 1.6
                }}
              >
                {article.summary}
              </Paragraph>

              {/* Tags */}
              <div style={{ marginBottom: 16 }}>
                <Space wrap>
                  {article.tags?.slice(0, 3).map((tag, index) => (
                    <Tag 
                      key={index} 
                      color={getTagColor(tag)}
                      style={{ 
                        margin: "2px",
                        borderRadius: "6px",
                        fontSize: "11px"
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {article.tags?.length > 3 && (
                    <Tag style={{ fontSize: "11px" }}>
                      +{article.tags.length - 3}
                    </Tag>
                  )}
                </Space>
              </div>

              {/* Footer */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                paddingTop: 12,
                borderTop: "1px solid #f0f0f0"
              }}>
                <Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    👀 {article.views?.toLocaleString()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
  ⏱️ {article.readTime} мин {/* Теперь это поле будет заполнено */}
</Text>
                </Space>
                
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(article.id);
                  }}
                  style={{ borderRadius: "6px" }}
                >
                  Читать
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {filteredArticles.length === 0 && !loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          background: "white",
          borderRadius: "12px",
          marginTop: "24px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📖</div>
          <Title level={3} type="secondary">
            {searchTerm || selectedTag ? 'Статьи не найдены' : 'Пока нет статей'}
          </Title>
          <Text type="secondary">
            {searchTerm || selectedTag 
              ? 'Попробуйте изменить параметры поиска' 
              : 'Скоро здесь появятся интересные материалы'
            }
          </Text>
          {(searchTerm || selectedTag) && (
            <div style={{ marginTop: 16 }}>
              <Button onClick={() => { setSearchTerm(''); setSelectedTag(''); }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesList;