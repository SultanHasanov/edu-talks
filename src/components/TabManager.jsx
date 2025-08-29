import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import {
  Table as AntTable,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Card,
} from "antd";

const { Option } = Select;

const TabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedTabs, setExpandedTabs] = useState({});
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [currentTabId, setCurrentTabId] = useState(null);
  const [form] = Form.useForm();

  const access_token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    position: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchTabs();
  }, []);

  const fetchTabs = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://edutalks.ru/api/taxonomy/tree", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTabs(data.data?.items || []);
      } else {
        throw new Error("Ошибка загрузки табов");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tab = null) => {
    if (tab) {
      setEditingTab(tab);
      setFormData({
        title: tab.title,
        slug: tab.slug,
        position: tab.position,
        is_active: tab.is_active,
      });
    } else {
      setEditingTab(null);
      const nextPosition =
        tabs.length > 0
          ? Math.max(...tabs.map((t) => t.tab?.position || 0)) + 1
          : 0;

      setFormData({
        title: "",
        slug: "",
        position: nextPosition,
        is_active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTab(null);
    setFormData({
      title: "",
      slug: "",
      position: 0,
      is_active: true,
    });
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const url = editingTab
        ? `https://edutalks.ru/api/admin/tabs/${editingTab.id}`
        : "https://edutalks.ru/api/admin/tabs";

      const method = editingTab ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(editingTab ? "Таб обновлен" : "Таб создан");
        fetchTabs();
        handleCloseDialog();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка сохранения");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tabId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот таб?")) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://edutalks.ru/api/admin/tabs/${tabId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Таб удален");
        fetchTabs();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("Ошибка удаления");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleExpand = (tabId) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  // Section Management
  const handleOpenSectionModal = (tabId, section = null) => {
    setCurrentTabId(tabId);
    setEditingSection(section);

    if (section) {
      form.setFieldsValue({
        title: section.section.title,
        slug: section.section.slug,
        description: section.section.description,
        position: section.section.position,
        is_active: section.section.is_active,
      });
    } else {
      form.resetFields();
      // Calculate next position for new section
      const tab = tabs.find((t) => t.tab.id === tabId);
      const maxPosition = tab.sections
        ? Math.max(...tab.sections.map((s) => s.position || 0), 0)
        : 0;
      form.setFieldsValue({
        position: maxPosition + 1,
        is_active: true,
      });
    }
    setSectionModalVisible(true);
  };

  const handleSectionSubmit = async (values) => {
    try {
      const url = editingSection
        ? `https://edutalks.ru/api/admin/sections/${editingSection.id}`
        : "https://edutalks.ru/api/admin/sections";

      const method = editingSection ? "PATCH" : "POST";

      const payload = {
        ...values,
        tab_id: currentTabId,
        created_at: editingSection?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success(editingSection ? "Секция обновлена" : "Секция создана");
        fetchTabs();
        setSectionModalVisible(false);
        setEditingSection(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка сохранения");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту секцию?")) return;

    try {
      const response = await fetch(
        `https://edutalks.ru/api/admin/sections/${sectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.ok) {
        message.success("Секция удалена");
        fetchTabs();
      } else {
        throw new Error("Ошибка удаления");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Управление табами и секциями</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить таб
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%"></TableCell>
              <TableCell width="25%">Название</TableCell>
              <TableCell width="15%">Slug</TableCell>
              <TableCell width="10%">Позиция</TableCell>
              <TableCell width="10%">Статус</TableCell>
              <TableCell width="20%">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabs?.map((item) => {
              const tab = item.tab;
              const sections = item.sections || [];
              console.log(item);
              const isExpanded = expandedTabs[tab.id];

              return (
                <React.Fragment key={tab.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        onClick={() => toggleExpand(tab.id)}
                        size="small"
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">{tab.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={tab.slug} variant="outlined" />
                    </TableCell>
                    <TableCell>{tab.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={tab.is_active ? "Активен" : "Неактивен"}
                        color={tab.is_active ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(tab)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(tab.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenSectionModal(tab.id)}
                        sx={{ ml: 1 }}
                      >
                        Добавить секцию
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                          <Typography variant="h6" gutterBottom>
                            Секции таба "{tab.title}"
                          </Typography>

                          {sections.length === 0 ? (
                            <Typography color="textSecondary">
                              Нет секций
                            </Typography>
                          ) : (
                            <AntTable
                              dataSource={sections}
                              rowKey="id"
                              pagination={false}
                              size="small"
                            >
                              <AntTable.Column
                                title="Название"
                                key="title"
                                render={(_, record) => record.section.title}
                              />
                              <AntTable.Column
                                title="Slug"
                                key="slug"
                                render={(_, record) => record.section.slug}
                              />
                              <AntTable.Column
                                title="Позиция"
                                key="position"
                                render={(_, record) => record.section.position}
                              />
                              <AntTable.Column
                                title="Статус"
                                key="is_active"
                                render={(_, record) => (
                                  <Chip
                                    label={
                                      record.section.is_active
                                        ? "Активна"
                                        : "Неактивна"
                                    }
                                    color={
                                      record.section.is_active
                                        ? "success"
                                        : "default"
                                    }
                                    size="small"
                                  />
                                )}
                              />
                              <AntTable.Column
                                title="Действия"
                                key="actions"
                                render={(_, record) => (
                                  <Space>
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        handleOpenSectionModal(tab.id, record)
                                      }
                                    >
                                      Редактировать
                                    </Button>
                                    <Button
                                      size="small"
                                      danger
                                      onClick={() =>
                                        handleDeleteSection(record.section.id)
                                      }
                                    >
                                      Удалить
                                    </Button>
                                  </Space>
                                )}
                              />
                            </AntTable>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tab Modal */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTab ? "Редактировать таб" : "Создать таб"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Название таба"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
            />
            <TextField
              label="Slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              fullWidth
              helperText="Уникальный идентификатор для URL"
            />
            <TextField
              label="Позиция"
              type="number"
              value={formData.position}
              onChange={(e) =>
                handleInputChange("position", parseInt(e.target.value))
              }
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) =>
                    handleInputChange("is_active", e.target.checked)
                  }
                />
              }
              label="Активный"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingTab ? "Обновить" : "Создать"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Modal */}
      <Modal
        title={editingSection ? "Редактировать секцию" : "Создать секцию"}
        open={sectionModalVisible}
        onCancel={() => setSectionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSectionSubmit}>
          <Form.Item
            name="title"
            label="Название секции"
            rules={[{ required: true, message: "Введите название секции" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Введите slug" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="position"
            label="Позиция"
            rules={[{ required: true, message: "Введите позицию" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="is_active" label="Статус" valuePropName="checked">
            <Select>
              <Option value={true}>Активна</Option>
              <Option value={false}>Неактивна</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setSectionModalVisible(false)}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSection ? "Обновить" : "Создать"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Box>
  );
};

export default TabManager;
