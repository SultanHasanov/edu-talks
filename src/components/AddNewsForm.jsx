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
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AddNewsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
  });
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    content: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const access_token = localStorage.getItem("access_token");

  const fetchNews = async () => {
  try {
    setNewsLoading(true);
    setNewsError("");
    const response = await fetch("http://85.143.175.100:8080/news");
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    
    const data = await response.json();
    // Проверяем, что data существует и data.data является массивом
    setNews(Array.isArray(data?.data.data) ? data.data.data : []);
  } catch (err) {
    setNewsError(
      err instanceof Error ? err.message : "Произошла ошибка при загрузке новостей"
    );
  } finally {
    setNewsLoading(false);
  }
};

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://85.143.175.100:8080/api/admin/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(response)

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      setSuccess("Новость успешно добавлена!");
      setFormData({ title: "", content: "", image_url: "" });
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла неизвестная ошибка"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://85.143.175.100:8080/api/admin/news/${editData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      setSuccess("Новость успешно обновлена!");
      setOpenEditDialog(false);
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла неизвестная ошибка"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://85.143.175.100:8080/api/admin/news/${newsToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      setSuccess("Новость успешно удалена!");
      setDeleteConfirmOpen(false);
      await fetchNews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла неизвестная ошибка"
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (newsItem) => {
    setEditData({
      id: newsItem.id,
      title: newsItem.title,
      content: newsItem.content,
      image_url: newsItem.image_url || "",
    });
    setOpenEditDialog(true);
  };

  const openDeleteConfirm = (id) => {
    setNewsToDelete(id);
    setDeleteConfirmOpen(true);
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
            {success}
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

          <TextField
            fullWidth
            label="URL изображения"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            margin="normal"
            disabled={loading}
            placeholder="https://example.com/image.jpg"
          />

          {formData.image_url && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1">Превью изображения:</Typography>
              <img
                src={formData.image_url}
                alt="Превью"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200?text=Изображение+не+найдено";
                }}
              />
            </Box>
          )}

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
            {news.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => openEditModal(item)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => openDeleteConfirm(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  {item.image_url && (
                    <ListItemAvatar>
                      <Avatar
                        src={item.image_url}
                        variant="square"
                        sx={{ width: 80, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                  )}
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

      {/* Диалог редактирования */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Редактировать новость</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Заголовок"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Содержание"
            name="content"
            value={editData.content}
            onChange={handleEditChange}
            margin="normal"
            required
            multiline
            rows={4}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="URL изображения"
            name="image_url"
            value={editData.image_url}
            onChange={handleEditChange}
            margin="normal"
            disabled={loading}
          />

          {editData.image_url && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1">Превью изображения:</Typography>
              <img
                src={editData.image_url}
                alt="Превью"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/200?text=Изображение+не+найдено";
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={loading}>
            Отмена
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту новость?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Удаление..." : "Удалить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddNewsForm;