import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Pagination, Select, Space } from "antd";
import "antd/dist/reset.css"; // обязательно импортировать AntD стили
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const API_BASE_URL = "http://85.143.175.100:8080";

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
          `${API_BASE_URL}/news?page=${page}&page_size=${pageSize}`
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

  const BlockCard = ({ block }) => (
    <Box
      onClick={() => handleBlockClick(block.id)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: 200,
          position: "relative",
          overflow: "hidden",
          backgroundImage: `url(${block.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.1)",
          },
        }}
      >
        <Chip
          label={block.type}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: block.color,
            color: "white",
            fontWeight: 600,
            zIndex: 1,
          }}
        />
      </Box>
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{ mb: 1, fontWeight: 600, color: "#1f2937" }}
        >
          {block.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          {block.date}
        </Typography>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке новостей: {error}
        </Alert>
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, fontWeight: 600, color: "#1f2937" }}
      >
        Актуальное
      </Typography>

      {blocks.length === 0 ? (
        <Alert severity="info">Нет доступных новостей</Alert>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
              mb: 5,
            }}
          >
            {blocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </Box>

          {/* AntD Pagination снизу */}
           <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space align="center">
              <span>На странице</span>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPage(1);
                  setPageSize(value);
                }}
                style={{ width: 80 }}
              >
                {[3, 6, 9, 12, 15].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
              <span>{getNewsWordForm(pageSize)}</span>
            </Space>

            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default ContainerRecomm;
