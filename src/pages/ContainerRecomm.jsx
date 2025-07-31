import React, { useState, useEffect, useMemo } from "react";
import { Box, Container, CircularProgress } from "@mui/material";
import { Card, Pagination, Select, Space, Tag, Typography, Alert, Badge } from "antd";
import { CalendarOutlined, FireOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";
import '../App.css'

const { Option } = Select;
const { Meta } = Card;
const { Title, Text } = Typography;
const { Ribbon } = Badge;

const ContainerRecomm = () => {
  const navigate = useNavigate();
  const [serverNews, setServerNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://edutalks.ru/api/news?page=${page}&page_size=${pageSize}`
        );
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const result = await response.json();
        setServerNews(result.data.data || []);
        setTotal(result.data.total || 0);
      } catch (err) {
        setError(err.message);
        console.error("Ошибка при загрузке новостей:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, pageSize]);

  const blocks = useMemo(() => {
    return serverNews.map((newsItem) => ({
      id: newsItem.id,
      title: newsItem.title,
      date: new Date(newsItem.created_at).toLocaleDateString(),
      type: newsItem.sticker,
      content: newsItem.content,
      color: newsItem.color,
      image: newsItem.image_url,
    }));
  }, [serverNews]);

  const handleBlockClick = (id) => {
    navigate(`/recomm/${id}`);
  };

 const BlockCard = ({ block }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Ribbon
      text={block.type}
      color={block.color}
      style={{
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s ease',
        }}
      >
        <Card
          hoverable
          onClick={() => handleBlockClick(block.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
            border: isHovered ? '1px solid #1890ff' : '1px solid #f0f0f0',
            boxShadow: isHovered 
              ? '0 6px 16px rgba(0, 0, 0, 0.12)' 
              : '0 4px 12px rgba(0, 0, 0, 0.08)',
          }}
          cover={
            <div
              style={{
                height: 150,
                backgroundImage: `url(${block.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.3s',
              }}
            />
          }
        >
          <Meta
            title={
              <Title 
                level={5} 
                style={{ 
                  marginBottom: 8,
                  color: isHovered ? '#1890ff' : 'inherit',
                }}
              >
                {block.title}
              </Title>
            }
            description={
              <Space>
                <CalendarOutlined style={{ color: '#888' }} />
                <Text type="secondary">{block.date}</Text>
                {block.type.toLowerCase().includes('важно') && (
                  <Tag icon={<FireOutlined />} color="red">
                    Важно
                  </Tag>
                )}
              </Space>
            }
          />
        </Card>
      </div>
    </Ribbon>
  );
};
  if (loading) {
    return (
      <Container
        maxWidth="xl"
        style={{
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" style={{ padding: '24px 0' }}>
        <Alert message={`Ошибка при загрузке новостей: ${error}`} type="error" showIcon />
      </Container>
    );
  }

  const getNewsWordForm = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) return "новостей";
    if (mod10 === 1) return "новость";
    if (mod10 >= 2 && mod10 <= 4) return "новости";
    return "новостей";
  };

  return (
    <Container maxWidth="xl" style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: 24, fontWeight: 600, padding: 10 }}>
        Актуальное
      </Title>

      {blocks.length === 0 ? (
        <Alert message="Нет доступных новостей" type="info" showIcon />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
              marginBottom: 24,
              padding: "0 24px",
            }}
          >
            {blocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 32,
              padding: 10
            }}
          >
            <Space size="middle">
              <Text type="secondary">На странице:</Text>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPage(1);
                  setPageSize(value);
                }}
                style={{ width: 80 }}
                size="middle"
              >
                {[3, 6, 9, 12, 15].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
              <Text type="secondary">{getNewsWordForm(pageSize)}</Text>
            </Space>

            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
              size="middle"
              style={{ marginLeft: 'auto',  }}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default ContainerRecomm;