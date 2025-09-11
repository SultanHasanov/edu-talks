import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Select,
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  Statistic,
  Spin,
  Alert,
  Typography,
  Space,
  Badge,
  Progress,
  Divider
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const LogViewer = () => {
  const access_token = localStorage.getItem("access_token");
  const [logs, setLogs] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [stats, setStats] = useState({});
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Фильтры
  const [selectedDay, setSelectedDay] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(200);
  const [cursor, setCursor] = useState(0);

  // Уровни логов
  const logLevels = ['debug', 'info', 'warn', 'error', 'panic', 'fatal'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Получение доступных дней
// В функции fetchAvailableDays
const fetchAvailableDays = async () => {
  try {
    const response = await fetch('https://edutalks.ru/admin/logs/days', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    if (!response.ok) throw new Error('Ошибка получения дней');
    
    // Пробуем сначала как JSON, если не получается - как текст
    let days;
    try {
      days = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      // Пробуем распарсить текст как JSON
      try {
        days = JSON.parse(text);
      } catch (parseError) {
        // Если это HTML, пытаемся извлечь данные другим способом
        console.error('Ответ не является JSON:', text.substring(0, 100));
        throw new Error('Неверный формат ответа');
      }
    }
    
    setAvailableDays(days);
  } catch (err) {
    setError('Не удалось загрузить список дней: ' + err.message);
  }
};

// Аналогично для других функций нужно добавить обработку
const fetchLogs = async () => {
  setLoading(true);
  setError('');
  
  try {
    const params = new URLSearchParams({
      day: selectedDay,
      limit: limit.toString(),
      cursor: cursor.toString(),
    });

    if (selectedLevels.length > 0) {
      params.append('level', selectedLevels.join(','));
    }

    if (selectedHour !== null) {
      params.append('hour', selectedHour.toString());
    }

    if (searchQuery) {
      params.append('q', searchQuery);
    }

    const response = await fetch(`https://edutalks.ru/admin/logs?${params}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) throw new Error('Ошибка получения логов');

    // Обработка разных content-type
    let logsData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      logsData = await response.json();
    } else {
      const text = await response.text();
      try {
        logsData = JSON.parse(text);
      } catch (parseError) {
        console.error('Не удалось распарсить ответ:', text.substring(0, 200));
        throw new Error('Неверный формат логов');
      }
    }

    setLogs(logsData);
  } catch (err) {
    setError('Не удалось загрузить логи: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  // Получение статистики
  const fetchStats = async () => {
    try {
      const response = await fetch(`https://edutalks.ru/admin/logs/stats?day=${selectedDay}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка получения статистики');

      const statsData = await response.json();
      setStats(statsData);
    } catch (err) {
      console.error('Ошибка получения статистики:', err);
    }
  };

  // Получение сводки
  const fetchSummary = async (days = 7) => {
    try {
      const response = await fetch(`https://edutalks.ru/admin/logs/summary?days=${days}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка получения сводки');

      const summaryData = await response.json();
      setSummary(summaryData);
    } catch (err) {
      console.error('Ошибка получения сводки:', err);
    }
  };

  // Скачивание логов
  const downloadLogs = async () => {
    try {
      const response = await fetch(`https://edutalks.ru/admin/logs/download?day=${selectedDay}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error('Ошибка скачивания');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${selectedDay}.gz`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Не удалось скачать логи');
    }
  };

  // Колонки таблицы
  const columns = [
    {
      title: 'Время',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (timestamp) => dayjs(timestamp).format('HH:mm:ss'),
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => {
        const color = {
          debug: 'blue',
          info: 'green',
          warn: 'orange',
          error: 'red',
          panic: 'magenta',
          fatal: 'purple',
        }[level] || 'default';
        
        return <Badge color={color} text={level.toUpperCase()} />;
      },
    },
    {
      title: 'Сообщение',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
  ];

  // Эффекты
  useEffect(() => {
    if (access_token) {
      fetchAvailableDays();
      fetchSummary();
    }
  }, [access_token]);

  useEffect(() => {
    if (access_token && selectedDay) {
      fetchLogs();
      fetchStats();
    }
  }, [access_token, selectedDay, selectedLevels, selectedHour, searchQuery, limit, cursor]);

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Просмотр логов</Title>
        
        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError('')}
          />
        )}

        {/* Фильтры */}
        <Card size="small" title="Фильтры" extra={<FilterOutlined />}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Text strong>Дата:</Text>
              <Select
                value={selectedDay}
                onChange={setSelectedDay}
                style={{ width: '100%', marginTop: 8 }}
                loading={availableDays.length === 0}
              >
                {availableDays.map(day => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Text strong>Уровни:</Text>
              <Select
                mode="multiple"
                value={selectedLevels}
                onChange={setSelectedLevels}
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Все уровни"
              >
                {logLevels.map(level => (
                  <Option key={level} value={level}>
                    {level.toUpperCase()}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Text strong>Час:</Text>
              <Select
                value={selectedHour}
                onChange={setSelectedHour}
                style={{ width: '100%', marginTop: 8 }}
                placeholder="Все часы"
                allowClear
              >
                {hours.map(hour => (
                  <Option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Text strong>Поиск:</Text>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по тексту"
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>

          <Divider />

          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchLogs}
              loading={loading}
            >
              Обновить
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={downloadLogs}
              disabled={!selectedDay}
            >
              Скачать логи
            </Button>

            <Button
              icon={<BarChartOutlined />}
              onClick={() => fetchSummary(30)}
            >
              Статистика за 30 дней
            </Button>
          </Space>
        </Card>

        {/* Статистика за день */}
        <Card size="small" title={`Статистика за ${selectedDay}`} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            {Object.entries(stats).slice(0, 24).map(([hour, data]) => (
              <Col xs={12} sm={8} md={4} key={hour}>
                <Card size="small">
                  <Text strong>Час {hour}:</Text>
                  {data && Object.entries(data).map(([level, count]) => (
                    <div key={level}>
                      <Text type="secondary">{level}: </Text>
                      {count}
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Таблица логов */}
        <Card style={{ marginTop: 16 }}>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={logs.map((log, index) => ({ ...log, key: index }))}
              pagination={{
                pageSize: limit,
                current: Math.floor(cursor / limit) + 1,
                total: 1000, // Максимальное количество
                onChange: (page, pageSize) => {
                  setCursor((page - 1) * pageSize);
                  setLimit(pageSize);
                },
              }}
              scroll={{ x: true }}
            />
          </Spin>
        </Card>

        {/* Сводка за несколько дней */}
        <Card size="small" title="Сводка за последние дни" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            {summary.map((item) => (
              <Col xs={12} sm={8} md={4} key={item.date}>
                <Card size="small">
                  <Text strong>{item.date}</Text>
                  <br />
                  <Text>Всего: {item.total}</Text>
                  {item.levels && Object.entries(item.levels).map(([level, count]) => (
                    <div key={level}>
                      <Text type="secondary">{level}: </Text>
                      {count}
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default LogViewer;