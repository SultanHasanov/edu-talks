import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Typography,
  Form,
  Spin,
  List,
  Avatar,
  Popconfirm,
  Modal,
  Select,
  ColorPicker,
  Row,
  Col,
  Space,
  Tag,
  notification,
  Layout,
  Badge,
  Tooltip,
  Empty,
  Pagination,
  message,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PictureOutlined,
  TagOutlined,
  CalendarOutlined,
  FullscreenOutlined,
  CloseOutlined,
  PaperClipOutlined,
  CopyOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Content } = Layout;

const AddNewsForm = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    color: "#4A90E2",
    sticker: "Новость",
  });

  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image_url: "",
    color: "#4A90E2",
    sticker: "Новость",
  });

  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [files, setFiles] = useState([]);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const access_token = localStorage.getItem("access_token");

  const stickerOptions = ["Новость", "Рекомендации", "Важно", "Обновление"];

  const fetchFiles = async () => {
    try {
      const response = await fetch(
        "https://edutalks.ru/api/admin/files",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = await response.json();
      setFiles(data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      notification.error({
        message: "Ошибка",
        description: "Не удалось загрузить список файлов",
      });
    }
  };

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      const response = await fetch(
        `https://edutalks.ru/api/news?page=${page}&page_size=${pageSize}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNews(data?.data?.data);
      setTotal(data.data.total);
    } catch (err) {
      console.error("Error fetching news:", err);
      notification.error({
        message: "Ошибка загрузки",
        description: "Не удалось загрузить список новостей",
      });
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchFiles();
  }, [page, pageSize]);
  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://edutalks.ru/api/admin/news",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      messageApi.open({
        type: "success",
        content: "Новость успешно добавлена!",
      });

      form.resetFields();
      setFormData({
        title: "",
        content: "",
        image_url: "",
        color: "#4A90E2",
        sticker: "Новость",
      });

      await fetchNews();
    } catch (err) {
      console.error("Error adding news:", err);
      notification.error({
        message: "Ошибка",
        description: "Произошла ошибка при добавлении новости",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values) => {
    if (!editingNewsId) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/news/${editingNewsId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      notification.success({
        message: "Успех!",
        description: "Новость успешно обновлена!",
      });

      setEditModalVisible(false);
      setEditingNewsId(null);
      await fetchNews();
    } catch (err) {
      console.error("Error updating news:", err);
      notification.error({
        message: "Ошибка",
        description: "Произошла ошибка при обновлении новости",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/news/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      notification.success({
        message: "Успех!",
        description: "Новость успешно удалена!",
      });

      await fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
      notification.error({
        message: "Ошибка",
        description: "Произошла ошибка при удалении новости",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (newsItem) => {
    setEditData(newsItem);
    setEditingNewsId(newsItem.id);
    editForm.setFieldsValue(newsItem);
    setEditModalVisible(true);
  };

  const openFullscreenModal = (newsItem) => {
    setSelectedNews(newsItem);
    setFullscreenModalVisible(true);
  };

  const handleFormChange = useCallback(
    (changedValues, allValues) => {
      // Если изменилось только поле content, не обновляем formData для превью
      if (
        Object.keys(changedValues).length === 1 &&
        changedValues.hasOwnProperty("content")
      ) {
        return;
      }

      // Для всех остальных полей обновляем превью
      setFormData({ ...formData, ...allValues });
    },
    [formData]
  );

  const getStickerColor = (sticker) => {
    const colors = {
      Новость: "blue",
      Рекомендации: "green",
      Важно: "red",
      Обновление: "orange",
    };
    return colors[sticker] || "blue";
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString("ru-RU");
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch {
      return dateString;
    }
  };

  const NewsCardPreview = React.memo(
    ({
      title,
      content,
      image_url,
      color,
      sticker,
      date,
      clickable = false,
      newsItem = null,
    }) => (
      <Card
        hoverable={clickable}
        onClick={clickable ? () => openFullscreenModal(newsItem) : undefined}
        style={{
          minHeight: 280,
          border: "1px solid #f0f0f0",
          borderRadius: 12,
          position: "relative",
          cursor: clickable ? "pointer" : "default",
          transition: "all 0.3s ease",
          // overflow: "hidden",
        }}
        bodyStyle={{
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Badge.Ribbon
          text={sticker}
          color={color}
          //  placement="start"
          style={{
            fontSize: 14,
            fontWeight: 600,
            zIndex: 1000,
          }}
        />

        {/* Фоновая часть - 70% высоты */}
        <div
          style={{
            height: "190px",
            background: image_url ? `url(${image_url})` : "#f5f5f5",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            padding: 16,
          }}
        >
          {clickable && (
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                padding: "4px 8px",
                opacity: 0.8,
                transition: "opacity 0.3s ease",
              }}
            >
              <FullscreenOutlined style={{ color: "#fff", fontSize: 16 }} />
            </div>
          )}
        </div>

        {/* Текстовая часть - 30% высоты */}
        <div
          style={{
            height: "30%",
            backgroundColor: "#fff",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title
              level={4}
              style={{
                marginBottom: 8,
                color: "#333",
                fontWeight: 600,
                lineHeight: 1.3,
                fontSize: 16,
              }}
            >
              {title || "Заголовок новости"}
            </Title>
            {clickable && content && (
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                style={{
                  marginBottom: 8,
                  color: "#666",
                  fontSize: 14,
                }}
              >
                {content}
              </Paragraph>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: "auto",
            }}
          >
            <CalendarOutlined style={{ color: "#999", fontSize: 14 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {formatDate(date)}
            </Text>
          </div>
        </div>
      </Card>
    )
  );

  const getNewsWordForm = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return "новостей";
    if (mod10 === 1) return "новость";
    if (mod10 >= 2 && mod10 <= 4) return "новости";
    return "новостей";
  };

  const parseContentWithFiles = (text, handleDownload) => {
  const parts = [];
  let lastIndex = 0;

  const regex = /\[([^\]]+)]\(file:(\d+)\|((?:[^()\\]|\\.|[()])+)\)/g;
  //        └── описание ┘ └── id ┘ └─────── filename ───────┘

  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, description, fileId, fileNameRaw] = match;
    const matchStart = match.index;

    // Добавить всё перед найденной ссылкой
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    const fileName = fileNameRaw.trim();

    parts.push(
      <Button
        key={`${fileId}-${matchStart}`}
        type="link"
        onClick={() => handleDownload(Number(fileId), fileName)}
        style={{ padding: 0, fontSize: 16 }}
      >
        📎 Скачать {description}
      </Button>
    );

    lastIndex = matchStart + fullMatch.length;
  }

  // Добавить остаток текста
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};


const handleDownload = async (fileId, fileName) => {
    console.log(fileId, fileName);
    try {
      setLoadingFileId(fileId);

      const response = await fetch(
        `https://edutalks.ru/api/files/${fileId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
         messageApi.open({
          type: "error",
          content: errorData.error,
        });
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      alert("Ошибка соединения с сервером");
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {contextHolder}
      <Content
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Форма добавления новости */}
        <Card
          style={{ marginBottom: 24, borderRadius: 12 }}
          title={
            <Space>
              <TagOutlined style={{ color: "#1890ff" }} />
              <Title level={3} style={{ margin: 0 }}>
                Добавить новость
              </Title>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
            initialValues={formData}
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Заголовок"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите заголовок!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Введите заголовок новости"
                    size="large"
                    disabled={loading}
                  />
                </Form.Item>
                <Form.Item
                  label="Содержание"
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите содержание!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Введите содержание новости"
                    rows={4}
                    disabled={loading}
                  />
                </Form.Item>
                <Space.Compact style={{ width: "100%" }}>
                  <Button
                    block={false}
                    type="primary"
                    onClick={() => {
                      fetchFiles();
                      setFileModalVisible(true);
                    }}
                    icon={<PaperClipOutlined />}
                  />
                </Space.Compact>

                <Form.Item label="URL изображения" name="image_url">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    prefix={<PictureOutlined />}
                    disabled={loading}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Тип стикера" name="sticker">
                      <Select size="large" disabled={loading}>
                        {stickerOptions.map((option) => (
                          <Option key={option} value={option}>
                            <Tag color={getStickerColor(option)}>{option}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Цвет стикера" name="color">
                      <ColorPicker
                        disabled={loading}
                        showText
                        style={{ width: "100%" }}
                        value={formData.color}
                        onChange={(color) => {
                          const hex = color.toHexString(); // <-- получаем строку
                          setFormData((prev) => ({ ...prev, color: hex }));
                          form.setFieldsValue({ color: hex }); // <-- обновляем в форме
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    style={{ width: "100%", height: 48 }}
                  >
                    Добавить новость
                  </Button>
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <div style={{ position: "sticky", top: 24 }}>
                  <Title level={5} style={{ marginBottom: 16 }}>
                    Превью карточки:
                  </Title>
                  <NewsCardPreview
                    title={formData.title}
                    content={formData.content}
                    image_url={formData.image_url}
                    color={formData.color}
                    sticker={formData.sticker}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Список новостей как карточки */}
        <Card
          style={{ borderRadius: 12 }}
          title={
            <Space>
              <EyeOutlined style={{ color: "#1890ff" }} />
              <Title level={3} style={{ margin: 0 }}>
                Список новостей
              </Title>
              <Badge count={news?.length} showZero color="#52c41a" />
            </Space>
          }
        >
          {newsLoading ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">Загрузка новостей...</Text>
              </div>
            </div>
          ) : news?.length === 0 ? (
            <Empty description="Новости не найдены" style={{ padding: 48 }} />
          ) : (
            <Row gutter={[24, 24]}>
              {news?.map((item) => (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <div style={{ position: "relative" }}>
                    <NewsCardPreview
                      title={item.title}
                      content={item.content}
                      image_url={item.image_url}
                      color={item.color}
                      sticker={item.sticker}
                      date={item.date || item.created_at}
                    />

                    {/* Панель действий */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        display: "flex",
                        gap: 8,
                        backgroundColor: "rgba(255,255,255,0.9)",
                        borderRadius: 8,
                        padding: 4,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Tooltip title="Просмотреть">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openFullscreenModal(item);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(item);
                          }}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Удалить новость?"
                        description="Вы уверены, что хотите удалить эту новость?"
                        onConfirm={(e) => {
                          e && e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        okText="Да"
                        cancelText="Нет"
                        okType="danger"
                      >
                        <Tooltip title="Удалить">
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space align="center">
              <span>На странице</span>
              <Select
                value={pageSize}
                onChange={(value) => {
                  setPage(1);
                  setPageSize(value);
                }}
                style={{ width: 80 }}
              >
                {[3, 6, 9, 12, 15].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
              <span>{getNewsWordForm(pageSize)}</span>
            </Space>

            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(newPage) => setPage(newPage)}
              showSizeChanger={false}
            />
          </div>
        </Card>

        {/* Модальное окно редактирования */}
        <Modal
          title="Редактировать новость"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingNewsId(null);
          }}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEdit}
            initialValues={editData}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Заголовок"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите заголовок!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Введите заголовок новости"
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item
                  label="Содержание"
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите содержание!",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Введите содержание новости"
                    rows={4}
                    disabled={loading}
                  />
                </Form.Item>

                <Form.Item label="URL изображения" name="image_url">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    prefix={<PictureOutlined />}
                    disabled={loading}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Тип стикера" name="sticker">
                      <Select disabled={loading}>
                        {stickerOptions.map((option) => (
                          <Option key={option} value={option}>
                            <Tag color={getStickerColor(option)}>{option}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Цвет стикера" name="color">
                      <ColorPicker
                        disabled={loading}
                        showText
                        style={{ width: "100%" }}
                        value={editData.color}
                        onChange={(color) => {
                          const hex = color.toHexString();
                          setEditData((prev) => ({ ...prev, color: hex }));
                          editForm.setFieldsValue({ color: hex });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Space>
                <Button
                  onClick={() => {
                    setEditModalVisible(false);
                    setEditingNewsId(null);
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Сохранить
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Полноэкранное модальное окно для просмотра новости */}
        <Modal
          open={fullscreenModalVisible}
          onCancel={() => setFullscreenModalVisible(false)}
          footer={null}
          width="80vw"
          style={{ top: 0, paddingBottom: 0, maxWidth: "none" }}
          bodyStyle={{
            // height: "100vh",
            padding: 0,
            
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          closeIcon={
            <CloseOutlined
              style={{
                color: "#fff",
                fontSize: 24,
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: 8,
                borderRadius: "50%",
              }}
            />
          }
          destroyOnClose
        >
          {selectedNews && (
            <div
              style={{
                maxWidth: 1200,
                width: "90%",
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <Badge.Ribbon
                text={selectedNews.sticker}
                color={selectedNews.color}
                placement="start"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                <div
                  style={{
                    height: 400,
                    position: "relative",
                    background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${selectedNews.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 24,
                  }}
                >
                  <div>
                    <Title
                      level={1}
                      style={{
                        color: "white",
                        marginBottom: 8,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                      }}
                    >
                      {selectedNews.title}
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      Опубликовано:{" "}
                      {formatDate(selectedNews.date || selectedNews.created_at)}
                    </Text>
                  </div>
                </div>
              </Badge.Ribbon>

              <div style={{ padding: "24px" }}>
                {selectedNews.content.split("\n").map((paragraph, i) => (
                  <Paragraph
                    key={i}
                    style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}
                  >
                    {parseContentWithFiles(paragraph, handleDownload)}
                  </Paragraph>
                ))}
              </div>

              <Divider />

              <div style={{ textAlign: "center", paddingBottom: 24 }}>
                <Tag
                  icon={<FireOutlined />}
                  color="red"
                  style={{
                    fontSize: 14,
                    padding: "8px 16px",
                  }}
                >
                  Актуальная новость
                </Tag>
              </div>
            </div>
          )}
        </Modal>
        <Modal
          title="Выберите файл"
          open={fileModalVisible}
          onCancel={() => setFileModalVisible(false)}
          onOk={() => {
            if (selectedFile) {
              const currentContent = form.getFieldValue("content") || "";
              const displayText =
                selectedFile.description || selectedFile.filename;
              const newContent = `${currentContent}\n[${displayText}](file:${selectedFile.id}|${selectedFile.filename})`;

              form.setFieldsValue({
                content: newContent,
              });

              handleFormChange(
                {
                  content: newContent,
                },
                form.getFieldsValue()
              );
            }
            setFileModalVisible(false);
          }}
        >
          <List
            dataSource={files}
            rowKey="id"
            renderItem={(file) => {
              const displayText = file.description || file.filename;
              const markdownLink = `[${displayText}](file:${file.id}|${file.filename})`;

              return (
                <List.Item
                  onClick={() => setSelectedFile(file)}
                  style={{
                    backgroundColor:
                      selectedFile?.id === file.id ? "#f0f0f0" : "transparent",
                    cursor: "pointer",
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget.querySelector(".copy-btn");
                    if (btn) btn.style.visibility = "visible";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget.querySelector(".copy-btn");
                    if (btn) btn.style.visibility = "hidden";
                  }}
                >
                  <List.Item.Meta
                    title={displayText}
                    description={`Категория: ${file.category || "не указана"}`}
                  />
                  <Tooltip title="Скопировать ссылку">
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      className="copy-btn"
                      style={{ color: "green" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(markdownLink);
                        messageApi.open({
                          type: "success",
                          content: "Ссылка скопирована в буфер обмена",
                        });
                      }}
                    />
                  </Tooltip>
                </List.Item>
              );
            }}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default AddNewsForm;
