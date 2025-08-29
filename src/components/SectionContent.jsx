// components/SectionContent.jsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, List, Button, Spin, Alert, message, Modal } from 'antd';
import { DownloadOutlined, FileOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const SectionContent = ({ section }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

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
      const response = await fetch('https://edutalks.ru/api/admin/files', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      const filteredFiles = result.data.data.filter(file => file.section_id === section.id);
      setFiles(filteredFiles);
    } catch (err) {
      setError(err.message);
      message.error('Ошибка при загрузке файлов');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (fileId) => {
    try {
      setLoadingFileId(fileId);

      const response = await fetch(`https://edutalks.ru/api/files/${fileId}`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${access_token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
        setPreviewVisible(true);
      } else {
        message.error("Не удалось открыть превью");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      message.error("Ошибка соединения с сервером");
    } finally {
      setLoadingFileId(null);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      setLoadingFileId(fileId);
      const response = await fetch(`https://edutalks.ru/api/files/${fileId}`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${access_token}` },
      });

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
      } else {
        message.error("Ошибка при скачивании");
      }
    } catch (err) {
      console.error("Ошибка сети:", err);
      message.error("Ошибка соединения с сервером");
    } finally {
      setLoadingFileId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Title level={3}>{section?.title}</Title>
          {section?.description && (
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {section.description}
            </Paragraph>
          )}
          <Space>
            <Tag color="blue">Документов: {section?.docs_count || 0}</Tag>
          </Space>
        </Space>
      </Card>

      <Card title={`Прикрепленные файлы (${files.length})`} style={{ marginBottom: 20 }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
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
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Paragraph type="secondary">
              <FileOutlined style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }} />
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
                    key="preview"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(file.id)}
                    size="small"
                    loading={loadingFileId === file.id}
                  >
                    Превью
                  </Button>,
                  <Button
                    key="download"
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(file.id, file.filename)}
                    size="small"
                    loading={loadingFileId === file.id}
                  >
                    Скачать
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={<Text strong style={{ fontSize: '16px' }}>{file.filename}</Text>}
                  description={
                    <Space direction="vertical" size="small" style={{ fontSize: '14px' }}>
                      {file.description && <Text>{file.description}</Text>}
                      <Text type="secondary">Загружено: {formatDate(file.uploaded_at)}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Модалка превью */}
      <Modal
        open={previewVisible}
        onCancel={() => {
          setPreviewVisible(false);
          if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
        }}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {previewUrl && (
          <iframe
            src={previewUrl}
            title="Превью документа"
            style={{ width: '100%', height: '80vh', border: 'none' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default SectionContent;
