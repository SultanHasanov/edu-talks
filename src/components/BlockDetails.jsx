import { Typography, Box, Container, Chip, Alert, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButtonIcon from "../ui/BackButtonIcon";
import { useEffect, useState, useMemo } from "react";

const API_BASE_URL = "http://85.143.175.100:8080";

const BlockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNewsDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`);
        
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const { data } = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
        console.error("Ошибка при загрузке новости:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  const block = useMemo(() => {
    if (!newsItem) return null;
    
    return {
      id: newsItem.id,
      title: newsItem.title,
      type: "НОВОСТЬ",
      content: `<p>${newsItem.content}</p>`,
      date: newsItem.created_at,
      image: newsItem.image_url,
      color: "#7dd3fc"
    };
  }, [newsItem]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке новости: {error}
        </Alert>
        <BackButtonIcon onClick={() => navigate(-1)} />
      </Container>
    );
  }

  if (!block) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Новость не найдена
        </Alert>
        <BackButtonIcon onClick={() => navigate(-1)} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <BackButtonIcon onClick={() => navigate(-1)} />
      
      <Box sx={{ 
        backgroundColor: "#fff", 
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        {/* Баннер с изображением */}
        <Box sx={{
          height: 300,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${block.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          p: 3
        }}>
          <Box>
            <Chip 
              label={block.type} 
              sx={{ 
                backgroundColor: block.color, 
                color: "white",
                fontWeight: "bold",
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                color: "white", 
                fontWeight: 700,
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
              }}
            >
              {block.title}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "rgba(255,255,255,0.9)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
              }}
            >
              Опубликовано: {new Date(block.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {/* Контент */}
        <Box sx={{ p: 4 }}>
          <Box 
            sx={{
              "& h3": {
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2937",
                mt: 4,
                mb: 2
              },
              "& p": {
                fontSize: "1.1rem",
                lineHeight: 1.6,
                mb: 2,
                color: "#4b5563"
              },
              "& ul, & ol": {
                pl: 3,
                mb: 2
              },
              "& li": {
                mb: 1,
                fontSize: "1.1rem",
                color: "#4b5563"
              }
            }}
            dangerouslySetInnerHTML={{ __html: block.content }} 
          />
        </Box>
      </Box>
    </Container>
  );
};

export default BlockDetails;