import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Tabs,
  Typography,
  Row,
  Col,
  Space,
  Spin,
  message,
  Modal,
  Progress,
  Table,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  TeamOutlined,
  FileOutlined,
  NotificationOutlined,
  BarChartOutlined,
  SettingOutlined,
  EllipsisOutlined,
  CrownOutlined,
  BellOutlined,
  StopOutlined,
  ReadOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import UsersTable from "../components/UsersTable";
import UserEditDialog from "../components/UserEditDialog";
import AddNewsForm from "../components/AddNewsForm";
import FileUploadSection from "../components/FileUploadSection";
import { useAuth } from "../context/AuthContext";
import NotificationSender from "../components/NotificationSender";
import ArticleEditor from "../components/ArticleEditor";
import TabManager from "../components/TabManager";
import LogViewer from "../components/LogViewer";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const Setting = () => {
  const { role, email, phone, address, full_name } = useAuth();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("settingsActiveTab") || "1"
  );
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState(null);
  const access_token = localStorage.getItem("access_token");
  // Состояния для управления редактированием пользователей
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    q: null,
    role: null,
    has_subscription: null,
  });
  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    full_name: full_name || "",
    email: email || "",
    phone: phone || "",
    address: address || "",
  });
  const searchTimeoutRef = useRef(null);
  // Загрузка пользователей для админа
  useEffect(() => {
    if (isAdmin && access_token) {
      fetchUsers();
      fetchNews();
    }
  }, [isAdmin, activeTab, access_token]);
  // Добавьте useEffect для очистки таймера
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Добавляем состояние для инициализации
  const [isInitialized, setIsInitialized] = useState(false);

  // Общая функция загрузки данных
  const fetchUsers = async (filtersParams = filters) => {
    if (!access_token) {
      message.error("Требуется авторизация");
      return;
    }
    setLoading(true);
    try {
      // Создаем параметры запроса
      const params = new URLSearchParams();

      Object.entries(filtersParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          params.append(key, value);
        }
      });

      const response = await fetch(
        `https://edutalks.ru/api/admin/users?${params.toString()}`,
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

  // Функция обновления фильтров
  // Функция обновления фильтров с debounce
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймер с задержкой 500ms
    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers(newFilters);
    }, 500);
  };

  // Функция обновления данных
  const handleRefresh = async () => {
    await fetchUsers(filters);
  };

  // Первичная загрузка данных
  useEffect(() => {
    if (!isInitialized) {
      fetchUsers(pagination.current, pagination.pageSize);
    }
  }, [isInitialized]);

  // Обновленная функция обновления данных

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
    // Сохраняем активную вкладку в localStorage
    localStorage.setItem("settingsActiveTab", key);
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

  const showDeleteConfirm = (user) => {
    Modal.confirm({
      title: "Вы уверены, что хотите удалить пользователя?",
      content: (
        <span>
          Пользователь:{" "}
          <Typography.Text strong style={{ fontSize: "16px" }}>
            {user.full_name}
          </Typography.Text>{" "}
          будет удален
        </span>
      ),
      okText: "Удалить",
      okType: "danger",
      cancelText: "Отмена",
      async onOk() {
        try {
          const response = await fetch(
            `https://edutalks.ru/api/admin/users/${user.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Ошибка при удалении");
          }

          message.success("Пользователь успешно удален");
          fetchUsers();
        } catch (error) {
          message.error("Не удалось удалить пользователя");
          console.error("Ошибка:", error);
        }
      },
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

  const StatisticsContent = () => {
    const [stats, setStats] = useState({
      admins: 0,
      news_count: 0,
      regular_users: 0,
      total_users: 0,
      with_subscription: 0,
      with_subscription_pct: 0,
      without_subscription: 0,
      without_subscription_pct: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://edutalks.ru/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Добавьте токен авторизации
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка загрузки статистики");
        }

        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error("Ошибка:", error);
        // Можно добавить уведомление об ошибке
      } finally {
        setLoading(false);
      }
    };

    const dataSource = [
      {
        key: "1",
        metric: "Всего пользователей",
        value: stats.total_users,
        icon: <TeamOutlined />,
        color: "#3f8600",
      },
      {
        key: "2",
        metric: "Администраторов",
        value: stats.admins,
        icon: <CrownOutlined />,
        color: "#cf1322",
      },
      {
        key: "3",
        metric: "Обычных пользователей",
        value: stats.regular_users,
        icon: <UserOutlined />,
        color: "#1890ff",
      },
      {
        key: "4",
        metric: "С подпиской",
        value: `${stats.with_subscription} (${stats.with_subscription_pct}%)`,
        icon: <SafetyOutlined />,
        color: "#52c41a",
      },
      {
        key: "5",
        metric: "Без подписки",
        value: stats.without_subscription,
        icon: <StopOutlined />,
        color: "#fa8c16",
      },
      {
        key: "6",
        metric: "Новостей",
        value: stats.news_count,
        icon: <NotificationOutlined />,
        color: "#faad14",
      },
    ];

    const columns = [
      {
        title: "Метрика",
        dataIndex: "metric",
        key: "metric",
        render: (text, record) => (
          <Space>
            {React.cloneElement(record.icon, {
              style: { color: record.color },
            })}
            {text}
          </Space>
        ),
      },
      {
        title: "Значение",
        dataIndex: "value",
        key: "value",
        render: (value, record) => (
          <Text strong style={{ color: record.color, fontSize: "16px" }}>
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
          loading={loading}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="middle"
            loading={loading}
          />
        </Card>

        <Card title="Детализация подписок" loading={loading}>
          <Row gutter={16}>
            <Col span={12}>
              <Progress
                type="dashboard"
                percent={stats.with_subscription_pct}
                strokeColor="#52c41a"
                format={() => `${stats.with_subscription}/${stats.total_users}`}
              />
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text strong>Пользователей с подпиской</Text>
              </div>
            </Col>
            <Col span={12}>
              <Progress
                type="dashboard"
                percent={stats.without_subscription_pct}
                strokeColor="#fa8c16"
                format={() =>
                  `${stats.without_subscription}/${stats.total_users}`
                }
              />
              <div style={{ textAlign: "center", marginTop: 16 }}>
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
                    onEditUser={handleEditUser}
                    showDeleteConfirm={showDeleteConfirm}
                    onCreateUser={handleCreateUser}
                    pagination={pagination}
                    onRefresh={handleRefresh}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
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
              <TabPane
                tab={
                  <Space>
                    <ReadOutlined />
                    Статьи
                  </Space>
                }
                key="6"
              >
                <div>
                  <ArticleEditor />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <Space>
                    <ReadOutlined />
                    Вкладки
                  </Space>
                }
                key="7"
              >
                <div>
                  <TabManager />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <Space>
                    <ProfileOutlined />
                    Логи
                  </Space>
                }
                key="8"
              >
                <div>
                  <LogViewer />
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
