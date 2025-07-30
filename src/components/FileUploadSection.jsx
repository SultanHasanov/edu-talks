import React, { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Card,
  Typography,
  Table,
  Progress,
  Input,
  Checkbox,
  Tag,
  Modal,
  message,
  Space,
  Divider,
  Descriptions,
  Image,
  Alert,
  Popconfirm,
  Tooltip,
  Select,
  Spin,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

const FileUploadSection = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState(null);
  const access_token = localStorage.getItem("access_token");
  const { role } = useAuth();
  const [previewLoading, setPreviewLoading] = useState(false);
  const handleOpenDetails = async (file) => {
    setSelectedFileDetails(file);
    setDetailsModalOpen(true);
    setPreviewLoading(true);
    try {
      const response = await axios.get(
        `http://85.143.175.100:8080/api/files/${file.id}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      let fileType = response.headers["content-type"];

      if (!fileType || fileType === "application/octet-stream") {
        const name = file.filename.toLowerCase();
        if (name.endsWith(".pdf")) fileType = "application/pdf";
        else if (name.endsWith(".jpg") || name.endsWith(".jpeg"))
          fileType = "image/jpeg";
        else if (name.endsWith(".png")) fileType = "image/png";
        else if (name.endsWith(".gif")) fileType = "image/gif";
        else if (name.endsWith(".webp")) fileType = "image/webp";
        else fileType = "application/octet-stream";
      }

      const blob = new Blob([response.data], { type: fileType });

      if (fileType.includes("pdf") || fileType.includes("image")) {
        const objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Ошибка при загрузке превью:", err);
      setPreviewUrl(null);
      message.error("Не удалось загрузить превью файла");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://85.143.175.100:8080/api/admin/files",
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
      message.error("Ошибка при загрузке списка файлов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const beforeUpload = (file) => {
    setSelectedFile(file);
    return false; // Отменяем стандартное поведение загрузки
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning("Пожалуйста, выберите файл для загрузки");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    formData.append("is_public", isPublic);
    formData.append("category", category);

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await fetch(
        "http://85.143.175.100:8080/api/admin/files/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      message.success("Файл успешно загружен");
      fetchFiles();
      setSelectedFile(null);
      setDescription("");
      setIsPublic(false);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      message.error("Ошибка при загрузке файла");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `http://85.143.175.100:8080/api/files/${fileId}`,
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorText = await response.text();
        message.error(errorText || "Ошибка загрузки файла");
      }
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      message.error("Произошла ошибка при загрузке");
    }
  };

  const handleDeleteFile = async (file) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://85.143.175.100:8080/api/admin/files/${file.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      message.success("Файл успешно удален");
      fetchFiles();
    } catch (err) {
      console.error("Ошибка удаления:", err);
      message.error("Ошибка при удалении файла");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Имя файла",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Space>
          <FileOutlined />
          <Text ellipsis style={{ maxWidth: 200 }}>
            {text}
          </Text>
        </Space>
      ),
    },
    {
      title: "Статус",
      dataIndex: "is_public",
      key: "status",
      render: (isPublic) => (
        <Tag color={isPublic ? "success" : "default"}>
          {isPublic ? "Публичный" : "Приватный"}
        </Tag>
      ),
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      render: (category) => {
        const categoryNames = {
          order: "Приказ",
          template: "Шаблон",
          scenario: "Сценарий",
        };
        return categoryNames[category] || category;
      },
    },
    {
      title: "Действия",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Подробнее">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleOpenDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Скачать">
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id, record.filename)}
            />
          </Tooltip>
          <Popconfirm
            title="Удалить файл"
            description={`Вы уверены, что хотите удалить файл "${record.filename}"?`}
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => handleDeleteFile(record)}
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Удалить">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, display: "flex", flex: "wrap" }}>
      {/* Загрузка файлов */}
      {role === "admin" && (
        <Card
          title="Загрузить новый файл"
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <Upload.Dragger
            beforeUpload={beforeUpload}
            showUploadList={false}
            accept="*"
            maxCount={1}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите файл в эту область
            </p>
          </Upload.Dragger>

          {selectedFile && (
            <Alert
              message={`Выбран файл: ${selectedFile.name}`}
              type="info"
              showIcon
              closable
              onClose={() => setSelectedFile(null)}
              style={{ marginBottom: 16 }}
            />
          )}

          <TextArea
            placeholder="Описание файла"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ marginBottom: 16 }}
          />

          <Select
            placeholder="Выберите категорию"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(value) => setCategory(value)}
            options={[
              { value: "order", label: "Приказ" },
              { value: "template", label: "Шаблон" },
              { value: "scenario", label: "Сценарий" },
            ]}
          />

          <Checkbox
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ marginBottom: 16 }}
          >
            Сделать файл публичным
          </Checkbox>

          {uploadProgress > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Progress percent={uploadProgress} status="active" />
              <Text type="secondary">{uploadProgress}% загружено</Text>
            </div>
          )}

          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            loading={loading}
            icon={<UploadOutlined />}
          >
            Загрузить
          </Button>
        </Card>
      )}

      {/* Список файлов */}
      <Card
        title="Доступные файлы"
        bordered={false}
        loading={loading && !files?.length}
      >
        {files?.length === 0 ? (
          <Alert
            message="Нет доступных файлов"
            description=""
            type="info"
            showIcon
          />
        ) : (
          <Table
            columns={columns}
            dataSource={files}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
          />
        )}
      </Card>

      {/* Модальное окно с деталями файла */}
      <Modal
        title="Детали файла"
        open={detailsModalOpen}
        onCancel={handleCloseDetails}
        footer={[
          <Button key="close" onClick={handleCloseDetails}>
            Закрыть
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              handleDownload(
                selectedFileDetails.id,
                selectedFileDetails.filename
              );
              handleCloseDetails();
            }}
          >
            Скачать
          </Button>,
          <Popconfirm
            key="delete"
            title="Удалить файл"
            description={`Вы уверены, что хотите удалить файл "${selectedFileDetails?.filename}"?`}
            onConfirm={() => {
              handleDeleteFile(selectedFileDetails);
              handleCloseDetails();
            }}
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Удалить
            </Button>
          </Popconfirm>,
        ]}
        width={800}
      >
        {selectedFileDetails && (
          <>
            {previewUrl ? (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Превью:</Title>
                {previewUrl.endsWith(".pdf") ||
                selectedFileDetails.filename.toLowerCase().includes(".pdf") ? (
                  <iframe
                    src={previewUrl}
                    title="Превью PDF"
                    width="100%"
                    height="400px"
                    style={{ border: "1px solid #d9d9d9", borderRadius: 4 }}
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Превью изображения"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 400,
                      borderRadius: 4,
                      border: "1px solid #d9d9d9",
                    }}
                  />
                )}
              </div>
            ) : previewLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <Spin size="large" tip="Загрузка превью..." />
              </div>
            ) : (
              <Alert
                message="Превью недоступно"
                description="Для этого типа файла превью не поддерживается"
                type="info"
                showIcon
              />
            )}

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Название">
                <Space>
                  <FileOutlined />
                  {selectedFileDetails.filename}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Описание">
                {selectedFileDetails.description || "Описание отсутствует"}
              </Descriptions.Item>
              <Descriptions.Item label="Категория">
                {selectedFileDetails.category || "Не указана"}
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                <Tag
                  color={selectedFileDetails.is_public ? "success" : "default"}
                >
                  {selectedFileDetails.is_public ? "Публичный" : "Приватный"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Дата загрузки">
                {formatDate(selectedFileDetails.uploaded_at)}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FileUploadSection;
