import React, { useRef } from 'react';
import { Button, Row, Col, Card, Typography, Space, Divider, Tag } from 'antd';
import { 
  FileTextOutlined, 
  DownloadOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CrownOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const pricingRef = useRef(null);

  const handleStartFree = () => {
    window.location.href = '/subscription';
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const features = [
    {
      icon: <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Готовые документы',
      description: 'Приказы, локальные акты, положения и другие официальные документы для школы'
    },
    {
      icon: <DownloadOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'Скачивание образцов',
      description: 'Мгновенное скачивание документов в удобном формате для редактирования'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: 'Сценарии мероприятий',
      description: 'Готовые сценарии школьных праздников, линеек и педагогических советов'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#fa541c' }} />,
      title: 'Проверенные материалы',
      description: 'Все документы соответствуют актуальному законодательству РФ'
    }
  ];

  const targetAudience = [
    'Заместители директоров по УВР',
    'Директора школ',
    'Секретари образовательных учреждений',
    'Методисты и завучи',
    'Административный персонал школ'
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={1} style={{ 
            color: 'white', 
            fontSize: '2.2rem',
            marginBottom: '24px',
            fontWeight: 'bold'
          }}>
            📚 База готовых документов для образовательных учреждений
          </Title>
          <Title level={3} style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: 'normal',
            marginBottom: '32px'
          }}>
            Готовые документы и образцы для эффективного управления школой
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Экономьте время на подготовке документов. Получите доступ к проверенным образцам 
            приказов, локальных актов, сценариев и рекомендаций для школьной администрации.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => window.location.href = '/recomm'}
              style={{
                fontSize: '18px',
                height: '56px',
                padding: '0 48px',
                background: '#ff4d4f',
                borderColor: '#ff4d4f',
                borderRadius: '28px',
                boxShadow: '0 4px 15px rgba(255, 77, 79, 0.4)'
              }}
              icon={<RocketOutlined />}
            >
              Начать бесплатно
            </Button>
            <Button 
              size="large" 
              onClick={scrollToPricing}
              style={{
                fontSize: '18px',
                height: '56px',
                padding: '0 32px',
                background: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '28px'
              }}
              icon={<CrownOutlined />}
            >
              Посмотреть тарифы
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        background: 'white',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            Что вы получите на нашем сайте
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center', 
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  <div style={{ marginBottom: '24px' }}>
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#666', lineHeight: '1.6' }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={scrollToPricing}
              style={{
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
                borderRadius: '24px'
              }}
            >
              Выбрать тариф
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div ref={pricingRef} style={{ 
        background: '#f5f5f5',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Тарифы
          </Title>
          <Paragraph style={{ 
            textAlign: 'center', 
            fontSize: '18px',
            marginBottom: '60px',
            color: '#666'
          }}>
            Выберите подходящий вариант доступа к нашей базе документов
          </Paragraph>
          
          <Row gutter={[32, 32]} justify="center">
            {Object.entries(plans).map(([key, plan]) => (
              <Col xs={24} md={8} key={key}>
                <Card 
                  hoverable
                  style={{ 
                    height: '100%',
                    borderRadius: '12px',
                    border: plan.popular ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    position: 'relative',
                    boxShadow: plan.popular ? '0 8px 25px rgba(24, 144, 255, 0.15)' : '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                >
                  {plan.popular && (
                    <Tag 
                      color="blue" 
                      style={{ 
                        position: 'absolute', 
                        top: '-12px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold'
                      }}
                    >
                      ПОПУЛЯРНЫЙ
                    </Tag>
                  )}
                  
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={3} style={{ marginBottom: '8px' }}>
                      {plan.title}
                    </Title>
                    <div style={{ marginBottom: '16px' }}>
                      <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                        {plan.price.toLocaleString('ru-RU')} ₽
                      </Text>
                      <Text style={{ color: '#666', marginLeft: '8px' }}>
                        / {plan.period}
                      </Text>
                    </div>
                   
                  </div>
                  
                  <Divider />
                  
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <Text>Полный доступ к документам</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <Text>Неограниченное скачивание</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <Text>Техническая поддержка</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <Text>Обновления базы</Text>
                    </div>
                  </Space>
                  
                  <Button 
                    type={plan.popular ? 'primary' : 'default'} 
                    size="large" 
                    style={{ 
                      width: '100%', 
                      marginTop: '32px',
                      height: '48px',
                      borderRadius: '24px'
                    }}
                    onClick={handleStartFree}
                  >
                    {plan.popular ? 'Выбрать тариф' : 'Начать'}
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Target Audience Section */}
      <div style={{ 
        background: 'white',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} style={{ marginBottom: '24px' }}>
                Для кого создан этот сайт
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {targetAudience.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleOutlined style={{ 
                      color: '#52c41a', 
                      fontSize: '20px', 
                      marginRight: '12px' 
                    }} />
                    <Text style={{ fontSize: '16px' }}>{item}</Text>
                  </div>
                ))}
              </Space>
              <div style={{ marginTop: '32px' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={scrollToPricing}
                  style={{
                    borderRadius: '24px',
                    height: '48px',
                    padding: '0 32px'
                  }}
                >
                  Выбрать тариф
                </Button>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Card style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px'
              }}>
                <Title level={3} style={{ color: 'white', textAlign: 'center' }}>
                  ⏰ Экономьте время
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', textAlign: 'center' }}>
                  Не тратьте часы на поиск и создание документов с нуля. 
                  Используйте готовые проверенные образцы и адаптируйте их под свои нужды.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Document Types Section */}
      <div style={{ 
        background: '#f5f5f5',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            Типы документов на сайте
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card hoverable style={{ height: '100%', borderRadius: '12px' }}>
                <Title level={4} style={{ color: '#1890ff' }}>
                  📋 Приказы и распоряжения
                </Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Приказы по основной деятельности</li>
                  <li>Приказы по кадрам</li>
                  <li>Приказы по учащимся</li>
                  <li>Распоряжения администрации</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable style={{ height: '100%', borderRadius: '12px' }}>
                <Title level={4} style={{ color: '#52c41a' }}>
                  📄 Локальные акты
                </Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Положения и регламенты</li>
                  <li>Правила внутреннего распорядка</li>
                  <li>Должностные инструкции</li>
                  <li>Политики и процедуры</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card hoverable style={{ height: '100%', borderRadius: '12px' }}>
                <Title level={4} style={{ color: '#722ed1' }}>
                  🎭 Сценарии и рекомендации
                </Title>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Сценарии школьных мероприятий</li>
                  <li>Планы педсоветов</li>
                  <li>Методические рекомендации</li>
                  <li>Шаблоны отчетов</li>
                </ul>
              </Card>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={scrollToPricing}
              style={{
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
                borderRadius: '24px'
              }}
            >
              Посмотреть тарифы
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ color: 'white', marginBottom: '24px' }}>
            Готовы упростить документооборот в вашей школе?
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px'
          }}>
            Присоединяйтесь к сотням школьных администраторов, которые уже используют наш сайт 
            для эффективной работы с документами.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => window.location.href = '/recomm'}
              style={{
                fontSize: '18px',
                height: '56px',
                padding: '0 48px',
                background: 'white',
                borderColor: 'white',
                color: '#ff4d4f',
                borderRadius: '28px',
                fontWeight: 'bold'
              }}
              icon={<StarOutlined />}
            >
              Попробовать бесплатно
            </Button>
            <Button 
              size="large" 
              onClick={scrollToPricing}
              style={{
                fontSize: '18px',
                height: '56px',
                padding: '0 32px',
                background: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '28px'
              }}
              icon={<CrownOutlined />}
            >
              Выбрать тариф
            </Button>
          </Space>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        background: '#001529',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
          © 2024 edutalks.ru | Все материалы проверены и соответствуют актуальному законодательству
        </Text>
      </div>
    </div>
  );
};

export default LandingPage;