import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message as antdMessage,
  Spin,
  Alert,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

const NotificationSender = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { access_token } = useAuth();

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await fetch(" /api/admin/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          subject: values.subject,
          message: values.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      antdMessage.success("Рассылка успешно отправлена!");
      form.resetFields();
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      antdMessage.error(`Ошибка при отправке: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            Отправка рассылки пользователям
          </Title>
        }
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
      >
        <Spin spinning={isLoading} tip="Отправка...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            disabled={isLoading}
          >
            <Form.Item
              name="subject"
              label="Тема сообщения"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите тему сообщения",
                },
              ]}
            >
              <Input placeholder="Введите тему сообщения" size="large" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Текст сообщения"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите текст сообщения",
                },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Введите текст сообщения для рассылки"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                size="large"
                block
                loading={isLoading}
                style={{
                  backgroundColor: "#1890ff",
                  height: 48,
                  fontSize: 16,
                }}
              >
                Отправить рассылку
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <Alert
          message="Информация о рассылке"
          description="Сообщение будет отправлено всем зарегистрированным пользователям системы. Пожалуйста, проверьте текст перед отправкой."
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default NotificationSender;
