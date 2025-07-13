import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  Modal,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
} from "@mui/icons-material";
import axios from "axios";

const FileUploadSection = ({ access_token }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenDetails = (file) => {
    setSelectedFileDetails(file);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const detailsModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "95%" : 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
    outline: "none",
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
      const response = await axios.get("http://85.143.175.100:8080/api/files", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setFiles(response?.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", description);
    formData.append("is_public", isPublic);

    try {
      setLoading(true);
      setUploadProgress(0);

      await axios.post(
        "http://85.143.175.100:8080/api/admin/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      showSnackbar("Файл успешно загружен", "success");
      fetchFiles();
      setSelectedFile(null);
      setDescription("");
      setIsPublic(false);
      document.getElementById("file-input").value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar("Ошибка при загрузке файла", "error");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://85.143.175.100:8080/api/files/${fileId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          validateStatus: () => true,
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorText = await new Response(response.data).text();
        showSnackbar(errorText || "Ошибка загрузки файла", "error");
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      showSnackbar("Произошла ошибка при загрузке", "error");
    }
  };

  return (
    <>
      {/* Загрузка файлов */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Загрузить новый файл
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Выбрать файл
            <input
              id="file-input"
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Typography>
            {selectedFile
              ? `Выбран файл: ${selectedFile.name}`
              : "Файл не выбран"}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Описание файла"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={2}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              color="primary"
            />
          }
          label="Сделать файл публичным"
          sx={{ mt: 1, mb: 2 }}
        />

        {uploadProgress > 0 && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" sx={{ mt: 1 }}>
              {uploadProgress}% загружено
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          Загрузить
        </Button>
      </Paper>

      {/* Список файлов */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, width: "100%", maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Доступные файлы
        </Typography>
        {loading && !files?.length ? (
          <LinearProgress />
        ) : files?.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Нет доступных файлов
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Имя файла</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FileIcon sx={{ mr: 1 }} />
                        {file.filename}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {file.is_public ? (
                        <Chip label="Публичный" color="success" size="small" />
                      ) : (
                        <Chip label="Приватный" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenDetails(file)}
                      >
                        Подробнее
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(file.id, file.filename)}
                      >
                        Скачать
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Модальное окно с деталями файла */}
      <Modal
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        aria-labelledby="file-details-modal"
      >
        <Box sx={detailsModalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography id="file-details-modal" variant="h6" component="h2">
              Детали файла
            </Typography>
            <IconButton onClick={handleCloseDetails}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {selectedFileDetails && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Название:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FileIcon sx={{ mr: 1 }} /> {selectedFileDetails.filename}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Описание:
                </Typography>
                <Typography variant="body1">
                  {selectedFileDetails.description || "Описание отсутствует"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Статус:
                </Typography>
                <Typography variant="body1">
                  {selectedFileDetails.is_public ? "Публичный" : "Приватный"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Дата загрузки:
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedFileDetails.uploaded_at)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    handleDownload(
                      selectedFileDetails.id,
                      selectedFileDetails.filename
                    );
                    handleCloseDetails();
                  }}
                >
                  Скачать файл
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUploadSection;