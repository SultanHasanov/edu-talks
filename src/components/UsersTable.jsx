import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Dropdown,
  Card,
  Spin,
  Avatar,
  Row,
  Col,
  Pagination,
  Select,
  Badge,
  Input,
} from "antd";
import {
  MoreOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  TeamOutlined,
  SafetyOutlined,
  MailOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { CheckCircle, XCircle } from "lucide-react";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const UsersTable = ({
  users,
  loading,
  onEditUser,
  onCreateUser,
  pagination,
  onTableChange,
  showDeleteConfirm,
  onRefresh,
  filters, // новые пропсы для фильтров
  onFiltersChange, // функция обновления фильтров
}) => {
  const safeUsers = users || [];
  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    try {
      return new Date(dateString).toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Обработчики изменения фильтров
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, q: value, page: 1 });
  };

  const handleRoleChange = (value) => {
    onFiltersChange({ ...filters, role: value, page: 1 });
  };

  const handleSubscriptionChange = (value) => {
    onFiltersChange({
      ...filters,
      has_subscription: value !== null ? value.toString() : null,
      page: 1,
    });
  };

  const handlePageSizeChange = (value) => {
    onFiltersChange({ ...filters, page_size: value, page: 1 });
  };

  const handlePageChange = (page) => {
    onFiltersChange({ ...filters, page });
  };

  // Статистика для заголовка
  const userStats = {
    total: safeUsers.length,
    admins: safeUsers.filter((u) => u.role === "admin").length,
    users: safeUsers.filter((u) => u.role === "user").length,
    subscribed: safeUsers.filter((u) => u.has_subscription).length,
  };

  const getActionItems = (user) => [
    {
      key: "edit",
      icon: <EditOutlined style={{ color: "#1890ff" }} />,
      label: "Редактировать",
      onClick: () => onEditUser(user),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: <span>Удалить</span>,
      onClick: () => showDeleteConfirm(user),
      danger: true,
    },
  ];

  const columns = [
    {
      title: "Пользователь",
      dataIndex: "full_name",
      key: "user",
      width: 220,
      render: (name, record) => (
        <Space>
          <Badge
            count={
              record.role === "admin" ? (
                <CrownOutlined style={{ color: "#faad14" }} />
              ) : null
            }
            offset={[-5, 24]}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                backgroundColor:
                  record.role === "admin" ? "#722ed1" : "#1890ff",
              }}
            />
          </Badge>
          <div>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>
              {name || "Не указано"}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "13px" }}>
              {record.email || "Email не указан"}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Контакты",
      key: "contacts",
      width: 200,
      render: (_, record) => (
        <div>
          <div
            style={{ marginBottom: 4, display: "flex", alignItems: "center" }}
          >
            <MailOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            <Text>{record.email || "Не указан"}</Text>
            {record.email_verified ? (
              <CheckCircle
                size={16}
                style={{ marginLeft: 8, color: "#52c41a" }}
              />
            ) : (
              <XCircle size={16} style={{ marginLeft: 8, color: "#ff4d4f" }} />
            )}
          </div>
          {record.phone && (
            <div>
              <PhoneOutlined style={{ marginRight: 8, color: "#52c41a" }} />
              <Text>{record.phone}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Статус",
      key: "status",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag
            icon={
              record.role === "admin" ? <CrownOutlined /> : <UserOutlined />
            }
            color={record.role === "admin" ? "gold" : "blue"}
            style={{
              borderRadius: "16px",
              fontWeight: 500,
              marginRight: 0,
            }}
          >
            {record.role === "admin" ? "Администратор" : "Пользователь"}
          </Tag>
          <Tag
            icon={
              record.has_subscription ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
            color={record.has_subscription ? "green" : "default"}
            style={{
              borderRadius: "16px",
              fontWeight: 500,
            }}
          >
            {record.has_subscription ? "Подписка активна" : "Без подписки"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Активность",
      dataIndex: "created_at",
      key: "activity",
      width: 160,
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          <Text style={{ color: "#595959", fontSize: "13px" }}>
            {formatDate(date)}
          </Text>
        </div>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record) }}
          placement="bottomRight"
          trigger={["click"]}
          overlayStyle={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "6px",
            }}
          />
        </Dropdown>
      ),
    },
  ];

  const getUserWordForm = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) return "пользователей";
    if (mod10 === 1) return "пользователь";
    if (mod10 >= 2 && mod10 <= 4) return "пользователя";
    return "пользователей";
  };

  return (
    <div>
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "none",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            padding: "16px 24px",
            backgroundColor: "#fafafa",
            borderTop: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8} lg={6} style={{ marginBottom: 8 }}>
              <Search
                placeholder="Поиск по имени или email"
                allowClear
                enterButton={<SearchOutlined />}
                value={filters.q || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                onSearch={handleSearchChange}
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} style={{ marginBottom: 8 }}>
              <Select
                placeholder="Роль"
                style={{ width: "100%" }}
                suffixIcon={<FilterOutlined />}
                allowClear
                value={filters.role || null}
                onChange={handleRoleChange}
              >
                <Option value="admin">Администратор</Option>
                <Option value="user">Пользователь</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} style={{ marginBottom: 8 }}>
              <Select
                placeholder="Подписка"
                style={{ width: "100%" }}
                suffixIcon={<FilterOutlined />}
                allowClear
                value={
                  filters.has_subscription !== null
                    ? filters.has_subscription === "true"
                    : null
                }
                onChange={handleSubscriptionChange}
              >
                <Option value={true}>Активна</Option>
                <Option value={false}>Не активна</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6} md={4} lg={3} style={{ marginBottom: 8 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                style={{ width: "100%" }}
              >
                Обновить
              </Button>
            </Col>
          </Row>
        </div>

        {/* Таблица */}
        <div style={{ padding: "24px" }}>
          <Spin spinning={loading} tip="Загрузка пользователей...">
            <Table
              columns={columns}
              dataSource={safeUsers}
              rowKey="id"
              pagination={false}
              style={{
                borderRadius: "8px",
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-even" : "table-row-odd"
              }
              locale={{
                emptyText: (
                  <div
                    style={{
                      padding: "60px 20px",
                      textAlign: "center",
                      color: "#8c8c8c",
                    }}
                  >
                    <UserOutlined
                      style={{ fontSize: "48px", color: "#d9d9d9" }}
                    />
                    <div style={{ marginTop: "16px", fontSize: "16px" }}>
                      Пользователи не найдены
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "14px" }}>
                      Попробуйте изменить параметры поиска
                    </div>
                    <Button
                      type="primary"
                      onClick={onCreateUser}
                      style={{ marginTop: 16 }}
                    >
                      Создать пользователя
                    </Button>
                  </div>
                ),
              }}
            />
          </Spin>

          {/* Пагинация */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space align="center">
              <Text type="secondary">Показать:</Text>
              <Select
                value={filters.page_size || 10}
                onChange={handlePageSizeChange}
                style={{ width: 80 }}
              >
                {[5, 10, 15, 20, 50].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
              <Text type="secondary">
                {getUserWordForm(filters.page_size || 10)}
              </Text>
            </Space>

            <Pagination
              current={filters.page || 1}
              pageSize={filters.page_size || 10}
              total={pagination?.total || 0}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) => (
                <Text type="secondary">
                  {range[0]}-{range[1]} из {total}
                </Text>
              )}
            />
          </div>
        </div>
      </Card>

      <style jsx>{`
        .table-row-even {
          background-color: #ffffff;
        }
        .table-row-odd {
          background-color: #fafafa;
        }
        .table-row-even:hover,
        .table-row-odd:hover {
          background-color: #f0f9ff !important;
        }
        .ant-table-thead > tr > th {
          background-color: #f5f5f5;
          font-weight: 600;
          color: #262626;
          border-bottom: 2px solid #e8e8e8;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0;
        }
        .ant-dropdown-menu {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .ant-dropdown-menu-item {
          border-radius: 4px;
          margin: 2px 4px;
        }
        .ant-btn-primary {
          font-weight: 500;
        }
        input:focus {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default UsersTable;
