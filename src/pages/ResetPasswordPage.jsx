import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  message,
} from "antd";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
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

  const handleSubmit = async (values) => {
    setError("");

    if (!formData.token) {
      setError("Неверный токен для сброса пароля");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://edutalks.ru/api/password/reset", {
        new_password: values.newPassword,
        token: formData.token,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        message.success("Пароль успешно изменен!");
        
        // Автоматический переход на страницу входа через 3 секунды
        setTimeout(() => {
          navigate("/auth");
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
      message.error("Ошибка при смене пароля");
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
            type="primary"
            onClick={() => navigate("/auth")}
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

        <Form
          form={form}
          name="reset-password"
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите новый пароль' },
              { min: 8, message: 'Пароль должен содержать минимум 8 символов' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Введите новый пароль"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Подтверждение пароля"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Подтвердите новый пароль"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!formData.token}
              style={{ width: '100%' }}
              size="large"
            >
              {loading ? "Установка пароля..." : "Установить новый пароль"}
            </Button>
          </Form.Item>
        </Form>

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