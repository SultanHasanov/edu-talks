import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Typography,
  Descriptions,
  Button,
  Spin,
  message,
  Alert,
  Checkbox,
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
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  LockOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileOutlined,
  ReadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const { Title, Text } = Typography;
const { TabPane } = Card;

const AdminProfile = () => {
  const { username, email, phone, address, full_name, access_token } =
    useAuth();
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userData, setUserData] = useState({});

  const [formData, setFormData] = useState({
    full_name: full_name || "",
    email: email || "",
    phone: phone || "",
    address: address || "",
    email_subscription: false,
    email_verified: false,
  });

  // Загрузка профиля пользователя
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
        // Обновляем formData данными из API
        setFormData(prev => ({
          ...prev,
          full_name: response.data.data.full_name || full_name || "",
          email: response.data.data.email || email || "",
          phone: response.data.data.phone || phone || "",
          address: response.data.data.address || address || "",
          email_verified: response.data.data.email_verified || false,
        }));
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

  // Загрузка пользователей для админа
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://edutalks.ru/api/admin/users", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setFormData({
      full_name: userData.full_name || full_name || "",
      email: userData.email || email || "",
      phone: userData.phone || phone || "",
      address: userData.address || address || "",
      email_subscription: formData.email_subscription,
      email_verified: userData.email_verified || false,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSaveClick = async () => {
    try {
      // Логика сохранения изменений
      setEditMode(false);
      message.success("Изменения успешно сохранены");
    } catch (err) {
      message.error("Ошибка при сохранении изменений");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubscriptionChange = async (e) => {
    const checked = e.target.checked;
    setSubLoading(true);
    try {
      setFormData((prev) => ({ ...prev, email_subscription: checked }));
      message.success(
        checked ? "Вы подписались на рассылку" : "Вы отписались от рассылки"
      );
    } catch (err) {
      message.error("Не удалось изменить подписку");
    } finally {
      setSubLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setVerificationSent(true);
      message.success(
        <span>
          Письмо для подтверждения почты отправлено на{" "}
          <strong>{formData.email}</strong>
        </span>
      );
    } catch (error) {
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

  const handleDeleteAccount = () => {
    setDeleteModalVisible(false);
    message.success("Аккаунт удален");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 50, marginBottom: 50 }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              size={96}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1890ff",
                marginBottom: 16,
                fontSize: 36,
              }}
            />
            <Title level={3}>
              {editMode ? formData.full_name : userData.full_name || full_name || username}
            </Title>
          </div>

          <Descriptions
            title="Информация администратора"
            column={1}
            bordered
            labelStyle={{ fontWeight: 500 }}
          >
            <Descriptions.Item label="Имя">
              {editMode ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    padding: "4px 8px",
                    width: "100%",
                  }}
                />
              ) : (
                userData.full_name || full_name || "Не указано"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              <MailOutlined />
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    padding: "4px 8px",
                    width: "100%",
                    marginLeft: 8,
                  }}
                />
              ) : (
                <>{userData.email || email || "Не указан"}</>
              )}
              {userData.email_verified ? (
                <CheckCircleOutlined style={{ color: "green", marginLeft: 8 }} />
              ) : (
                <CloseCircleOutlined style={{ color: "red", marginLeft: 8 }} />
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Телефон">
              <PhoneOutlined />
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    padding: "4px 8px",
                    width: "100%",
                    marginLeft: 8,
                  }}
                />
              ) : (
                userData.phone || phone || "Не указан"
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Адрес">
              <HomeOutlined />
              {editMode ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    padding: "4px 8px",
                    width: "100%",
                    marginLeft: 8,
                    minHeight: 60,
                  }}
                />
              ) : (
                userData.address || address || "Не указан"
              )}
            </Descriptions.Item>
          </Descriptions>

          {/* Кнопки действий */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Space size="middle">
             
              
              <Button
                icon={<SyncOutlined />}
                loading={checkingVerification}
                onClick={handleCheckVerification}
              >
                Проверить почту
              </Button>
            </Space>
          </div>

          {/* Статус верификации email */}
          {!userData.email_verified && (
            <Alert
              message="Email не подтвержден"
              description={
                <div>
                  <p>Для полного доступа к функциям подтвердите ваш email</p>
                  <Button 
                    type="link" 
                    onClick={handleResendVerification}
                    disabled={verificationSent}
                  >
                    Отправить письмо повторно
                  </Button>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginTop: 24 }}
            />
          )}
        </>
      </Col>
    </Row>
  );
};

export default AdminProfile;