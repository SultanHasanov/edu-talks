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
  Grid,
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
const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get("https://edutalks.ru/api/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setHasSubscription(response.data.data.has_subscription);
    } catch (error) {
      console.error("Ошибка при проверке подписки:", error);
      message.error("Не удалось проверить статус подписки");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (access_token) {
      checkSubscription();
      fetchFiles();
    }
  }, []);

  const handleOpenDetails = async (file) => {
    setSelectedFileDetails(file);
    setDetailsModalOpen(true);

    try {
      const response = await axios.get(
        `https://edutalks.ru/api/files/${file.id}`,
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
        `https://edutalks.ru/api/files?category=${queryParam}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = await response.json();
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

      const response = await fetch(`https://edutalks.ru/api/files/${fileId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      });

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
        console.error("Ошибка:", errorData.error);
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
          <Text ellipsis style={{ maxWidth: 120 }}>
            {text}
          </Text>
        </Space>
      ),
    },
    ...(screens.xs
      ? []
      : [
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
        ]),
    {
      title: "Действия",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Скачать">
          <Button
            size={screens.xs ? "small" : "middle"}
            loading={loadingFileId === record.id}
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id, record.filename)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? "8px" : "24px" }}>
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
              size="middle"
              icon={<CrownOutlined />}
              onClick={handleSubscribe}
            >
              Оформить подписку
            </Button>
          }
          style={{
            marginBottom: 24,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        />
      )}

      <Card
        bordered={false}
        loading={loading && !files?.length}
        bodyStyle={{ padding: screens.xs ? 12 : 24 }}
      >
        {files?.length === 0 ? (
          <Alert message="Нет доступных файлов" type="info" showIcon />
        ) : (
          <Table
            columns={columns}
            dataSource={files}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            size={screens.xs ? "small" : "middle"}
          />
        )}
      </Card>
    </div>
  );
};

export default UserFiles;
