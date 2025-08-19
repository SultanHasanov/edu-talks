import React from 'react';
import { 
  BankOutlined, 
  IdcardOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  CopyOutlined 
} from '@ant-design/icons';
import { 
  Typography, 
  Card, 
  Descriptions, 
  Divider, 
  message, 
  Tooltip 
} from 'antd';
import "../App.css"
export const RequisitesPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        messageApi.success('Скопировано в буфер обмена');
      })
      .catch(() => {
        messageApi.error('Не удалось скопировать');
      });
  };

  const renderCopyableText = (text) => {
    return (
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          position: 'relative',
          paddingRight: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.querySelector('.copy-icon').style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelector('.copy-icon').style.opacity = '0';
        }}
      >
        <span>{text}</span>
        <Tooltip title="Копировать">
          <CopyOutlined 
            className="copy-icon"
            style={{ 
              color: '#1890ff', 
              cursor: 'pointer',
              opacity: 0,
              position: 'absolute',
              right: 0,
              transition: 'opacity 0.2s',
              padding: '4px'
            }}
            onClick={() => copyToClipboard(text)} 
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div style={{ padding: "8px", maxWidth: "800px", margin: "0 auto" }}>
      {contextHolder}
      <Card
        title={
          <Typography.Title level={3} style={{ margin: 0 }}>
            <BankOutlined /> Банковские реквизиты
          </Typography.Title>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Валюта приёма платежей">
            Российский рубль (RUB)
          </Descriptions.Item>
          <Descriptions.Item label="Получатель">
            {renderCopyableText("Джабраилова Эсет Имрадиевна")}
          </Descriptions.Item>
          <Descriptions.Item label="Номер счёта">
            {renderCopyableText("40817810760360560198")}
          </Descriptions.Item>
          <Descriptions.Item label="Банк получателя">
            {renderCopyableText("Ставропольское отделение №5230 ПАО Сбербанк")}
          </Descriptions.Item>
          <Descriptions.Item label="БИК">
            {renderCopyableText("040702615")}
          </Descriptions.Item>
          <Descriptions.Item label="Корреспондентский счёт">
            {renderCopyableText("30101810907020000615")}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={4}>
          <IdcardOutlined /> Идентификационные данные
        </Typography.Title>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ИНН">
            {renderCopyableText("7707083893")}
          </Descriptions.Item>
          <Descriptions.Item label="КПП">
            {renderCopyableText("201443001")}
          </Descriptions.Item>
          <Descriptions.Item label="ОКПО">
            {renderCopyableText("66580921")}
          </Descriptions.Item>
          <Descriptions.Item label="ОГРН">
            {renderCopyableText("1027700132195")}
          </Descriptions.Item>
          <Descriptions.Item label="SWIFT-код">
            {renderCopyableText("SABRRUMMSP1")}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={4}>
          <HomeOutlined /> Адреса
        </Typography.Title>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Почтовый адрес банка">
            {renderCopyableText("364049, г. Грозный, ул. Дьякова, д. 21")}
          </Descriptions.Item>
          <Descriptions.Item label="Почтовый адрес дополнительного офиса">
            {renderCopyableText("366900, г. Гудермес, пр-кт А. Кадырова, д. 24")}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={4}>
          <PhoneOutlined /> Контактные данные
        </Typography.Title>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Email">
            {renderCopyableText("esutalks@mail.ru")}
          </Descriptions.Item>
          <Descriptions.Item label="Телефон">
            {renderCopyableText("+7 (963) 777-50-13")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};