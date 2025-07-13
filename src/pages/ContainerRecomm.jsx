import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ContainerRecomm = () => {
  const navigate = useNavigate();
  const [serverNews, setServerNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Данные блоков с изображениями (локальные)
  const blocks = [
    {
      id: "1",
      title: "Как написать содержательный раздел ООП под ФОП",
      date: "Сегодня",
      type: "РЕКОМЕНДАЦИЯ",
      content:
        "Полное руководство по созданию раздела основной образовательной программы...",
      color: "#93c5fd",
      icon: "recommendation",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "2",
      title: "Положение о локальных актах",
      date: "Сегодня",
      type: "ДОКУМЕНТ",
      content: "Образец положения о локальных нормативных актах...",
      color: "#86efac",
      icon: "document",
      image:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "3",
      title: "Правила приема в школу",
      date: "Вчера",
      type: "ИНСТРУКЦИЯ",
      content: "Актуальные правила приема учащихся...",
      color: "#fca5a5",
      icon: "instruction",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "4",
      title: "Справка об обучении для сдающих ЕГЭ",
      date: "2 дня назад",
      type: "ОБРАЗЕЦ",
      content: "Готовый шаблон справки об обучении...",
      color: "#d8b4fe",
      icon: "template",
      image:
        "https://images.unsplash.com/photo-1561164517-686f490ee86d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "5",
      title: "Как оформить отношения с учеником, который не сдал ЕГЭ",
      date: "3 дня назад",
      type: "РЕКОМЕНДАЦИЯ",
      content: "Пошаговая инструкция по документальному оформлению...",
      color: "#93c5fd",
      icon: "recommendation",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "6",
      title: "Изменения в учебных планах с 1 сентября 2025 года",
      date: "Неделю назад",
      type: "ИЗМЕНЕНИЯ",
      content: "Обзор всех планируемых изменений...",
      color: "#fcd34d",
      icon: "changes",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Получение новостей с сервера
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://85.143.175.100:8080/news");
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setServerNews(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Преобразование новостей с сервера в формат блоков
  const serverBlocks = serverNews.map((newsItem, index) => ({
    id: newsItem.id,
    title: newsItem.title,
    date: new Date().toLocaleDateString(), // или используйте дату из newsItem, если она есть
    type: "НОВОСТЬ",
    content: newsItem.content,
    color: "#7dd3fc",
    icon: "news",
    image: "https://charodeikibg.ru/_si/0/78235036.jpg",
  }));

  // Объединение локальных и серверных новостей
  const allBlocks = [...serverBlocks, ...blocks];

  const handleBlockClick = (id) => {
    navigate(`/recomm/${id}`);
  };

  const renderBlock = (block, index) => (
    <Box
      key={index}
      onClick={() => handleBlockClick(block.id)}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
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
        {block.type && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: block.color,
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontSize: "12px",
              fontWeight: 600,
              zIndex: 1,
            }}
          >
            <Typography style={{ fontWeight: 600 }}>{block.type}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600, color: "#1f2937" }}
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
        sx={{ py: 3, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">Ошибка при загрузке новостей: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: 600, color: "#1f2937" }}
        >
          Актуальное
        </Typography>

        {allBlocks.length === 0 ? (
          <Typography>Нет доступных новостей</Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 3,
                mb: 4,
              }}
            >
              {allBlocks
                .slice(0, 3)
                .map((block, index) => renderBlock(block, index))}
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 3,
              }}
            >
              {allBlocks
                .slice(3)
                .map((block, index) => renderBlock(block, index + 3))}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ContainerRecomm;
