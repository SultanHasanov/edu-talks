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

const UserFiles = () => {
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
  const access_token = localStorage.getItem("access_token");
  const [loadingFileId, setLoadingFileId] = useState(null); // 👈 новое состояние
  const { role } = useAuth();

  const handleOpenDetails = async (file) => {
    setSelectedFileDetails(file);
    setDetailsModalOpen(true);

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
      const response = await fetch("http://85.143.175.100:8080/api/files", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      setFiles(data.data.data);
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

  const handleDownload = async (fileId, fileName) => {
    try {
      setLoadingFileId(fileId); // 👈 включаем только для нужной кнопки

      const response = await fetch(
        `http://85.143.175.100:8080/api/files/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
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
    } finally {
      setLoadingFileId(null); // 👈 выключаем после завершения
    }
  };

  const columns = [
    {
      title: "Имя файла",
      dataIndex: "description",
      key: "id",
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
    <div style={{ padding: 24, display: "flex", flex: "wrap" }}>
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

     
    </div>
  );
};

export default UserFiles;
