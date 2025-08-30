// components/UserEditDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Switch,
  Alert,
  Spin,
  Row,
  Col,
  DatePicker,
  Radio
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const UserEditDialog = ({ open, user, onClose, onSave, loading, error }) => {
  const [form] = Form.useForm();
  const [subscriptionAction, setSubscriptionAction] = useState("none");
  const [subscriptionDuration, setSubscriptionDuration] = useState("");
  const [subscriptionUpdating, setSubscriptionUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "user",
      });
      
      // Сбрасываем состояние подписки при открытии
      setSubscriptionAction(user.has_subscription ? "extend" : "none");
      setSubscriptionDuration("");
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Сохраняем основные данные пользователя
      await onSave({
        id: user.id,
        ...values,
      });

      // Отдельный запрос для управления подпиской
      if (subscriptionAction !== "none") {
        setSubscriptionUpdating(true);
        
        let requestBody = {};
        
        switch (subscriptionAction) {
          case "grant":
            requestBody = { 
              action: "grant", 
              duration: subscriptionDuration 
            };
            break;
          case "extend":
            requestBody = { 
              action: "extend", 
              duration: subscriptionDuration || "7d" 
            };
            break;
          case "revoke":
            requestBody = { action: "revoke" };
            break;
          default:
            break;
        }

        await fetch(`https://edutalks.ru/api/admin/users/${user.id}/subscription`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(requestBody),
        });

        setSubscriptionUpdating(false);
      }

      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setSubscriptionUpdating(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSubscriptionAction("none");
    setSubscriptionDuration("");
    onClose();
  };

  return (
    <Modal
      title={user ? "Редактирование пользователя" : "Создание пользователя"}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading || subscriptionUpdating}
        >
          Сохранить
        </Button>,
      ]}
      width={600}
    >
      {error && (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: "user",
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="full_name"
              label="Полное имя"
              rules={[{ required: true, message: "Введите полное имя" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Введите полное имя" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Введите корректный email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Телефон"
            >
              <Input prefix={<PhoneOutlined />} placeholder="Телефон" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Адрес"
            >
              <TextArea
                rows={2}
                prefix={<HomeOutlined />}
                placeholder="Адрес"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Роль"
              rules={[{ required: true, message: "Выберите роль" }]}
            >
              <Select placeholder="Выберите роль">
                <Option value="user">Пользователь</Option>
                <Option value="admin">Администратор</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Управление подпиской">
              <Radio.Group
                value={subscriptionAction}
                onChange={(e) => setSubscriptionAction(e.target.value)}
                style={{ width: "100%" }}
              >
                <Radio value="none">Не изменять</Radio>
                <Radio value="grant">Выдать подписку</Radio>
                <Radio value="extend">Продлить подписку</Radio>
                <Radio value="revoke">Отключить подписку</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {(subscriptionAction === "grant" || subscriptionAction === "extend") && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Длительность подписки">
                <Select
                  value={subscriptionDuration}
                  onChange={setSubscriptionDuration}
                  placeholder="Выберите длительность"
                >
                  <Option value="7d">7 дней</Option>
                  <Option value="monthly">1 месяц</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>

      {(loading || subscriptionUpdating) && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Spin tip="Сохранение..." />
        </div>
      )}
    </Modal>
  );
};

export default UserEditDialog;