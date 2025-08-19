import React from 'react';
import { Button, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { 
  FileTextOutlined, 
  DownloadOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const handleStartFree = () => {
    // Здесь будет логика перехода на основной сайт
    window.location.href = '/recomm';
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
          <Button 
            type="primary" 
            size="large" 
            onClick={handleStartFree}
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
        </div>
      </div>

      {/* Target Audience Section */}
      <div style={{ 
        background: '#f5f5f5',
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
        background: 'white',
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
          <Button 
            type="primary" 
            size="large" 
            onClick={handleStartFree}
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