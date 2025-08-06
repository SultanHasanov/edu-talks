import React, { useEffect, useState } from "react";
import { Result, Button, Card, Typography, Space, Spin, Alert } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  CrownOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom"; // Если используете React Router v6
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const access_token = localStorage.getItem("access_token");

    useEffect(() => {
      // Получаем параметры из URL (ЮKassa передает их после успешного платежа)
      const paymentId = searchParams.get('payment_id');

      if (paymentId) {
        checkPaymentStatus(paymentId);
      } else {
        setError("Не найден идентификатор платежа");
        setLoading(false);
      }
    }, [searchParams]);

    const checkPaymentStatus = async (paymentId) => {
      try {
        const response = await axios.get(
          ` /api/payment-status/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        setPaymentStatus(response.data);
      } catch (error) {
        console.error("Ошибка при проверке статуса платежа:", error);
        setError("Не удалось проверить статус платежа");
      } finally {
        setLoading(false);
      }
    };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToFiles = () => {
    navigate("/templates");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Card style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "20px" }}>
            <Text>Проверяем статус платежа...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Result
            status="error"
            title="Ошибка при проверке платежа"
            subTitle={error}
            extra={[
              <Button type="primary" key="home" onClick={handleGoHome}>
                На главную
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  const isPaymentSuccessful = true;

  return (
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {isPaymentSuccessful ? (
          <div>
            {/* Успешный результат */}
            <Result
              icon={
                <CheckCircleOutlined
                  style={{
                    color: "#52c41a",
                    fontSize: "72px",
                  }}
                />
              }
              title={
                <Title
                  level={2}
                  style={{ color: "#52c41a", marginBottom: "8px" }}
                >
                  Подписка успешно оформлена!
                </Title>
              }
              subTitle={
                <Paragraph style={{ fontSize: "16px", color: "#666" }}>
                  Поздравляем! Ваша подписка активирована. Теперь у вас есть
                  полный доступ ко всем документам и материалам.
                </Paragraph>
              }
              extra={[
                <Button
                  type="primary"
                  size="large"
                  icon={<FileOutlined />}
                  onClick={handleGoToFiles}
                  key="files"
                  style={{ marginRight: "12px" }}
                >
                  Перейти к файлам
                </Button>,
                <Button
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                  key="home"
                >
                  На главную
                </Button>,
              ]}
            />

            {/* Карточка с преимуществами */}
            <Card
              style={{
                marginTop: "32px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
              }}
              bodyStyle={{ padding: "32px" }}
            >
              <div style={{ textAlign: "center" }}>
                <CrownOutlined
                  style={{
                    fontSize: "48px",
                    color: "#faad14",
                    marginBottom: "16px",
                  }}
                />
                <Title
                  level={3}
                  style={{ color: "white", marginBottom: "24px" }}
                >
                  Ваши новые возможности
                </Title>
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  }}
                >
                  <div>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: "8px" }}
                    />
                    <Text style={{ color: "white" }}>
                      Неограниченное скачивание документов
                    </Text>
                  </div>
                  <div>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: "8px" }}
                    />
                    <Text style={{ color: "white" }}>
                      Доступ ко всем категориям
                    </Text>
                  </div>
                  <div>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: "8px" }}
                    />
                    <Text style={{ color: "white" }}>
                      Приоритетная поддержка
                    </Text>
                  </div>
                  <div>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: "8px" }}
                    />
                    <Text style={{ color: "white" }}>
                      Обновления в реальном времени
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Информационное сообщение */}
            <Alert
              message="Важная информация"
              description="Доступ к материалам активирован автоматически. Если у вас возникнут вопросы, обратитесь в службу поддержки."
              type="info"
              showIcon
              style={{ marginTop: "24px" }}
            />
          </div>
        ) : (
          <Result
            status="warning"
            title="Платеж обрабатывается"
            subTitle="Ваш платеж находится в обработке. Подписка будет активирована в течение нескольких минут."
            extra={[
              <Button type="primary" key="home" onClick={handleGoHome}>
                На главную
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
