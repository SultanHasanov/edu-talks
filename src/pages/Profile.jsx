import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon,
  LockReset as PasswordIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  People as UsersIcon,
  InsertDriveFile as FilesIcon,
  Article as NewsIcon,
  Equalizer as StatsIcon,
  Settings as SettingsIcon,
  MoreHoriz as MoreIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { role, username, email, phone, address, full_name, access_token } =
    useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    full_name: full_name || "",
    email: email || "",
    phone: phone || "",
    address: address || "",
  });

  // Загрузка пользователей для админа
  useEffect(() => {
    if (isAdmin) {
      // Загружаем пользователей только когда активна вкладка "Пользователи"
      fetchUsers();
    }
  }, [isAdmin, tabValue]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://85.143.175.100:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }

      const data = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      full_name: full_name || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
    });
  };

  const handleSaveClick = async () => {
    try {
      // Здесь должна быть логика сохранения изменений через API
      setSuccess("Изменения успешно сохранены");
      setEditMode(false);
    } catch (err) {
      setError("Ошибка при сохранении изменений");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = () => {
    // Логика удаления аккаунта
    setOpenDeleteDialog(false);
  };

  // Вкладки для администратора
  const adminTabs = [
    { label: "Статистика", icon: <StatsIcon /> },
    { label: "Пользователи", icon: <UsersIcon /> },
    { label: "Файлы", icon: <FilesIcon /> },
    { label: "Новости", icon: <NewsIcon /> },
    { label: "Настройки", icon: <SettingsIcon /> },
  ];

  // Вкладки для обычного пользователя
  const userTabs = [
    { label: "Моя активность", icon: <StatsIcon /> },
    { label: "Настройки", icon: <SettingsIcon /> },
    { label: "Дополнительно", icon: <MoreIcon /> },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Уведомления */}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      )}

      <Grid container spacing={3}>
        {/* Левая колонка - информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: isAdmin ? "primary.main" : "secondary.main",
                  mb: 2,
                }}
              >
                {username?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h5" component="h1" gutterBottom>
                {full_name || username}
              </Typography>

              {isAdmin && (
                <Chip
                  icon={<AdminIcon />}
                  label="Администратор"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {!editMode ? (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEditClick}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PasswordIcon />}
                      onClick={() => console.log("Смена пароля")}
                    >
                      Пароль
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveClick}
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Отмена
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "background.default" }}>
                    <PersonIcon color="action" />
                  </Avatar>
                </ListItemAvatar>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Полное имя"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    size="small"
                  />
                ) : (
                  <ListItemText
                    primary="Имя"
                    secondary={full_name || "Не указано"}
                  />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "background.default" }}>
                    <EmailIcon color="action" />
                  </Avatar>
                </ListItemAvatar>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    size="small"
                    type="email"
                  />
                ) : (
                  <ListItemText
                    primary="Email"
                    secondary={email || "Не указан"}
                  />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "background.default" }}>
                    <PhoneIcon color="action" />
                  </Avatar>
                </ListItemAvatar>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    size="small"
                  />
                ) : (
                  <ListItemText
                    primary="Телефон"
                    secondary={phone || "Не указан"}
                  />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "background.default" }}>
                    <HomeIcon color="action" />
                  </Avatar>
                </ListItemAvatar>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Адрес"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    size="small"
                    multiline
                    rows={2}
                  />
                ) : (
                  <ListItemText
                    primary="Адрес"
                    secondary={address || "Не указан"}
                  />
                )}
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              fullWidth
              onClick={() => setOpenDeleteDialog(true)}
            >
              Удалить аккаунт
            </Button>
          </Paper>
        </Grid>

        {/* Правая колонка - основное содержимое профиля */}
      </Grid>

      {/* Диалог удаления аккаунта */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя
            отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
