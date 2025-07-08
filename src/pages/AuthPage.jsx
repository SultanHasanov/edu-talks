import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import BackButtonIcon from "../ui/BackButtonIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: ""
  });
  const [authError, setAuthError] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const { login, logout, isAuthenticated, username } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setAuthError("");
    setRegError("");
    setRegSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!formData.username || !formData.password) {
      setAuthError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://85.143.175.100:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка авторизации");
      }

      // Сохраняем токен и роль из ответа сервера
      login(data.access_token, data.role, data.username, data.full_name);
      navigate("/");
      
    } catch (error) {
      setAuthError(error.message || "Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess(false);

    if (!formData.email || !formData.username || !formData.password || 
        !formData.full_name || !formData.phone || !formData.address) {
      setRegError("Пожалуйста, заполните все поля");
      return;
    }

    if (formData.password.length < 6) {
      setRegError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://85.143.175.100:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка регистрации");
      }

      setRegSuccess(true);
      setFormData({
        username: "",
        email: "",
        password: "",
        full_name: "",
        phone: "",
        address: ""
      });
    } catch (error) {
      setRegError(error.message || "Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
   logout()
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <BackButtonIcon />
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box textAlign="center" mb={3}>
            <PersonIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h5" component="h1" gutterBottom>
              Добро пожаловать, {currentUser}!
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Вы успешно авторизованы в системе.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <BackButtonIcon />

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              py: 2,
            },
          }}
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>

        <Divider />

        <Box sx={{ p: 4 }}>
          {tabValue === 0 ? (
            // Форма авторизации
            <form onSubmit={handleLogin}>
              {authError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {authError}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Логин"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Пароль"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePassword}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          ) : (
            // Форма регистрации
            <form onSubmit={handleRegister}>
              {regError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {regError}
                </Alert>
              )}

              {regSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Регистрация прошла успешно! Теперь вы можете войти.
                </Alert>
              )}

              <TextField
                fullWidth
                label="Полное имя"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Логин"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Адрес"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Пароль"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePassword}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Пароль должен содержать минимум 6 символов"
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;