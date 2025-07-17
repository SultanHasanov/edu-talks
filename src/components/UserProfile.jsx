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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title } = Typography;

const UserProfile = () => {
  const { access_token } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    full_name: "",
  });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  // Получение данных профиля
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://85.143.175.100:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setUserData(response.data);
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
    setSubscribed(checked);

    if (checked) {
      setSubLoading(true);
      try {
        await axios.patch(
          "http://85.143.175.100:8080/api/email-subscription",
          { subscribe: true },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        message.success("Вы подписались на рассылку");
      } catch (err) {
        console.error(err);
        message.error("Не удалось подписаться на рассылку");
        setSubscribed(false);
      } finally {
        setSubLoading(false);
      }
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
                <Title level={3}>{userData.full_name || userData.username}</Title>
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
                  checked={subscribed}
                  onChange={handleSubscriptionChange}
                  disabled={subLoading}
                >
                  Подписаться на рассылку
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
