import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Row,
  Col,
  Spin,
  Alert,
  Typography,
  Space,
  Badge,
  Divider,
} from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

const LogViewer = () => {
  const access_token = localStorage.getItem("access_token");
  const [logs, setLogs] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [stats, setStats] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Фильтры
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [cursor, setCursor] = useState(0);

  // Уровни логов
  const logLevels = ["debug", "info", "warn", "error", "panic", "fatal"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Получение доступных дней
  const fetchAvailableDays = async () => {
    try {
      const response = await fetch("https://edutalks.ru/api/admin/logs/days", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error("Ошибка получения дней");

      const data = await response.json();
      setAvailableDays(data.days || []);
    } catch (err) {
      setError("Не удалось загрузить список дней");
    }
  };

  // Получение логов
  const fetchLogs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        day: selectedDay,
        limit: limit.toString(),
        cursor: cursor.toString(),
      });

      if (selectedLevels.length > 0) {
        params.append("level", selectedLevels.join(","));
      }

      if (selectedHour !== null) {
        params.append("hour", selectedHour.toString());
      }

      if (searchQuery) {
        params.append("q", searchQuery);
      }

      const response = await fetch(
        `https://edutalks.ru/api/admin/logs?${params}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка получения логов");

      const logsData = await response.json();
      setLogs(logsData.items || []);
    } catch (err) {
      setError("Не удалось загрузить логи");
    } finally {
      setLoading(false);
    }
  };

  // Получение статистики
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/logs/stats?day=${selectedDay}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка получения статистики");

      const statsData = await response.json();
      setStats(statsData);
    } catch (err) {
      console.error("Ошибка получения статистики:", err);
    }
  };

  // Получение сводки
  const fetchSummary = async (days = 7) => {
    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/logs/summary?days=${days}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка получения сводки");

      const summaryData = await response.json();
      setSummary(summaryData);
    } catch (err) {
      console.error("Ошибка получения сводки:", err);
    }
  };

  // Скачивание логов
  const downloadLogs = async () => {
    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/logs/download?day=${selectedDay}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Ошибка скачивания");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logs-${selectedDay}.gz`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Не удалось скачать логи");
    }
  };

  // Колонки таблицы
  // Колонки
  const columns = [
    {
      title: "Сообщение",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (msg) => {
        if (msg == null) return "-";
        if (typeof msg === "string" || typeof msg === "number") return msg;
        try {
          return JSON.stringify(msg);
        } catch {
          return String(msg);
        }
      },
    },
    {
      title: "Путь",
      dataIndex: "path",
      key: "path",
      width: 120,
      render: (path) => {
        if (path == null) return "-";
        if (typeof path === "string" || typeof path === "number") return path;
        try {
          return JSON.stringify(path);
        } catch {
          return String(path);
        }
      },
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => {
        if (status == null) return "-";
        if (typeof status === "string" || typeof status === "number")
          return status;
        try {
          return JSON.stringify(status);
        } catch {
          return String(status);
        }
      },
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
  }, [
    access_token,
    selectedDay,
    selectedLevels,
    selectedHour,
    searchQuery,
    limit,
    cursor,
  ]);

  // Функция для преобразования сводки в массив для отображения
  const getSummaryArray = () => {
    if (!summary.by_day) return [];

    return Object.entries(summary.by_day).map(([date, levels]) => ({
      date,
      levels,
      total: Object.values(levels).reduce((sum, count) => sum + count, 0),
    }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Просмотр логов</Title>

        {error && (
          <Alert
            message="Ошибка"
            description={
              typeof error === "string" ? error : JSON.stringify(error)
            }
            type="error"
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError("")}
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
                style={{ width: "100%", marginTop: 8 }}
                loading={availableDays.length === 0}
              >
                {availableDays.map((day) => (
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
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Все уровни"
              >
                {logLevels.map((level) => (
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
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Все часы"
                allowClear
              >
                {hours.map((hour) => (
                  <Option key={hour} value={hour}>
                    {hour.toString().padStart(2, "0")}:00
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
        <Card
          size="small"
          title={`Статистика за ${selectedDay}`}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            {Object.entries(stats).map(([hour, data]) => (
              <Col xs={12} sm={8} md={4} key={hour}>
                <Card size="small">
                  <Text strong>Час {hour}:</Text>
                  {data && typeof data === "object" && (
                    <>
                      {Object.entries(data).map(([level, count]) => (
                        <div key={level}>
                          <Text type="secondary">{level}: </Text>
                          {typeof count === "number"
                            ? count
                            : JSON.stringify(count)}
                        </div>
                      ))}
                    </>
                  )}
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
                total: logs.length + cursor,
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
        <Card
          size="small"
          title="Сводка за последние дни"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            {getSummaryArray().map((item) => (
              <Col xs={12} sm={8} md={4} key={item.date}>
                <Card size="small">
                  <Text strong>{item.date}</Text>
                  <br />
                  <Text>Всего: {item.total}</Text>
                  {item.levels && (
                    <>
                      {Object.entries(item.levels).map(([level, count]) => (
                        <div key={level}>
                          <Text type="secondary">{level}: </Text>
                          {count}
                        </div>
                      ))}
                    </>
                  )}
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
