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
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  FireOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

const { Title, Text, Paragraph } = Typography;
const { Ribbon } = Badge;
const API_BASE_URL = "http://85.143.175.100:8080";

const BlockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newsItem, setNewsItem] = useState(null);
  const access_token = localStorage.getItem("access_token");
  const [loadingFileId, setLoadingFileId] = useState(null);
   const [messageApi, contextHolder] = message.useMessage();
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
        `http://85.143.175.100:8080/api/files/${fileId}`,
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


  const block = useMemo(() => {
    if (!newsItem) return null;

    return {
      id: newsItem.id,
      title: newsItem.title,
      type: newsItem.sticker,
      content: newsItem.content,
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
                  Опубликовано: {new Date(block.date).toLocaleDateString()}
                </Text>
              </div>
            </div>
          }
        >
          <div style={{ padding: "24px 0" }}>
            {block.content.split("\n").map((paragraph, i) => (
              <Paragraph
                key={i}
                style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}
              >
                {parseContentWithFiles(paragraph, handleDownload)}
              </Paragraph>
            ))}
          </div>

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
