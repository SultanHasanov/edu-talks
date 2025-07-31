import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Spin,
  message,
  Modal,
  Avatar,
  Divider,
  Tag,
  Alert,
  Progress,
  Table,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SafetyOutlined,
  LockOutlined,
  SaveOutlined,
  DeleteOutlined,
  TeamOutlined,
  FileOutlined,
  NotificationOutlined,
  BarChartOutlined,
  SettingOutlined,
  EllipsisOutlined,
  CrownOutlined,
  UserAddOutlined,
  BellOutlined,
  StopOutlined,
} from "@ant-design/icons";
import UsersTable from "../components/UsersTable";
import UserEditDialog from "../components/UserEditDialog";
import AddNewsForm from "../components/AddNewsForm";
import FileUploadSection from "../components/FileUploadSection";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import NotificationSender from "../components/NotificationSender";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const Setting = () => {
  const { role, email, phone, address, full_name } = useAuth();
  const [activeTab, setActiveTab] = useState("1");
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);
  const access_token = localStorage.getItem("access_token");
  // Состояния для управления редактированием пользователей
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    full_name: full_name || "",
    email: email || "",
    phone: phone || "",
    address: address || "",
  });

  // Загрузка пользователей для админа
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchNews();
      fetchUsersAll();
    }
  }, [isAdmin, activeTab]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Добавляем состояние для инициализации
  const [isInitialized, setIsInitialized] = useState(false);

  // Общая функция загрузки данных
  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/users?page=${page}&page_size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }

      const data = await response.json();
      setUsers(data.data.data);

      // Обновляем пагинацию
      const newPagination = {
        current: data.data.page,
        pageSize: data.data.page_size,
        total: data.data.total,
      };
      setPagination(newPagination);

      // Помечаем как инициализированное
      if (!isInitialized) setIsInitialized(true);

      return newPagination;
    } catch (err) {
      console.log(err);
      message.error(err.message || "Ошибка загрузки пользователей");
      return {
        current: 1,
        pageSize: 10,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAll = async () => {
    setLoading(true);
    try {
      // Сначала получаем первую страницу, чтобы узнать общее количество пользователей
      const firstPageResponse = await fetch(
        `https://edutalks.ru/api/admin/users?page=1&page_size=10`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!firstPageResponse.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }

      const firstPageData = await firstPageResponse.json();
      const totalUsers = firstPageData.data.total;

      // Затем делаем запрос с page_size равным общему количеству пользователей
      const allUsersResponse = await fetch(
        `https://edutalks.ru/api/admin/users?page=1&page_size=${totalUsers}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!allUsersResponse.ok) {
        throw new Error("Ошибка загрузки всех пользователей");
      }

      const allUsersData = await allUsersResponse.json();
      setUsersAll(allUsersData.data.data);

      // Обновляем пагинацию (теперь у нас одна страница со всеми пользователями)
    } catch (err) {
      console.log(err);
      message.error(err.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  // Первичная загрузка данных
  useEffect(() => {
    if (!isInitialized) {
      fetchUsers(pagination.current, pagination.pageSize);
    }
  }, [isInitialized]);

  // Обновленная функция обновления данных
  const handleRefresh = async () => {
    await fetchUsers(pagination.current, pagination.pageSize);
  };

  // Функция обработки изменения страницы
  const handleTableChange = async (newPagination) => {
    await fetchUsers(newPagination.current, newPagination.pageSize);
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("https://edutalks.ru/api/news", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка загрузки новостей");
      }

      const data = await response.json();
      setNews(data.data.total);
    } catch (err) {
      console.log(err);
      message.error("Ошибка загрузки новостей");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      full_name: full_name || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
    });
  };

  const handleSaveClick = async () => {
    try {
      // Здесь должна быть логика сохранения изменений через API
      message.success("Изменения успешно сохранены");
      setEditMode(false);
    } catch (err) {
      message.error("Ошибка при сохранении изменений");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = () => {
    confirm({
      title: "Подтверждение удаления",
      content:
        "Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.",
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk() {
        // Логика удаления аккаунта
        message.success("Аккаунт удален");
      },
    });
  };

  // Обработчики для управления пользователями
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditDialogOpen(true);
  };

  const handleCreateUser = () => {
    setCurrentUser(null);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    confirm({
      title: "Удаление пользователя",
      content: `Вы уверены, что хотите удалить пользователя ${user.full_name}?`,
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk() {
        console.log("Удалить пользователя:", user);
        message.success("Пользователь удален");
      },
    });
  };

  const handleSaveUser = async (userData) => {
    setUserLoading(true);

    try {
      const url = userData.id
        ? `https://edutalks.ru/api/admin/users/${userData.id}`
        : "https://edutalks.ru/api/admin/users";

      const method = "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: userData.address,
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role,
        }),
      });

      if (!response.ok) {
        throw new Error(
          userData.id
            ? "Ошибка при обновлении пользователя"
            : "Ошибка при создании пользователя"
        );
      }

      message.success(
        userData.id
          ? "Пользователь успешно обновлен"
          : "Пользователь успешно создан"
      );
      setEditDialogOpen(false);
      fetchUsers();
    } catch (err) {
      message.error(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  // Компонент статистики
// Компонент статистики
const StatisticsContent = () => {
  const totalUsers = usersAll.length;
  const adminCount = usersAll.filter((u) => u.role === "admin").length;
  const userCount = usersAll.filter((u) => u.role === "user").length;
  const subscribedCount = usersAll.filter((u) => u.has_subscription === true).length;
  const notSubscribedCount = totalUsers - subscribedCount;
  const subscribedPercentage = totalUsers > 0 ? Math.round((subscribedCount / totalUsers) * 100) : 0;

  const dataSource = [
    {
      key: '1',
      metric: 'Всего пользователей',
      value: totalUsers,
      icon: <TeamOutlined />,
      color: '#3f8600'
    },
    {
      key: '2',
      metric: 'Администраторов',
      value: adminCount,
      icon: <CrownOutlined />,
      color: '#cf1322'
    },
    {
      key: '3',
      metric: 'Обычных пользователей',
      value: userCount,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      key: '4',
      metric: 'С подпиской',
      value: `${subscribedCount} (${subscribedPercentage}%)`,
      icon: <SafetyOutlined />,
      color: '#52c41a'
    },
    {
      key: '5',
      metric: 'Без подписки',
      value: notSubscribedCount,
      icon: <StopOutlined />,
      color: '#fa8c16'
    },
    {
      key: '6',
      metric: 'Новостей',
      value: news || 0,
      icon: <NotificationOutlined />,
      color: '#faad14'
    }
  ];

  const columns = [
    {
      title: 'Метрика',
      dataIndex: 'metric',
      key: 'metric',
      render: (text, record) => (
        <Space>
          {React.cloneElement(record.icon, { style: { color: record.color } })}
          {text}
        </Space>
      ),
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => (
        <Text strong style={{ color: record.color, fontSize: '16px' }}>
          {value}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 0 24px" }}>
      <Card 
        title="Статистика системы" 
        bordered={false}
        style={{ marginBottom: 24 }}
      >
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          pagination={false}
          showHeader={false}
          size="middle"
        />
      </Card>

      <Card title="Детализация подписок">
        <Row gutter={16}>
          <Col span={12}>
            <Progress
              type="dashboard"
              percent={subscribedPercentage}
              strokeColor="#52c41a"
              format={() => `${subscribedCount}/${totalUsers}`}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong>Пользователей с подпиской</Text>
            </div>
          </Col>
          <Col span={12}>
            <Progress
              type="dashboard"
              percent={100 - subscribedPercentage}
              strokeColor="#fa8c16"
              format={() => `${notSubscribedCount}/${totalUsers}`}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong>Пользователей без подписки</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

  // Компонент настроек профиля
  const ProfileSettingsContent = () => (
    <div style={{ padding: "0 0 24px" }}>
      <Title
        level={4}
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <SettingOutlined style={{ color: "#1890ff" }} />
        Настройки профиля
      </Title>
      <Card>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <SettingOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <Text type="secondary">
            Здесь будут дополнительные настройки вашего профиля
          </Text>
        </div>
      </Card>
    </div>
  );

  // Компонент дополнительной информации
  const AdditionalInfoContent = () => (
    <div style={{ padding: "0 0 24px" }}>
      <Title
        level={4}
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <EllipsisOutlined style={{ color: "#1890ff" }} />
        Дополнительная информация
      </Title>
      <Card>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <EllipsisOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <Text type="secondary">
            Дополнительные возможности вашего профиля
          </Text>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
      {/* Основная карточка с вкладками */}
      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          size="large"
          style={{ marginBottom: 0 }}
        >
          {role === "admin" && (
            <>
              <TabPane
                tab={
                  <Space>
                    <BarChartOutlined />
                    Статистика
                  </Space>
                }
                key="1"
              >
                <Spin spinning={loading}>
                  <StatisticsContent />
                </Spin>
              </TabPane>

              <TabPane
                tab={
                  <Space>
                    <TeamOutlined />
                    Пользователи
                  </Space>
                }
                key="2"
              >
                <div>
                  <UsersTable
                    users={users}
                    loading={loading}
                    onRefresh={handleRefresh}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    onCreateUser={handleCreateUser}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                  />
                </div>
              </TabPane>

              <TabPane
                tab={
                  <Space>
                    <FileOutlined />
                    Файлы
                  </Space>
                }
                key="3"
              >
                <div style={{ padding: "0 0 24px" }}>
                  <Title
                    level={4}
                    style={{
                      marginBottom: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FileOutlined style={{ color: "#1890ff" }} />
                    Управление файлами
                  </Title>
                  <FileUploadSection />
                </div>
              </TabPane>

              <TabPane
                tab={
                  <Space>
                    <NotificationOutlined />
                    Новости
                  </Space>
                }
                key="4"
              >
                <div>
                  <AddNewsForm />
                </div>
              </TabPane>

              <TabPane
                tab={
                  <Space>
                    <BellOutlined />
                    Рассылка
                  </Space>
                }
                key="5"
              >
                <div>
                  <NotificationSender />
                </div>
              </TabPane>
            </>
          )}
        </Tabs>
      </Card>

      {/* Диалог редактирования пользователя */}
      <UserEditDialog
        open={editDialogOpen}
        user={currentUser}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveUser}
        loading={userLoading}
      />
    </div>
  );
};

export default Setting;
