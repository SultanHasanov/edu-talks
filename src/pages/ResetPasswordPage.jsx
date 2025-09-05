import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Извлекаем токен из URL при загрузке компонента
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setFormData(prev => ({ ...prev, token }));
    } else {
      setError("Неверная или отсутствующая ссылка для сброса пароля");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (formData.newPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!formData.token) {
      setError("Неверный токен для сброса пароля");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://edutalks.ru/api/password/reset", {
        new_password: formData.newPassword,
        token: formData.token,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        
        // Автоматический переход на страницу входа через 3 секунды
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Ошибка при сбросе пароля:", error);
      
      if (error.response?.status === 400) {
        setError("Неверный или просроченный токен. Запросите новую ссылку для сброса пароля.");
      } else if (error.response?.status === 422) {
        setError("Пароль слишком короткий или не соответствует требованиям");
      } else {
        setError("Произошла ошибка при сбросе пароля. Пожалуйста, попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Пароль успешно изменен!
            </Typography>
            <Typography>
              Вы будете перенаправлены на страницу входа через несколько секунд.
            </Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Перейти к входу
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Установка нового пароля
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Новый пароль"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleInputChange}
            margin="normal"
            required
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
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Пароль должен содержать минимум 6 символов"
          />

          <TextField
            fullWidth
            label="Подтверждение пароля"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            required
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading || !formData.token}
            >
              {loading ? "Установка пароля..." : "Установить новый пароль"}
            </Button>
          </Box>
        </form>

        {!formData.token && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Ожидание токена для сброса пароля...
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;