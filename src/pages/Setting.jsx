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
import UsersTable from "../components/UsersTable";
import UserEditDialog from "../components/UserEditDialog";
import AddNewsForm from "../components/AddNewsForm";
import FileUploadSection from "../components/FileUploadSection";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import NotificationSender from "../components/NotificationSender";

const Setting = () => {
  const { role, access_token, email, phone, address, full_name, authFetch } =
    useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Состояния для управления редактированием пользователей
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [news, setNews] = useState(null);

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
      fetchNews();
    }
  }, [isAdmin, tabValue]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(
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
      setUsers(data.data.data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(
        "http://85.143.175.100:8080/news",
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
      setNews(data.data.total);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  // Обработчики для управления пользователями
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleCreateUser = () => {
    setCurrentUser(null);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    // Логика удаления пользователя
    console.log("Удалить пользователя:", user);
  };

  const handleSaveUser = async (userData) => {
    setUserLoading(true);
    setUserError(null);

    try {
      const url = userData.id
        ? `http://85.143.175.100:8080/api/admin/users/${userData.id}`
        : "http://85.143.175.100:8080/api/admin/users";

      const method = "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: userData.address,
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
        }),
      });

      if (!response.ok) {
        throw new Error(
          userData.id
            ? "Ошибка при обновлении пользователя"
            : "Ошибка при создании пользователя"
        );
      }

      setSuccess(
        userData.id
          ? "Пользователь успешно обновлен"
          : "Пользователь успешно создан"
      );
      setEditDialogOpen(false);
      fetchUsers();
    } catch (err) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  // Вкладки для администратора
  const adminTabs = [
    { label: "Статистика", icon: <StatsIcon /> },
    { label: "Пользователи", icon: <UsersIcon /> },
    { label: "Файлы", icon: <FilesIcon /> },
    { label: "Новости", icon: <NewsIcon /> },
    { label: "Рассылка", icon: <EmailIcon /> },
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
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}

      {/* Правая колонка - основное содержимое профиля */}
      <Paper elevation={3} sx={{ borderRadius: 2, mb: 3, width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "14px",
              py: 2,
              minWidth: "unset",
              minHeight: "unset",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Divider />

        <Box sx={{ p: 3 }}>
          {isAdmin ? (
            <>
              {/* Статистика */}
              {tabValue === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Статистика системы
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Card style={{ textAlign: "center" }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Всего пользователей
                          </Typography>
                          <Typography variant="h4">{users.length}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card style={{ textAlign: "center" }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Администраторов
                          </Typography>
                          <Typography variant="h4">
                            {users.filter((u) => u.role === "admin").length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card style={{ textAlign: "center" }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Обычных пользователей
                          </Typography>
                          <Typography variant="h4">
                            {users.filter((u) => u.role === "user").length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>{" "}
                    <Grid item xs={12} sm={4}>
                      <Card style={{ textAlign: "center" }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Оформили подписки
                          </Typography>
                          <Typography variant="h4">
                            {
                              users.filter((u) => u.HasSubscription === true)
                                .length
                            }
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card style={{ textAlign: "center" }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Новости
                          </Typography>
                          <Typography variant="h4">
                           {news}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Пользователи */}
              {tabValue === 1 && (
                <UsersTable
                  users={users}
                  loading={loading}
                  onRefresh={fetchUsers}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  onCreateUser={handleCreateUser}
                />
              )}

              {/* Файлы */}
              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Управление файлами
                  </Typography>
                  <FileUploadSection />
                  {/* Здесь можно добавить список файлов и управление ими */}
                </>
              )}

              {/* Новости */}
              {tabValue === 3 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Управление новостями
                  </Typography>
                  <AddNewsForm />
                  {/* Здесь можно добавить список новостей и управление ими */}
                </>
              )}

              {/* Настройки */}
              {tabValue === 4 && (
                <>
                  <NotificationSender />
                </>
              )}
            </>
          ) : (
            <>
              {/* Обычный пользователь */}
              {tabValue === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Моя активность
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Здесь будет информация о вашей активности...
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}

              {tabValue === 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Настройки профиля
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Здесь будут дополнительные настройки вашего профиля...
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}

              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Дополнительная информация
                  </Typography>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Дополнительные возможности вашего профиля
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </Box>
      </Paper>

      {/* Диалог редактирования пользователя */}
      <UserEditDialog
        open={editDialogOpen}
        user={currentUser}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveUser}
        loading={userLoading}
        error={userError}
      />

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

export default Setting;
