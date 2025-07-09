import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
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
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Profile = () => {
  const { role, username, email, phone, address, full_name, access_token } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const isAdmin = role === 'admin';

  const [formData, setFormData] = useState({
    full_name: full_name || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
  });

  // Загрузка пользователей для админа
  useEffect(() => {
    if (isAdmin && tabValue === 1) {
      fetchUsers();
    }
  }, [isAdmin, tabValue]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://85.143.175.100:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
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
      full_name: full_name || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
    });
  };

  const handleSaveClick = async () => {
    try {
      // Здесь должна быть логика сохранения изменений через API
      setSuccess('Изменения успешно сохранены');
      setEditMode(false);
    } catch (err) {
      setError('Ошибка при сохранении изменений');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = () => {
    // Логика удаления аккаунта
    setOpenDeleteDialog(false);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    console.log('Редактировать пользователя:', selectedUser);
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    console.log('Удалить пользователя:', selectedUser);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: isAdmin ? 'primary.main' : 'secondary.main',
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
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
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
                      onClick={() => console.log('Смена пароля')}
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
                  <Avatar sx={{ bgcolor: 'background.default' }}>
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
                  <ListItemText primary="Имя" secondary={full_name || 'Не указано'} />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default' }}>
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
                  <ListItemText primary="Email" secondary={email || 'Не указан'} />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default' }}>
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
                  <ListItemText primary="Телефон" secondary={phone || 'Не указан'} />
                )}
              </ListItem>

              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default' }}>
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
                  <ListItemText primary="Адрес" secondary={address || 'Не указан'} />
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
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '16px',
                  py: 2,
                },
              }}
            >
              <Tab label={isAdmin ? "Статистика" : "Моя активность"} />
              <Tab label={isAdmin ? "Управление пользователями" : "Настройки"} />
              <Tab label="Дополнительно" />
            </Tabs>

            <Divider />

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  {isAdmin ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Статистика системы
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Всего пользователей
                              </Typography>
                              <Typography variant="h4">
                                {users.length}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Администраторов
                              </Typography>
                              <Typography variant="h4">
                                {users.filter(u => u.role === 'admin').length}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Обычных пользователей
                              </Typography>
                              <Typography variant="h4">
                                {users.filter(u => u.role === 'user').length}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
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
                </>
              )}

              {tabValue === 1 && (
                <>
                  {isAdmin ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          Пользователи системы
                        </Typography>
                        <Box>
                          <Button 
                            variant="outlined" 
                            startIcon={<RefreshIcon />} 
                            onClick={fetchUsers}
                            sx={{ mr: 1 }}
                          >
                            Обновить
                          </Button>
                          <Button variant="contained" size="small">
                            Добавить пользователя
                          </Button>
                        </Box>
                      </Box>
                      
                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Имя</TableCell>
                                <TableCell>Логин</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Роль</TableCell>
                                <TableCell>Дата регистрации</TableCell>
                                <TableCell align="right">Действия</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {users.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>{user.full_name || 'Не указано'}</TableCell>
                                  <TableCell>{user.username}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                      color={user.role === 'admin' ? 'primary' : 'default'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{formatDate(user.created_at)}</TableCell>
                                  <TableCell align="right">
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => handleMenuOpen(e, user)}
                                    >
                                      <MoreIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </>
                  ) : (
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
                        {isAdmin 
                          ? 'Административные инструменты и настройки системы' 
                          : 'Дополнительные возможности вашего профиля'}
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Меню действий с пользователем (для админа) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditUser}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редактировать</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Удалить</ListItemText>
        </MenuItem>
      </Menu>

      {/* Диалог удаления аккаунта */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
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