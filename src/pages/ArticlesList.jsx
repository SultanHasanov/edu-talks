import React, { useState, useEffect } from "react";
import { List, Card, Tag, Spin, Alert, Typography, Space, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://edutalks.ru/api/articles?published=true");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Ошибка при загрузке статей:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/zavuch/${articleId}`);
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка"
        description={`Не удалось загрузить статьи: ${error}`}
        type="error"
        style={{ margin: "20px" }}
      />
    );
  }

const publishedArticles = articles.filter(article => article.isPublished !== false);

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2}>Все статьи</Title>

      <List
        dataSource={articles}
        renderItem={(article) => (
          <List.Item>
            <Card
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => handleArticleClick(article.id)}
              hoverable
              actions={[
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(article.id);
                  }}
                >
                  Читать
                </Button>,
              ]}
            >
              <Card.Meta
                title={article.title}
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text type="secondary" ellipsis>
                      {article.summary && article.summary.length > 70
                        ? `${article.summary.substring(0, 70)} ...`
                        : article.summary}
                    </Text>
                    <div>
                      {article.tags?.map((tag, index) => (
                        <Tag key={index} color="blue" style={{ margin: "2px" }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    {article.createdAt && (
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Опубликовано:{" "}
                        {new Date(article.createdAt).toLocaleDateString()}
                      </Text>
                    )}
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
        locale={{ emptyText: "Статьи не найдены" }}
      />
    </div>
  );
};

export default ArticlesList;
