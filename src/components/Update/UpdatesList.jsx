import React from 'react';
import { Card, List, Tag, Typography, Badge } from 'antd';
import { RocketOutlined, CheckCircleOutlined, SecurityScanOutlined, BugOutlined, CrownOutlined, NotificationOutlined } from '@ant-design/icons';

const { Text } = Typography;

const UpdatesList = () => {
  // Статический список обновлений
  const updates = [
    {
      id: 1,
      title: "Новая система подписок",
      description: "Добавлены гибкие тарифы для подписки с различными периодами и возможностями",
      type: "feature",
      date: "2024-01-15",
      important: true
    },
    {
      id: 2,
      title: "Улучшенный поиск",
      description: "Поиск по документам теперь работает быстрее и точнее",
      type: "improvement",
      date: "2024-01-10",
      important: false
    },
    {
      id: 3,
      title: "Исправление безопасности",
      description: "Устранена уязвимость в системе аутентификации",
      type: "security",
      date: "2024-01-08",
      important: true
    },
    {
      id: 4,
      title: "Мобильная адаптация",
      description: "Улучшено отображение сайта на мобильных устройствах",
      type: "improvement",
      date: "2024-01-05",
      important: false
    },
    {
      id: 5,
      title: "Новые категории документов",
      description: "Добавлены 5 новых категорий для лучшей организации материалов",
      type: "feature",
      date: "2024-01-03",
      important: false
    },
    {
      id: 6,
      title: "Исправление загрузки файлов",
      description: "Устранена ошибка при загрузке больших PDF-файлов",
      type: "bugfix",
      date: "2023-12-28",
      important: false
    }
  ];

  const getUpdateTypeColor = (type) => {
    const colors = {
      feature: 'blue',
      bugfix: 'green',
      improvement: 'purple',
      security: 'red',
      announcement: 'orange',
    };
    return colors[type] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      feature: <CrownOutlined />,
      bugfix: <BugOutlined />,
      improvement: <RocketOutlined />,
      security: <SecurityScanOutlined />,
      announcement: <NotificationOutlined />,
    };
    return icons[type] || <RocketOutlined />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      feature: 'Функция',
      bugfix: 'Исправление',
      improvement: 'Улучшение',
      security: 'Безопасность',
      announcement: 'Объявление',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Сортируем обновления по дате (новые сверху)
  const sortedUpdates = [...updates].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <Card 
      title={
        <span className="flex items-center">
          <RocketOutlined className="mr-2" />
          Последние обновления
          <Badge 
            count={sortedUpdates.length} 
            className="ml-2" 
          />
        </span>
      }
      className="mt-6 shadow-lg border-0 rounded-xl"
    >
      <List
        dataSource={sortedUpdates}
        renderItem={(update) => (
          <List.Item
            className="py-4 border-b border-gray-100 last:border-b-0"
          >
            <List.Item.Meta
              avatar={
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  {getTypeIcon(update.type)}
                </div>
              }
              title={
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Text strong className="text-base">
                    {update.title}
                  </Text>
                  <Tag 
                    color={getUpdateTypeColor(update.type)} 
                    className="m-0 flex items-center gap-1"
                  >
                    {getTypeLabel(update.type)}
                  </Tag>
                </div>
              }
              description={
                <div className="space-y-2">
                  <Text className="text-xs text-gray-500">
                    {formatDate(update.date)}
                  </Text>
                  <div className="text-sm text-gray-700">
                    {update.description}
                  </div>
                  {update.important && (
                    <Tag 
                      color="red" 
                      icon={<CheckCircleOutlined />}
                      className="mt-2"
                    >
                      Важное обновление
                    </Tag>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <Text className="text-sm text-gray-600">
          💡 Хотите предложить улучшение? Напишите нам!
        </Text>
      </div>
    </Card>
  );
};

export default UpdatesList;