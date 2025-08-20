import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Tag,
  Space,
  Divider,
  message,
  Typography,
  Modal,
  Tooltip,
  Alert,
  Spin,
  List,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../App.css";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ArticleEditor = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const inputRef = useRef(null);
  const access_token = localStorage.getItem("access_token");

  // Модули для редактора
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "align",
  ];

  // Загрузка статей при монтировании компонента
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const response = await fetch("https://edutalks.ru/api/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setArticles(result?.data || []);
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
      message.error("Произошла ошибка при загрузке статей");
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleTagClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue.trim()) {
      const newTag = inputValue.trim();
      if (tags?.length >= 5) {
        message.warning("Можно добавить не более 5 тегов");
        return;
      }
      if (tags.indexOf(newTag) === -1) {
        setTags([...tags, newTag]);
      } else {
        message.info("Этот тег уже добавлен");
      }
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleInputBlur = () => {
    handleInputConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputConfirm();
    } else if (e.key === "Escape") {
      setInputVisible(false);
      setInputValue("");
    } else if (e.key === "," || e.key === ";") {
      e.preventDefault();
      handleInputConfirm();
    }
  };

  const saveArticle = async (articleData) => {
    setLoading(true);
    try {
      const url = editingArticle
        ? `https://edutalks.ru/api/admin/articles/${editingArticle.id}`
        : "https://edutalks.ru/api/admin/articles";

      const method = editingArticle ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      message.success(
        editingArticle
          ? "Статья успешно обновлена!"
          : "Статья успешно сохранена!"
      );

      // Очистка формы после успешного сохранения
      form.resetFields();
      setContent("");
      setTags([]);
      setEditingArticle(null);

      // Обновляем список статей
      await fetchArticles();

      return result;
    } catch (error) {
      console.error("Ошибка при сохранении статьи:", error);
      message.error("Произошла ошибка при сохранении статьи");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/articles/${articleId}`,
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

      message.success("Статья успешно удалена!");
      await fetchArticles();
    } catch (error) {
      console.error("Ошибка при удалении статьи:", error);
      message.error("Произошла ошибка при удалении статьи");
    }
  };

  const onFinish = async (values) => {
    if (tags?.length === 0) {
      message.warning("Добавьте хотя бы один тег");
      return;
    }

    if (!content.trim()) {
      message.warning("Напишите содержание статьи");
      return;
    }

    const articleData = {
      title: values.title,
      summary: values.description,
      bodyHtml: content,
      tags: tags,
      publish: true,
    };

    try {
      await saveArticle(articleData);
    } catch (error) {
      // Ошибка уже обработана в saveArticle
    }
  };

  const editArticle = (article) => {
    setEditingArticle(article);
    form.setFieldsValue({
      title: article.title,
      description: article.summary,
    });
    setContent(article.bodyHtml);
    setTags(article.tags || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingArticle(null);
    form.resetFields();
    setContent("");
    setTags([]);
  };

  const renderTagInput = () => {
    if (inputVisible) {
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
            background: "#fff",
            borderRadius: "12px",
            padding: "4px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{
              width: 140,
              border: "2px solid #1890ff",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 6px rgba(24, 144, 255, 0.2)",
            }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Введите тег..."
            suffix={
              <Tooltip title="Enter - добавить, Esc - отмена">
                <InfoCircleOutlined
                  style={{
                    color: "#1890ff",
                    fontSize: "14px",
                    cursor: "help",
                  }}
                />
              </Tooltip>
            }
          />
          <Tag
            onClick={handleInputConfirm}
            style={{
              background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "8px",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: "14px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(82, 196, 26, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(82, 196, 26, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "none";
              e.target.style.boxShadow = "0 2px 8px rgba(82, 196, 26, 0.3)";
            }}
            icon={<PlusOutlined style={{ fontSize: "12px" }} />}
          >
            Добавить
          </Tag>
        </div>
      );
    }

    return (
      <Tag
        onClick={showInput}
        style={{
          background: "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
          border: "1.5px dashed #1890ff",
          color: "#1890ff",
          cursor: "pointer",
          borderRadius: "4px",
          padding: "3px 16px",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(24, 144, 255, 0.1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #e6f7ff 0%, #d0e8ff 100%)";
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)";
          e.target.style.transform = "none";
          e.target.style.boxShadow = "0 2px 8px rgba(24, 144, 255, 0.1)";
        }}
        icon={<PlusOutlined style={{ fontSize: "12px" }} />}
      >
        Добавить тег
      </Tag>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Title level={2}>
        {editingArticle ? "Редактирование статьи" : "Написание статьи"}
      </Title>

      {editingArticle && (
        <Alert
          message="Редактирование статьи"
          description={`Вы редактируете статью "${editingArticle.title}". Изменения будут сохранены при нажатии кнопки "Обновить".`}
          type="info"
          showIcon
          action={
            <Button size="small" onClick={cancelEdit}>
              Отменить
            </Button>
          }
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          category: "development",
          language: "ru",
        }}
      >
        <Card>
          {loading && (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Spin size="large" />
              <div style={{ marginTop: 10 }}>Сохранение статьи...</div>
            </div>
          )}

          {/* Заголовок */}
          <Form.Item
            name="title"
            label="Заголовок статьи"
            rules={[{ required: true, message: "Введите заголовок статьи" }]}
          >
            <Input
              placeholder="Интересный заголовок, который привлечет внимание"
              size="large"
            />
          </Form.Item>

          {/* Краткое описание */}
          <Form.Item
            name="description"
            label="Краткое описание"
            rules={[{ required: true, message: "Введите краткое описание" }]}
          >
            <TextArea
              rows={3}
              placeholder="Краткое описание статьи, которое будет отображаться в preview"
            />
          </Form.Item>

          {/* Основной контент */}
          <Form.Item
            label="Содержание статьи"
            rules={[{ required: true, message: "Напишите содержание статьи" }]}
          >
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              style={{ height: "400px", marginBottom: "50px" }}
              placeholder="Начните писать вашу статью здесь..."
            />
          </Form.Item>

          {/* Теги */}
          <Form.Item
            label={
              <Space>
                <span>Теги</span>
                <Tooltip title="Теги помогают пользователям найти вашу статью">
                  <InfoCircleOutlined
                    style={{ color: "#999", fontSize: "14px" }}
                  />
                </Tooltip>
              </Space>
            }
          >
            <div
              style={{
                minHeight: "40px",
                padding: "8px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            >
              {tags?.length === 0 && !inputVisible && (
                <Text
                  type="secondary"
                  style={{ fontSize: "14px", marginLeft: 8 }}
                >
                  Пока нет тегов. Нажмите "Добавить тег" чтобы начать.
                </Text>
              )}

              <Space wrap size={[8, 8]} style={{ marginBottom: 8 }}>
                {tags?.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    closeIcon={<CloseOutlined style={{ fontSize: "12px" }} />}
                    onClose={() => handleTagClose(tag)}
                    style={{
                      background: "#e6f7ff",
                      border: "1px solid #91d5ff",
                      color: "#1890ff",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "13px",
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
                {renderTagInput()}
              </Space>
            </div>

            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {tags?.length}/5 тегов добавлено • Используйте запятую или Enter
                для быстрого добавления
              </Text>
            </div>
          </Form.Item>

          <Divider />

          {/* Кнопки действий */}
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              disabled={loading}
            >
              {editingArticle ? "Обновить" : "Опубликовать"}
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => setPreviewVisible(true)}
              disabled={loading}
            >
              Предпросмотр
            </Button>
            {editingArticle && (
              <Button
                type="default"
                size="large"
                onClick={cancelEdit}
                disabled={loading}
              >
                Отменить
              </Button>
            )}
          </Space>
        </Card>
      </Form>

      {/* Список статей */}
      <Divider />
      <Card title="Все статьи" style={{ marginTop: 40 }}>
        {articlesLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 10 }}>Загрузка статей...</div>
          </div>
        ) : articles?.length === 0 ? (
          <Empty description="Статьи не найдены" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={articles}
            renderItem={(article) => (
              <List.Item
                key={article?.id}
                actions={[
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setPreviewVisible(true);
                      form.setFieldsValue({
                        title: article?.title,
                        description: article?.summary,
                      });
                      setContent(article?.bodyHtml);
                      setTags(article?.tags || []);
                    }}
                  >
                    Просмотр
                  </Button>,
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => editArticle(article)}
                  >
                    Редактировать
                  </Button>,
                  <Popconfirm
                    title="Удалить статью"
                    description="Вы уверены, что хотите удалить эту статью?"
                    onConfirm={() => deleteArticle(article.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Удалить
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={article?.title}
                  description={
                    <Space direction="vertical" size={0}>
                     <Text type="secondary" ellipsis>
  {article?.summary && article.summary?.length > 70 
    ? `${article?.summary.substring(0, 70)}...` 
    : article?.summary || "Описание отсутствует"
  }
</Text>
                      <Space size={[0, 8]} wrap>
                        {article.tags?.map((tag, index) => (
                          <Tag key={index} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Модальное окно предпросмотра */}
      <Modal
        title="Предпросмотр статьи"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: "20px" }}>
          <Title>{form.getFieldValue("title")}</Title>
          <Text type="secondary">{form.getFieldValue("description")}</Text>
          <Divider />
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ minHeight: "200px" }}
          />
          <Divider />
          <Space>
            {tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleEditor;
