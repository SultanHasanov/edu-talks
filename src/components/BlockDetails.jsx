import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  Card,
  Typography,
  Tag,
  Alert,
  Spin,
  Divider,
  Button,
  Badge,
  message,
   Modal
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  FireOutlined,
   ExportOutlined
} from "@ant-design/icons";
import '../App.css'
const { Title, Text } = Typography;
const { Ribbon } = Badge;
const API_BASE_URL = "https://edutalks.ru/api";

const BlockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newsItem, setNewsItem] = useState(null);
  const access_token = localStorage.getItem("access_token");
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
   const [modal, contextModalHolder] = Modal.useModal(); // Хук для модалки
  const [externalLinkUrl, setExternalLinkUrl] = useState(''); // Состояние для хранения ссылки

  useEffect(() => {
    if (!id) return;

    const fetchNewsDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/news/${id}`);

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const { data } = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
        console.error("Ошибка при загрузке новости:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);


   useEffect(() => {
    const handleExternalLinks = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        // Проверяем, является ли ссылка внешней (не на наш сайт)
        const isExternal = link.href.startsWith('http') && 
                          !link.href.includes('edutalks.ru') &&
                          !link.href.includes('localhost');
        
        if (isExternal) {
          e.preventDefault();
          setExternalLinkUrl(link.href); // Сохраняем ссылку
          
          // Показываем красивую модалку вместо confirm
          modal.confirm({
            title: 'Внешняя ссылка',
            icon: <ExportOutlined style={{ color: '#faad14' }} />,
            content: (
              <div>
                <p>Вы покидаете сайт и переходите по внешней ссылке:</p>
                <Text code style={{ fontSize: '12px', wordBreak: 'break-all', margin: '8px 0', display: 'block' }}>
                  {link.href}
                </Text>
                <p>Продолжить?</p>
              </div>
            ),
            okText: 'Да, перейти',
            cancelText: 'Отмена',
            okButtonProps: {
              icon: <ExportOutlined />,
              style: { background: '#1890ff', borderColor: '#1890ff' }
            },
            cancelButtonProps: {
              type: 'default'
            },
            onOk() {
              window.open(link.href, '_blank', 'noopener,noreferrer');
            },
            onCancel() {
              setExternalLinkUrl('');
            },
            width: 500,
            centered: true
          });
        }
      }
    };

    document.addEventListener('click', handleExternalLinks);
    
    return () => {
      document.removeEventListener('click', handleExternalLinks);
    };
  }, [modal]); // Добавляем modal в зависимости

  const handleDownload = async (fileId, fileName) => {
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
      } else if (response.status === 401) {
        messageApi.open({
          type: "error",
          content: "Требуется авторизация. Пожалуйста, войдите в систему.",
        });
      } else {
        const errorData = await response.json();
        messageApi.open({
          type: "error",
          content: errorData.error || "Произошла ошибка при загрузке файла",
        });
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      messageApi.open({
        type: "error",
        content: "Ошибка соединения с сервером",
      });
    } finally {
      setLoadingFileId(null);
    }
  };

  // Функция для обработки HTML контента и замены файловых ссылок
  const processHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';

    // Регулярное выражение для поиска файловых ссылок
    const fileLinkRegex = /\[([^\]]+)]\(file:(\d+)\|([^)]+)\)/g;
    
    // Заменяем файловые ссылки на кнопки
    return htmlContent.replace(fileLinkRegex, (match, description, fileId, fileName) => {
      return `<button 
        class="file-download-btn" 
        data-file-id="${fileId}" 
        data-file-name="${fileName.trim()}"
        style="
          background: none;
          border: none;
          color: #1890ff;
          cursor: pointer;
          padding: 0;
          font-size: 16px;
          text-decoration: underline;
        "
      >📎 Скачать ${description}</button>`;
    });
  };

  // Обработчик кликов по кнопкам скачивания
  useEffect(() => {
    const handleFileButtonClick = (e) => {
      if (e.target.classList.contains('file-download-btn')) {
        const fileId = e.target.getAttribute('data-file-id');
        const fileName = e.target.getAttribute('data-file-name');
        if (fileId && fileName) {
          handleDownload(parseInt(fileId), fileName);
        }
      }
    };

    document.addEventListener('click', handleFileButtonClick);
    
    return () => {
      document.removeEventListener('click', handleFileButtonClick);
    };
  }, [handleDownload]);

  const block = useMemo(() => {
    if (!newsItem) return null;

    return {
      id: newsItem.id,
      title: newsItem.title,
      type: newsItem.sticker,
      content: processHtmlContent(newsItem.content),
      date: newsItem.created_at,
      image: newsItem.image_url,
      color: newsItem.color,
    };
  }, [newsItem]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message={`Ошибка при загрузке новости: ${error}`}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="primary"
        >
          Назад
        </Button>
      </div>
    );
  }

  if (!block) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Новость не найдена"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="primary"
        >
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      {contextHolder}
       {contextModalHolder} {/* Добавляем holder для модалок */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24 }}
      >
        Назад
      </Button>

      <Ribbon
        text={block.type}
        color={block.color}
        placement="start"
        style={{
          fontSize: 14,
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}
          cover={
            block.image && (
              <div
                style={{
                  height: 400,
                  position: "relative",
                  background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${block.image})`,
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
                    {block.title}
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
                    Опубликовано: {new Date(block.date).toLocaleDateString('ru-RU')}
                  </Text>
                </div>
              </div>
            )
          }
        >
          <div 
            style={{ 
              padding: "24px 0",
              fontSize: "16px",
              lineHeight: "1.8",
            }}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />

          <Divider />

          <div style={{ textAlign: "center" }}>
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
        </Card>
      </Ribbon>
    </div>
  );
};

export default BlockDetails;