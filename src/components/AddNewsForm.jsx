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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ChromePicker } from "react-color";

const AddNewsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    color: "#4A90E2",
    sticker: "Новость",
  });
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image_url: "",
    color: "#4A90E2",
    sticker: "Новость",
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEditColorPicker, setShowEditColorPicker] = useState(false);
  const access_token = localStorage.getItem("access_token");

  const stickerOptions = ["Новость", "Рекомендации", "Важно", "Обновление"];

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError("");
      const response = await fetch("http://85.143.175.100:8080/news");
      
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      
      const data = await response.json();
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

  const handleColorChange = (color) => {
    setFormData((prev) => ({
      ...prev,
      color: color.hex,
    }));
  };

  const handleEditColorChange = (color) => {
    setEditData((prev) => ({
      ...prev,
      color: color.hex,
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

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      setSuccess("Новость успешно добавлена!");
      setFormData({ 
        title: "", 
        content: "", 
        image_url: "", 
        color: "#ffffff",
        sticker: "Новость" 
      });
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
      color: newsItem.color || "#4A90E2",
      sticker: newsItem.sticker || "Новость",
    });
    setOpenEditDialog(true);
  };

  const openDeleteConfirm = (id) => {
    setNewsToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const NewsCardPreview = ({ title, content, image_url, color, sticker, isEdit = false }) => (
   <Paper
  elevation={4}
  sx={{
    p: 3,
    mb: 3,
    minHeight: "300px",
    width: "70%",
    position: "relative",
    overflow: "hidden",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    '&::before': image_url ? {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "70%",
      backgroundImage: `url(${image_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 1,
    } : {},
  }}
>
  {/* Стикер */}
  <Box
    sx={{
      position: "absolute",
      top: 12,
      left: 12,
      backgroundColor: color,
      color: "white",
      px: 2,
      py: 1,
      borderRadius: "16px",
      fontWeight: "bold",
      fontSize: "0.875rem",
      zIndex: 2,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }}
  >
    {sticker}
  </Box>

  {/* Пустое пространство для заполнения изображением */}
  <Box sx={{ flex: 1 }} />

  {/* Контент внизу карточки */}
  <Box sx={{ 
    position: "relative", 
    zIndex: 2,
    paddingTop: 2,
    borderTop: image_url ? "1px solid rgba(0,0,0,0.1)" : "none"
  }}>
    <Typography 
      variant="h5" 
      component="h2" 
      gutterBottom
      sx={{ 
        fontWeight: "bold",
        color: "#333",
        lineHeight: 1.2,
      }}
    >
      {title || "Заголовок новости"}
    </Typography>
 
    <Typography 
      variant="caption" 
      display="block" 
      sx={{ 
        color: "#999",
      }}
    >
      {new Date().toLocaleDateString("ru-RU")}
    </Typography>
  </Box>
</Paper>
  );

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

          <FormControl fullWidth margin="normal">
            <InputLabel>Стикер</InputLabel>
            <Select
              name="sticker"
              value={formData.sticker}
              onChange={handleChange}
              label="Стикер"
              disabled={loading}
            >
              {stickerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

           <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Цвет стикера:
            </Typography>
            <Box
              sx={{
                width: 50,
                height: 50,
                backgroundColor: formData.color,
                border: "1px solid #ccc",
                cursor: "pointer",
                mb: 1,
                borderRadius: 1,
              }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <ChromePicker
                color={formData.color}
                onChange={handleColorChange}
              />
            )}
          </Box>

         

           <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Превью карточки новости:
          </Typography>
          <NewsCardPreview
            title={formData.title}
            content={formData.content}
            image_url={formData.image_url}
            color={formData.color}
            sticker={formData.sticker}
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
                  sx={{ 
                    backgroundColor: item.color || "transparent",
                    position: "relative",
                    minHeight: "120px",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {item.sticker || "Новость"}
                  </Box>
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
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Стикер</InputLabel>
            <Select
              name="sticker"
              value={editData.sticker}
              onChange={handleEditChange}
              label="Стикер"
              disabled={loading}
            >
              {stickerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Цвет фона:
            </Typography>
            <Box
              sx={{
                width: 50,
                height: 50,
                backgroundColor: editData.color,
                border: "1px solid #ccc",
                cursor: "pointer",
                mb: 1,
              }}
              onClick={() => setShowEditColorPicker(!showEditColorPicker)}
            />
            {showEditColorPicker && (
              <ChromePicker
                color={editData.color}
                onChange={handleEditColorChange}
              />
            )}
          </Box>

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

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Превью карточки новости:
          </Typography>
           <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        minHeight: "200px",
        position: "relative",
        overflow: "hidden",
        backgroundImage: editData.image_url ? `url(${image_url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        '&::before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 1,
        }
      }}
    >
      {/* Стикер */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: editData.color,
          px: 2,
          py: 1,
          borderRadius: 1,
          fontWeight: "bold",
          zIndex: 2,
          boxShadow: 1,
        }}
      >
        {editData.sticker}
      </Box>

      {/* Контент */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {editData.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {editData.content}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          {editData.date}
        </Typography>
      </Box>
    </Paper>
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