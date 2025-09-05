import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Avatar,
  Card,
  Typography,
  Row,
  Col,
  Checkbox,
  message,
  Spin,
  Button,
  Alert,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CrownOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const UserProfile = () => {
  const access_token = localStorage.getItem("access_token");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    full_name: "",
    email_verified: false,
    email_subscription: false,
  });
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleSubscribe = () => {
    if (!access_token) {
      alert("Нужно сначала авторизоваться");
      return;
    }
    navigate("/subscription");
  };
  const { role } = useAuth();

  // Получение данных профиля
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://edutalks.ru/api/profile", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        message.error("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };

    if (access_token) {
      fetchProfile();
    }
  }, [access_token]);

  const handleSubscriptionChange = async (e) => {
    const checked = e.target.checked;
    setSubLoading(true);
    try {
      await axios.patch(
        "https://edutalks.ru/api/email-subscription",
        { subscribe: checked },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setUserData((prev) => ({ ...prev, email_subscription: checked }));
      message.success(
        checked ? "Вы подписались на рассылку" : "Вы отписались от рассылки"
      );
    } catch (err) {
      console.error(err);
      message.error("Не удалось изменить подписку");
    } finally {
      setSubLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(
        `https://edutalks.ru/api/resend-verification`,
        { email: userData.email },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setVerificationSent(true);
      message.success(
        <span>
          Письмо для подтверждения почты отправлено на{" "}
          <strong>{userData.email}</strong>. Пожалуйста, проверьте вашу почту.
          Если не найдете письмо, проверьте папку "Спам".
        </span>
      );
    } catch (error) {
      console.error("Ошибка при отправке подтверждения:", error);
      message.error("Не удалось отправить письмо подтверждения");
    }
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);
    try {
      const response = await axios.get("https://edutalks.ru/api/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setUserData(response.data.data);
      if (response.data.data.email_verified) {
        message.success("Почта успешно подтверждена!");
        setVerificationSent(false);
      } else {
        message.info(
          "Почта еще не подтверждена. Пожалуйста, проверьте вашу почту."
        );
      }
    } catch (error) {
      console.error("Ошибка при проверке подтверждения:", error);
      message.error("Не удалось проверить статус подтверждения");
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleChangePassword = async (values) => {
    setChangingPassword(true);
    try {
      await axios.post(
        "https://edutalks.ru/api/password/change",
        {
          old_password: values.oldPassword,
          new_password: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.success("Пароль успешно изменен");
      setChangePasswordModalVisible(false);
      form.resetFields();

      // Опционально: разлогинить пользователя для повторного входа
      // localStorage.removeItem("access_token");
      // window.location.reload();
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);

      if (error.response?.status === 400) {
        if (error.response.data?.message?.includes("old password")) {
          message.error("Текущий пароль неверный");
        } else if (
          error.response.data?.message?.includes("password too short")
        ) {
          message.error("Новый пароль слишком короткий");
        } else {
          message.error(
            "Не удалось изменить пароль. Проверьте введенные данные"
          );
        }
      } else if (error.response?.status === 401) {
        message.error("Сессия истекла. Пожалуйста, войдите снова");
        localStorage.removeItem("access_token");
        window.location.reload();
      } else {
        message.error("Произошла ошибка при изменении пароля");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const expiresDate = dayjs(userData.subscription_expires_at);

  return (
    <Row justify="center" style={{ marginTop: 50 }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar
                  size={96}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff", marginBottom: 16 }}
                />
                <Title level={3}>
                  {userData.full_name || userData.username}
                </Title>

                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={() => setChangePasswordModalVisible(true)}
                  style={{ marginTop: 16 }}
                >
                  Сменить пароль
                </Button>
              </div>

              {verificationSent && !userData.email_verified && (
                <Alert
                  message={
                    <div>
                      <p>
                        Письмо для подтверждения отправлено на {userData.email}
                      </p>
                      <p>
                        Пожалуйста, проверьте вашу почту. Если не найдете
                        письмо, проверьте папку "Спам".
                      </p>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                  action={
                    <Button
                      type="primary"
                      size="small"
                      icon={<SyncOutlined />}
                      loading={checkingVerification}
                      onClick={handleCheckVerification}
                    >
                      Проверить
                    </Button>
                  }
                />
              )}

              <Descriptions
                title="Информация пользователя"
                column={1}
                bordered
                labelStyle={{ fontWeight: 500 }}
              >
                <Descriptions.Item label="Имя">
                  {userData.full_name || "Не указано"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined /> {userData.email || "Не указан"}
                  {userData.email_verified ? (
                    <Text type="success" style={{ marginLeft: 8 }}>
                      <CheckCircleOutlined /> Подтвержден
                    </Text>
                  ) : (
                    <>
                      <Text type="danger" style={{ marginLeft: 8 }}>
                        <CloseCircleOutlined /> Не подтвержден
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={handleResendVerification}
                        style={{ marginLeft: 8 }}
                      >
                        Подтвердить почту
                      </Button>
                    </>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Телефон">
                  <PhoneOutlined /> {userData.phone || "Не указан"}
                </Descriptions.Item>
                <Descriptions.Item label="Адрес">
                  <HomeOutlined /> {userData.address || "Не указан"}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24 }}>
                <Checkbox
                  checked={userData.email_subscription}
                  onChange={handleSubscriptionChange}
                  disabled={subLoading}
                >
                  {userData.email_subscription
                    ? "Подписан на рассылку обновлений"
                    : "Подписаться на рассылку"}
                </Checkbox>
              </div>
            </>
          )}
          {!loading && role !== "admin" && !userData.is_subscription_active && (
            <Alert
              message="У вас нет подписки"
              description="Чтобы скачивать документы, необходимо оформить подписку"
              type="warning"
              showIcon
              action={
                <Button
                  type="primary"
                  size="middle"
                  icon={<CrownOutlined />}
                  onClick={handleSubscribe}
                >
                  Оформить подписку
                </Button>
              }
              style={{
                marginTop: 30,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            />
          )}
        </Card>
        {userData.is_subscription_active && (
          <Card style={{ marginTop: 30 }} title="Информация о подписке">
            <p>
              <strong>Дата окончания подписки:</strong>{" "}
              {expiresDate.format("DD.MM.YYYY HH:mm")}
            </p>
          </Card>
        )}

        {/* Модальное окно смены пароля */}
        <Modal
          title="Смена пароля"
          open={changePasswordModalVisible}
          onCancel={() => {
            setChangePasswordModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
            autoComplete="off"
          >
            <Form.Item
              name="oldPassword"
              label="Текущий пароль"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите текущий пароль",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите текущий пароль"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Новый пароль"
              rules={[
                { required: true, message: "Пожалуйста, введите новый пароль" },
              ]}
             
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите новый пароль"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Подтверждение пароля"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Пожалуйста, подтвердите пароль" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Пароли не совпадают"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Подтвердите новый пароль"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={changingPassword}
                  disabled={changingPassword}
                >
                  Сменить пароль
                </Button>
                <Button
                  onClick={() => {
                    setChangePasswordModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Отмена
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default UserProfile;
