// components/SectionContent.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Space,
  Tag,
  List,
  Button,
  Spin,
  Alert,
  message,
  Modal,
} from "antd";
import { DownloadOutlined, FileOutlined, EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import fileIcon from "../../public/fileIcon.png";
import { useNavigate } from "react-router-dom";
const { Title, Paragraph, Text } = Typography;

const SectionContent = ({ section }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const navigate = useNavigate();
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    if (section && section.id) {
      fetchFiles();
    }
  }, [section]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://edutalks.ru/api/files", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${errorText}`);
      }

      const result = await response.json();
      const filteredFiles = result.data.data.filter(
        (file) => file.section_id === section.id
      );
      setFiles(filteredFiles);
    } catch (err) {
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleBuySubscription = () => {
    setSubscriptionModalOpen(false);
    navigate('/subscription'); // Переход на страницу подписки
  };


  const handleDownload = async (fileId, fileName, allowFreeDownload) => {
    // Если файл доступен для бесплатного скачивания, скачиваем сразу
    if (allowFreeDownload) {
      try {
        setLoadingFileId(fileId);
        const response = await fetch(`https://edutalks.ru/api/files/${fileId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`${errorText}`);
        }

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
          message.success(`Файл "${fileName}" скачивается`);
        }
      } catch (err) {
        console.log(err.message);
        message.error(err.message);
      } finally {
        setLoadingFileId(null);
      }
    } else {
      // Если требуется подписка, показываем модальное окно
      setSubscriptionModalOpen(true);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3}>{section?.title}</Title>

          {section?.description && (
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              {section.description}
            </Paragraph>
          )}
          <Space>
            <Tag color="blue">Документов: {section?.docs_count || 0}</Tag>
          </Space>
        </Space>
      </Card>

      <Card
        title={`Прикрепленные файлы (${files.length})`}
        style={{ marginBottom: 20 }}
      >
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <Paragraph>Загрузка файлов...</Paragraph>
          </div>
        )}

        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        {!loading && files.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Paragraph type="secondary">
              <FileOutlined
                style={{
                  fontSize: "32px",
                  marginBottom: "16px",
                  display: "block",
                }}
              />
              Нет прикрепленных файлов для этой секции
            </Paragraph>
          </div>
        )}

        {!loading && files.length > 0 && (
        <List
          itemLayout="horizontal"
          dataSource={files}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button
                  key="download"
                  type={file.allow_free_download ? "primary" : "default"}
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file.id, file.filename, file.allow_free_download)}
                  size="small"
                  loading={loadingFileId === file.id}
                  style={file.allow_free_download ? { 
                    background: '#52c41a', 
                    borderColor: '#52c41a' 
                  } : {}}
                >
                  {file.allow_free_download ? 'Скачать' : 'Скачать'}
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <img 
                    src={fileIcon} 
                    alt="File icon" 
                    style={{ 
                      width: "44px", 
                      height: "44px" 
                    }}
                  />
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: "16px" }}>
                      {file.title}
                    </Text>
                    {file.allow_free_download && (
                      <Tag color="green">Бесплатно</Tag>
                    )}
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ fontSize: "14px" }}
                  >
                    {file.description && <Text>{file.description}</Text>}
                    <Text type="secondary">
                      Загружено: {formatDate(file.uploaded_at)}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* Модальное окно для подписки */}
      <Modal
        title="Требуется подписка"
        open={subscriptionModalOpen}
        onCancel={() => setSubscriptionModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setSubscriptionModalOpen(false)}>
            Отмена
          </Button>,
          <Button 
            key="buy" 
            type="primary" 
            icon={<ShoppingCartOutlined />}
            onClick={handleBuySubscription}
          >
            Купить подписку
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text>
            У вас нет активной подписки для скачивания этого документа.
          </Text>
          <Text strong>
            Приобретите базовую подписку всего за 1250 рублей в месяц!
          </Text>
          <Text type="secondary">
            Подписка дает доступ ко всем материалам платформы
          </Text>
        </Space>
      </Modal>
      </Card>
    </div>
  );
};

export default SectionContent;
