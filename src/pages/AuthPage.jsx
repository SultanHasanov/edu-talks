import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  Card,
  Alert,
  Checkbox,
  Modal,
  message,
  Divider,
  Typography
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  PhoneOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { TabPane } = Tabs;
const { Text } = Typography;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  
  const [authError, setAuthError] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Состояния для восстановления пароля
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  // Проверяем наличие токена в URL при загрузке компонента
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      resetPasswordForm.setFieldsValue({ token });
      setResetPasswordOpen(true);
      // Очищаем параметр из URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("token");
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams, resetPasswordForm]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setAuthError("");
    setRegError("");
    setRegSuccess(false);
    setSuccessMessage("");
  };

  const handleLogin = async (values) => {
    setAuthError("");
    setIsLoading(true);

    try {
      console.log("Отправка запроса на авторизацию:", {
        username: values.username,
        password: "***",
      });

      const response = await fetch("https://edutalks.ru/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

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

  const handleRegister = async (values) => {
    setRegError("");
    setRegSuccess(false);

    // Проверка что ФИО содержит три слова
    const nameParts = values.full_name.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setRegError("Пожалуйста, введите полное ФИО (Фамилия Имя Отчество)");
      return;
    }
    if (nameParts.some((part) => part.length < 2)) {
      setRegError("Каждая часть ФИО должна содержать минимум 2 символа");
      return;
    }

    if (!values.agreeWithTerms) {
      setRegError("Необходимо согласиться с пользовательским соглашением");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      let data;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      setRegSuccess(true);
      setSuccessMessage(data.data || "Регистрация прошла успешно");
      registerForm.resetFields();
    } catch (error) {
      setRegError(error.message || "Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (values) => {
    setForgotPasswordLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      setForgotPasswordOpen(false);
      setAuthError("");
      setSuccessMessage(
        "Если email зарегистрирован в системе, письмо со ссылкой для сброса пароля будет отправлено."
      );
      forgotPasswordForm.resetFields();
    } catch (error) {
      console.error("Ошибка при отправке запроса на восстановление:", error);
      setAuthError("Произошла ошибка при отправке запроса");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setResetPasswordLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_password: values.newPassword,
          token: values.token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при сбросе пароля");
      }

      setResetPasswordOpen(false);
      resetPasswordForm.resetFields();
      message.success(
        "Пароль успешно изменен. Теперь вы можете войти с новым паролем."
      );
      setActiveTab("login");
    } catch (error) {
      message.error(error.message || "Произошла ошибка при сбросе пароля");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "0 16px" }}>
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
          <TabPane tab="Вход" key="login">
            <Form
              form={loginForm}
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              {authError && (
                <Alert
                  message={authError}
                  type="error"
                  style={{ marginBottom: 16 }}
                />
              )}

              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Пожалуйста, введите логин" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Логин"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Пожалуйста, введите пароль" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Пароль"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  style={{ width: "100%" }}
                >
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </Form.Item>

              <Divider />

              <div style={{ textAlign: "center" }}>
                <Button
                  type="link"
                  onClick={() => setForgotPasswordOpen(true)}
                  icon={<KeyOutlined />}
                >
                  Забыли пароль?
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Регистрация" key="register">
            <Form
              form={registerForm}
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              {regError && (
                <Alert
                  message={regError}
                  type="error"
                  style={{ marginBottom: 16 }}
                />
              )}

              {successMessage && (
                <Alert
                  message={successMessage}
                  type="success"
                  style={{ marginBottom: 16 }}
                />
              )}

              <Form.Item
                name="full_name"
                label="ФИО"
                rules={[
                  { required: true, message: "Пожалуйста, введите ФИО" },
                  {
                    validator: (_, value) => {
                      const nameParts = value?.trim().split(/\s+/) || [];
                      if (nameParts.length < 3) {
                        return Promise.reject(
                          new Error("Введите полное ФИО (Фамилия Имя Отчество)")
                        );
                      }
                      if (nameParts.some((part) => part.length < 2)) {
                        return Promise.reject(
                          new Error("Каждая часть ФИО должна содержать минимум 2 символа")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Фамилия Имя Отчество" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Пожалуйста, введите email" },
                  { type: "email", message: "Введите корректный email" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="username"
                label="Логин"
                rules={[
                  { required: true, message: "Пожалуйста, введите логин" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Логин" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Телефон"
                rules={[
                  { required: true, message: "Пожалуйста, введите телефон" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Телефон" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Адрес"
                rules={[
                  { required: true, message: "Пожалуйста, введите адрес" },
                ]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Адрес" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: "Пожалуйста, введите пароль" },
                  { min: 6, message: "Пароль должен содержать минимум 6 символов" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Пароль"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item
                name="agreeWithTerms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Необходимо согласиться с пользовательским соглашением")
                          ),
                  },
                ]}
              >
                <Checkbox>
                  Я согласен с{" "}
                  <Text
                    type="link"
                    href="/Пользовательское_соглашение.docx"
                    download
                    target="_blank"
                  >
                    пользовательским соглашением
                  </Text>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  style={{ width: "100%" }}
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      {/* Модальное окно восстановления пароля */}
      <Modal
        title="Восстановление пароля"
        open={forgotPasswordOpen}
        onCancel={() => setForgotPasswordOpen(false)}
        footer={null}
      >
        <Form
          form={forgotPasswordForm}
          onFinish={handleForgotPassword}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Пожалуйста, введите email" },
              { type: "email", message: "Введите корректный email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={forgotPasswordLoading}
              style={{ width: "100%" }}
            >
              {forgotPasswordLoading ? "Отправка..." : "Отправить"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно установки нового пароля */}
      <Modal
        title="Установка нового пароля"
        open={resetPasswordOpen}
        onCancel={() => setResetPasswordOpen(false)}
        footer={null}
      >
        <Form
          form={resetPasswordForm}
          onFinish={handleResetPassword}
          layout="vertical"
        >
          <Form.Item name="token" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[
              { required: true, message: "Пожалуйста, введите новый пароль" },
              { min: 6, message: "Пароль должен содержать минимум 6 символов" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Новый пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Подтверждение пароля"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Пожалуйста, подтвердите пароль" },
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
              placeholder="Подтверждение пароля"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={resetPasswordLoading}
              style={{ width: "100%" }}
            >
              {resetPasswordLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthPage;