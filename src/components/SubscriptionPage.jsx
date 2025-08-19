import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Tag,
  Alert,
  Modal,
  Spin,
  message,
  Radio,
} from "antd";
import {
  CrownOutlined,
  CheckOutlined,
  StarOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const access_token = localStorage.getItem("access_token");

const [selectedPlan, setSelectedPlan] = useState("halfyear");

  const plans = {
    monthly: {
      title: "Месяц",
      price: 1250,
      period: "месяц",
    },
    halfyear: {
      title: "6 месяцев",
      price: 7500,
      period: "6 месяцев",
      popular: true,
    },
    yearly: {
      title: "1 год",
      price: 15000,
      period: "год",
    },
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `https://edutalks.ru/api/pay?plan=${selectedPlan}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data.data.confirmation_url) {
        window.location.href = response.data.data.confirmation_url;
      } else {
        message.error("Не удалось получить ссылку на оплату");
      }
    } catch (error) {
      console.error("Ошибка при оформлении подписки:", error);
      message.error("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
      setConfirmModalOpen(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const PlanCard = ({ planKey, plan }) => {
    const isSelected = selectedPlan === planKey;
    let monthlyEquivalent;

    if (plan.period === "год") {
      monthlyEquivalent = Math.round(plan.price / 12);
    } else if (plan.period === "6 месяцев") {
      monthlyEquivalent = Math.round(plan.price / 6);
    } else {
      monthlyEquivalent = plan.price;
    }

    return (
      <Card
        hoverable
        className={`plan-card ${isSelected ? "selected" : ""} ${
          plan.popular ? "popular" : ""
        }`}
        onClick={() => setSelectedPlan(planKey)}
        style={{
          border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
          borderRadius: "12px",
          position: "relative",
          height: "100%",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        {plan.popular && (
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(45deg, #ff6b35, #ff8e35)",
              color: "white",
              padding: "4px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
            }}
          >
            <StarOutlined /> ПОПУЛЯРНЫЙ
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title
            level={3}
            style={{ margin: 0, color: isSelected ? "#1890ff" : "#262626" }}
          >
            {plan.title}
          </Title>

          {plan.savings && (
            <Tag
              color="green"
              style={{
                marginTop: "8px",
                padding: "4px 12px",
                borderRadius: "16px",
                border: "none",
                fontSize: "12px",
              }}
            >
              <GiftOutlined /> {plan.savings}
            </Tag>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <Title
              level={1}
              style={{
                margin: 0,
                color: isSelected ? "#1890ff" : "#262626",
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              {formatPrice(plan.price)}
            </Title>
          </div>

          <Text type="secondary" style={{ fontSize: "16px" }}>
            за {plan.period}
          </Text>

          {(plan.period === "год" || plan.period === "6 месяцев") && (
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                ≈ {formatPrice(monthlyEquivalent)} в месяц
              </Text>
            </div>
          )}
        </div>

        
        <Radio
          checked={isSelected}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        />
      </Card>
    );
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Заголовок */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Title level={1} style={{ fontSize: "48px", marginBottom: "16px" }}>
            <CrownOutlined style={{ color: "#faad14", marginRight: "12px" }} />
            Выберите подписку
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Получите неограниченный доступ ко всем документам и материалам.
            Выберите план, который подходит именно вам.
          </Paragraph>
        </div>

        {/* Карточки планов */}
        <Row
          gutter={[24, 32]}
          justify="center"
          style={{ marginBottom: "48px" }}
        >
          <Col xs={24} md={8} lg={8}>
            <PlanCard planKey="monthly" plan={plans.monthly} />
          </Col>
          <Col xs={24} md={8} lg={8}>
            <PlanCard planKey="halfyear" plan={plans.halfyear} />
          </Col>
          <Col xs={24} md={8} lg={8}>
            <PlanCard planKey="yearly" plan={plans.yearly} />
          </Col>
        </Row>

        {/* Кнопка подписки */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => setConfirmModalOpen(true)}
            style={{
              height: "56px",
              fontSize: "18px",
              padding: "0 48px",
              borderRadius: "28px",
              background: "linear-gradient(45deg, #1890ff, #36cfc9)",
              border: "none",
              boxShadow: "0 4px 16px rgba(24, 144, 255, 0.3)",
            }}
          >
            Оформить подписку на {plans[selectedPlan].period}
          </Button>
        </div>

        {/* Преимущества */}
        <Card
          style={{
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            color: "white",
          }}
          bodyStyle={{ padding: "32px" }}
        >
          <Title
            level={3}
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Почему стоит выбрать нашу подписку?
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <SafetyOutlined
                  style={{
                    fontSize: "48px",
                    color: "#52c41a",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4} style={{ color: "white" }}>
                  Безопасность
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Все платежи защищены и обрабатываются через ЮKassa
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <ThunderboltOutlined
                  style={{
                    fontSize: "48px",
                    color: "#faad14",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4} style={{ color: "white" }}>
                  Мгновенный доступ
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Доступ к материалам активируется сразу после оплаты
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: "center" }}>
                <CrownOutlined
                  style={{
                    fontSize: "48px",
                    color: "#722ed1",
                    marginBottom: "16px",
                  }}
                />
                <Title level={4} style={{ color: "white" }}>
                  Премиум качество
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Эксклюзивные материалы и регулярные обновления
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Модальное окно подтверждения */}
        <Modal
          title="Подтверждение подписки"
          open={confirmModalOpen}
          onCancel={() => setConfirmModalOpen(false)}
          footer={null}
          centered
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CrownOutlined
              style={{
                fontSize: "64px",
                color: "#faad14",
                marginBottom: "24px",
              }}
            />
            <Title level={3}>Подтвердите оформление подписки</Title>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <Text strong style={{ fontSize: "16px" }}>
                {plans[selectedPlan].title}
              </Text>
              <br />
              <Title level={2} style={{ margin: "8px 0", color: "#1890ff" }}>
                {formatPrice(plans[selectedPlan].price)}
              </Title>
              <Text type="secondary">за {plans[selectedPlan].period}</Text>
            </div>
            <Alert
              message="Безопасная оплата"
              description="Вы будете перенаправлены на защищенную страницу ЮKassa для завершения платежа"
              type="info"
              showIcon
              style={{ marginBottom: "24px" }}
            />
            <Space size="large">
              <Button size="large" onClick={() => setConfirmModalOpen(false)}>
                Отмена
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubscribe}
                icon={<SafetyOutlined />}
              >
                Перейти к оплате
              </Button>
            </Space>
          </div>
        </Modal>
      </div>

      <style jsx>{`
        .plan-card.selected {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(24, 144, 255, 0.2);
        }

        .plan-card.popular {
          background: linear-gradient(135deg, #fff 0%, #f6ffed 100%);
        }

        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;
