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
  notification,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;

const UserFiles = ({ queryParam }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [category, setCategory] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const access_token = localStorage.getItem("access_token");
  const [loadingFileId, setLoadingFileId] = useState(null);
  const { role } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  // Проверка подписки
  const checkSubscription = async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get(
        "/api/profile",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setHasSubscription(response.data.has_subscription);
    } catch (error) {
      console.error("Ошибка при проверке подписки:", error);
      message.error("Не удалось проверить статус подписки");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    fetchFiles();
  }, []);

  const handleOpenDetails = async (file) => {
    setSelectedFileDetails(file);
    setDetailsModalOpen(true);

    try {
      const response = await axios.get(
        `/api/files/${file.id}`,
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
        `/api/files?category=${queryParam}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Полный ответ сервера:", data);
      setFiles(data.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      message.error("Ошибка при загрузке списка файлов");
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    setSelectedFile(file);
    return false;
  };

  const handleDownload = async (fileId, fileName) => {
    
    try {
      setLoadingFileId(fileId);

      const response = await fetch(
        `/api/files/${fileId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.ok) {
        // response.ok = (status 200-299)
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json(); // Парсим JSON-ошибку
        console.error("Ошибка:", errorData.error); // Логируем в консоль
        message.error(errorData.error);
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

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  const columns = [
    {
      title: "Имя файла",
      dataIndex: "description",
      key: "id",
      render: (text) => (
        <Space>
          <FileOutlined />
          <Text ellipsis>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      align: "center",
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
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Скачать">
            <Button
              loading={loadingFileId === record.id}
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id, record.filename)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {contextHolder}

      {!profileLoading && !hasSubscription && role !== "admin" && (
        <Alert
          message="У вас нет подписки"
          description="Чтобы скачивать документы, необходимо оформить подписку"
          type="warning"
          showIcon
          action={
            <Button
              type="primary"
              size="midle"
              icon={<CrownOutlined />}
              onClick={handleSubscribe}
            >
              Оформить подписку
            </Button>
          }
          style={{ marginBottom: 24, width: "100%", alignItems: "center" }}
        />
      )}

      <Card
        title=""
        bordered={false}
        loading={loading && !files?.length}
        style={{ width: "100%" }}
      >
        {files?.length === 0 ? (
          <Alert
            message="Нет доступных файлов"
            description=""
            type="info"
            showIcon
          />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={files}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default UserFiles;
