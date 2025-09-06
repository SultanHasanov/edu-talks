import React, { useState, useEffect } from "react";
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
  Checkbox,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
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
    address: "",
  });
  const [authError, setAuthError] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [agreeWithTerms, setAgreeWithTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, isAuthenticated, username } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Состояния для восстановления пароля
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
    token: "",
  });
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState("");

  // Проверяем наличие токена в URL при загрузке компонента
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetPasswordData((prev) => ({ ...prev, token }));
      setResetPasswordOpen(true);
      // Очищаем параметр из URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams]);

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
      console.log("Отправка запроса на авторизацию:", {
        username: formData.username,
        password: "***", // Не логируйте реальный пароль!
      });

      const response = await fetch("https://edutalks.ru/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      console.log("Статус ответа:", response.status);
      console.log(
        "Заголовки ответа:",
        Object.fromEntries(response.headers.entries())
      );

      // Читаем тело ответа безопасно
      let data;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      console.log("Полный ответ сервера:", data);

      if (!response.ok) {
        throw new Error(data.message || "Ошибка авторизации");
      }

      console.log("Успешный ответ:", data);
      login(
        data.data.access_token,
        data.data.role,
        data.data.username,
        data.data.full_name
      );
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setAuthError(error.message || "Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess(false);
    // Проверка что ФИО содержит три слова (Фамилия Имя Отчество)
    const nameParts = formData.full_name.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setRegError("Пожалуйста, введите полное ФИО (Фамилия Имя Отчество)");
      return;
    }
    // Дополнительная проверка что каждая часть ФИО не слишком короткая
    if (nameParts.some((part) => part.length < 2)) {
      setRegError("Каждая часть ФИО должна содержать минимум 2 символа");
      return;
    }
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.full_name ||
      !formData.phone ||
      !formData.address
    ) {
      setRegError("Пожалуйста, заполните все поля");
      return;
    }

    if (!agreeWithTerms) {
      setRegError("Необходимо согласиться с пользовательским соглашением");
      return;
    }

    if (formData.password.length < 6) {
      setRegError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Сначала читаем ответ (вне зависимости от успешности)
      let data;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();

        console.log("Текстовый ответ:", data);
      } else {
        data = await response.json();
      }

      // Теперь безопасно проверяем статус
      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      // Успешная регистрация
      setRegSuccess(true);
      setSuccessMessage(data.data || "Регистрация прошла успешно");
      setFormData({
        username: "",
        email: "",
        password: "",
        full_name: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      setRegError(error.message || "Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для отправки запроса на восстановление пароля
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setAuthError("Пожалуйста, введите email");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
        }),
      });

      // Ответ всегда одинаковый, даже если email не найден
      setForgotPasswordSuccess(true);
      setForgotPasswordOpen(false);
      setAuthError("");

      // Показываем сообщение об успехе
      setSuccessMessage(
        "Если email зарегистрирован в системе, письмо со ссылкой для сброса пароля будет отправлено."
      );
    } catch (error) {
      console.error("Ошибка при отправке запроса на восстановление:", error);
      setAuthError("Произошла ошибка при отправке запроса");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Функция для установки нового пароля
  const handleResetPassword = async () => {
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetPasswordError("Пароли не совпадают");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setResetPasswordError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (!resetPasswordData.token) {
      setResetPasswordError("Токен отсутствует");
      return;
    }

    setResetPasswordLoading(true);
    setResetPasswordError("");

    try {
      const response = await fetch("https://edutalks.ru/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: resetPasswordData.newPassword,
          token: resetPasswordData.token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при сбросе пароля");
      }

      // Успешный сброс пароля
      setResetPasswordOpen(false);
      setResetPasswordData({
        newPassword: "",
        confirmPassword: "",
        token: "",
      });

      message.success(
        "Пароль успешно изменен. Теперь вы можете войти с новым паролем."
      );

      // Переключаем на вкладку входа
      setTabValue(0);
    } catch (error) {
      setResetPasswordError(
        error.message || "Произошла ошибка при сбросе пароля"
      );
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
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

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  color="primary"
                  onClick={() => setForgotPasswordOpen(true)}
                  startIcon={<KeyIcon />}
                >
                  Забыли пароль?
                </Button>
              </Box>
            </form>
          ) : (
            // Форма регистрации
            <form onSubmit={handleRegister}>
              {regError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {regError}
                </Alert>
              )}

              {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}

              <TextField
                fullWidth
                label="ФИО"
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

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Checkbox
                  checked={agreeWithTerms}
                  onChange={(e) => setAgreeWithTerms(e.target.checked)}
                  name="terms"
                  sx={{ mr: 1 }}
                />
                <Typography
                  variant="body2"
                  color="primary"
                  component="a"
                  href="/Пользовательское_соглашение.docx"
                  download
                  target="_blank"
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Я согласен с пользовательским соглашением
                </Typography>
              </Box>

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

      {/* Модальное окно восстановления пароля */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle>Восстановление пароля</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          {forgotPasswordSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Если email зарегистрирован, письмо со ссылкой для сброса будет
              отправлено.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordOpen(false)}>Отмена</Button>
          <Button
            onClick={handleForgotPassword}
            disabled={forgotPasswordLoading}
            variant="contained"
          >
            {forgotPasswordLoading ? "Отправка..." : "Отправить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно установки нового пароля */}
      <Dialog
        open={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
      >
        <DialogTitle>Установка нового пароля</DialogTitle>
        <DialogContent>
          {resetPasswordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetPasswordError}
            </Alert>
          )}

          <TextField
            margin="dense"
            label="Новый пароль"
            type="password"
            fullWidth
            variant="outlined"
            value={resetPasswordData.newPassword}
            onChange={(e) =>
              setResetPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            helperText="Пароль должен содержать минимум 6 символов"
          />

          <TextField
            margin="dense"
            label="Подтверждение пароля"
            type="password"
            fullWidth
            variant="outlined"
            value={resetPasswordData.confirmPassword}
            onChange={(e) =>
              setResetPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordOpen(false)}>Отмена</Button>
          <Button
            onClick={handleResetPassword}
            disabled={resetPasswordLoading}
            variant="contained"
          >
            {resetPasswordLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AuthPage;
