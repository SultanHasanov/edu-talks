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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text } = Typography;

const UserProfile = () => {
 const access_token = localStorage.getItem('access_token')
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

  // Получение данных профиля
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://85.143.175.100:8080/api/profile",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
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
        "http://85.143.175.100:8080/api/email-subscription",
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
    await axios(
      `http://85.143.175.100:8080/verify-email?token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    message.success("Письмо с подтверждением отправлено на вашу почту");
  } catch (error) {
    console.error("Ошибка при отправке подтверждения:", error);
    message.error("Не удалось отправить письмо подтверждения");
  }
};

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
              </div>

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
        </Card>
      </Col>
    </Row>
  );
};

export default UserProfile;
