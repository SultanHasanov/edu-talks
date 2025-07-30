// components/UsersTable.jsx
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
  Tooltip,
  Row,
  Col,
  Divider,
  Pagination,
  Select,
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
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const UsersTable = ({
 users,
  loading,
  onRefresh,
  onEditUser,
  onDeleteUser,
  onCreateUser,
  pagination,
  onTableChange,
}) => {
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


  const getActionItems = (user) => [
    {
      key: "edit",
      icon: <EditOutlined style={{ color: "#1890ff" }} />,
      label: "Редактировать",
      onClick: () => onEditUser(user),
    },
    {
      key: "delete",
      icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
      label: <span style={{ color: "#ff4d4f" }}>Удалить</span>,
      onClick: () => onDeleteUser(user),
      danger: true,
    },
  ];

  const columns = [
    {
      title: "Пользователь",
      dataIndex: "full_name",
      key: "user",
      width: 200,
      render: (name, record) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{
              backgroundColor: record.role === "admin" ? "#722ed1" : "#1890ff",
            }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>
              {name || "Не указано"}
            </div>
            <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
              @{record.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (email) => (
        <span style={{ color: "#595959" }}>{email || "Не указан"}</span>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <Tag
          icon={role === "admin" ? <CrownOutlined /> : <UserOutlined />}
          color={role === "admin" ? "purple" : "blue"}
          style={{ borderRadius: "16px", fontWeight: 500 }}
        >
          {role === "admin" ? "Администратор" : "Пользователь"}
        </Tag>
      ),
    },
    {
      title: "Дата регистрации",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (date) => (
        <span style={{ color: "#595959", fontSize: "13px" }}>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: "Подписка",
      dataIndex: "has_subscription",
      key: "has_subscription",
      width: 120,
      align: "center",
      render: (hasSubscription) => (
        <Tag
          icon={
            hasSubscription ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          color={hasSubscription ? "success" : "default"}
          style={{ borderRadius: "16px", fontWeight: 500 }}
        >
          {hasSubscription ? "Активна" : "Отсутствует"}
        </Tag>
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
        }}
      >
        {/* Заголовок и действия */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space align="center">
              <Title level={4} style={{ margin: 0, color: "#262626" }}>
                Пользователи системы
              </Title>
              <Tag
                color="blue"
                style={{
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {pagination?.total || 0}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title="Обновить список">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  style={{
                    borderRadius: "8px",
                    height: "36px",
                  }}
                  loading={loading}
                >
                  Обновить
                </Button>
              </Tooltip>
              {/* <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreateUser}
                style={{
                  borderRadius: "8px",
                  height: "36px",
                  background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                  border: "none",
                  boxShadow: "0 2px 4px rgba(24,144,255,0.2)",
                }}
              >
                Добавить пользователя
              </Button> */}
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: "0 0 24px 0" }} />

        {/* Таблица */}
         <Spin spinning={loading} tip="Загрузка пользователей...">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={false}
            onChange={onTableChange}
            style={{
              backgroundColor: "#fafafa",
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
                    Добавьте первого пользователя в систему
                  </div>
                </div>
              ),
            }}
          />
        </Spin>
         <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Space align="center">
            <span>На странице</span>
            <Select
              value={pagination?.pageSize || 10}
              onChange={(value) => {
                onTableChange({
                  current: 1,
                  pageSize: value,
                });
              }}
              style={{ width: 80 }}
            >
              {[5, 10, 15, 20, 50].map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
            <span>{getUserWordForm(pagination?.pageSize || 10)}</span>
          </Space>

          <Pagination
            current={pagination?.current}
            pageSize={pagination?.pageSize}
            total={pagination?.total}
            onChange={(newPage) => {
              onTableChange({
                current: newPage,
                pageSize: pagination?.pageSize,
              });
            }}
            showSizeChanger={false}
          />
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
          background-color: #e6f7ff !important;
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
      `}</style>
    </div>
  );
};

export default UsersTable;