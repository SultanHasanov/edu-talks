import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const AddNewsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const access_token = localStorage.getItem("access_token");

  // Функция для загрузки новостей
  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError("");
      const response = await fetch("http://85.143.175.100:8080/news");
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
      setNews(data?.data);
    } catch (err) {
      setNewsError(
        err instanceof Error ? err.message : "Произошла ошибка при загрузке новостей"
      );
    } finally {
      setNewsLoading(false);
    }
  };

  // Загружаем новости при монтировании компонента
  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://85.143.175.100:8080/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      setSuccess(true);
      setFormData({ title: "", content: "" });
      // Обновляем список новостей после добавления
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла неизвестная ошибка"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Добавить новость
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Новость успешно добавлена!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Заголовок"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Содержание"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            disabled={loading}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Отправка..." : "Добавить новость"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Секция для отображения списка новостей */}
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Список новостей
        </Typography>

        {newsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : newsError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {newsError}
          </Alert>
        ) : (
          <List>
            {news?.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <ListItem>
                  <ListItemText
                    primary={item.title}
                    secondary={item.content}
                  />
                </ListItem>
                {index < news.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AddNewsForm;