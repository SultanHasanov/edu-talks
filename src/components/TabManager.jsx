import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  message,
  Card,
  Tag,
  Collapse,
  Divider,
  Typography,
  Row,
  Col,
  Popconfirm
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CaretDownOutlined,
  CaretUpOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const TabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [tabModalVisible, setTabModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [currentTabId, setCurrentTabId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabForm] = Form.useForm();
  const [sectionForm] = Form.useForm();

  const access_token = localStorage.getItem("access_token");

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
        setTabs(data.data?.data || []);
      } else {
        throw new Error("Ошибка загрузки данных");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tab Operations
  const handleOpenTabModal = (tab = null) => {
    setEditingTab(tab);
    
    if (tab) {
      tabForm.setFieldsValue({
        title: tab.title,
        slug: tab.slug,
        position: tab.position,
        is_active: tab.is_active,
      });
    } else {
      const nextPosition = tabs.length > 0 
        ? Math.max(...tabs.map(t => t.tab?.position || 0)) + 1 
        : 0;
      
      tabForm.setFieldsValue({
        title: "",
        slug: "",
        position: nextPosition,
        is_active: true,
      });
    }
    setTabModalVisible(true);
  };

  const handleTabSubmit = async (values) => {
    try {
      setLoading(true);
      
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
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success(editingTab ? "Таб обновлен" : "Таб создан");
        fetchTabs();
        setTabModalVisible(false);
        setEditingTab(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка сохранения");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTab = async (tabId) => {
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
        message.success("Таб удален");
        fetchTabs();
      } else {
        throw new Error("Ошибка удаления");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Section Operations
  const handleOpenSectionModal = (tabId, section = null) => {
    setCurrentTabId(tabId);
    setEditingSection(section);

    if (section) {
      sectionForm.setFieldsValue({
        title: section.title,
        slug: section.slug,
        description: section.description,
        position: section.position,
        is_active: section.is_active,
      });
    } else {
      const tab = tabs.find(t => t.tab.id === tabId);
      const maxPosition = tab.sections
        ? Math.max(...tab.sections.map(s => s.position || 0), 0)
        : 0;
      
      sectionForm.setFieldsValue({
        title: "",
        slug: "",
        description: "",
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

  const columns = [
    {
      title: "Название",
      dataIndex: ["tab", "title"],
      key: "title",
      render: (text, record) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: "Slug",
      dataIndex: ["tab", "slug"],
      key: "slug",
      render: (slug) => <Tag color="blue">{slug}</Tag>,
    },
    {
      title: "Позиция",
      dataIndex: ["tab", "position"],
      key: "position",
      align: 'center',
    },
    {
      title: "Статус",
      dataIndex: ["tab", "is_active"],
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Активен" : "Неактивен"}
        </Tag>
      ),
    },
    {
      title: "Кол-во секций",
      key: "sectionsCount",
      render: (_, record) => (
        <Tag>{record.sections?.length || 0}</Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => {
        const tab = record.tab;
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleOpenTabModal(tab)}
              size="small"
            >
              Редактировать
            </Button>
            
            <Popconfirm
              title="Удалить таб?"
              description="Все секции этого таба также будут удалены. Продолжить?"
              onConfirm={() => handleDeleteTab(tab.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
              >
                Удалить
              </Button>
            </Popconfirm>

            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="small"
              onClick={() => handleOpenSectionModal(tab.id)}
            >
              Добавить секцию
            </Button>
          </Space>
        );
      },
    },
  ];

  const expandableRender = (record) => {
    const sections = record.sections || [];
    
    return (
      <Card size="small" title={`Секции таба "${record.tab.title}"`}>
        {sections.length === 0 ? (
          <Text type="secondary">Нет секций</Text>
        ) : (
          <Table
            dataSource={sections.map(s => ({ ...s.section, key: s.section.id }))}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Название",
                dataIndex: "title",
                key: "title",
              },
              {
                title: "Slug",
                dataIndex: "slug",
                key: "slug",
                render: (slug) => <Tag>{slug}</Tag>,
              },
              {
                title: "Позиция",
                dataIndex: "position",
                key: "position",
                align: 'center',
              },
              {
                title: "Статус",
                dataIndex: "is_active",
                key: "is_active",
                render: (isActive) => (
                  <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Активна" : "Неактивна"}
                  </Tag>
                ),
              },
              {
                title: "Действия",
                key: "actions",
                render: (_, section) => (
                  <Space>
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenSectionModal(record.tab.id, section)}
                    >
                      Редактировать
                    </Button>
                    <Popconfirm
                      title="Удалить секцию?"
                      onConfirm={() => handleDeleteSection(section.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Удалить
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        )}
      </Card>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Управление табами и секциями</Title>
          <Text type="secondary">
            Создавайте и редактируйте табы и их секции для организации контента
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenTabModal()}
            size="large"
          >
            Добавить таб
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={tabs.map(tab => ({ ...tab, key: tab.tab.id }))}
          loading={loading}
          expandable={{
            expandedRowRender: expandableRender,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <CaretUpOutlined onClick={e => onExpand(record, e)} />
              ) : (
                <CaretDownOutlined onClick={e => onExpand(record, e)} />
              ),
          }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Tab Modal */}
      <Modal
        title={editingTab ? "Редактировать таб" : "Создать таб"}
        open={tabModalVisible}
        onCancel={() => setTabModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={tabForm}
          layout="vertical"
          onFinish={handleTabSubmit}
        >
          <Form.Item
            name="title"
            label="Название таба"
            rules={[{ required: true, message: "Введите название таба" }]}
          >
            <Input placeholder="Введите название таба" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Введите slug" }]}
            tooltip="Уникальный идентификатор для URL"
          >
            <Input placeholder="Введите slug" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Позиция"
            rules={[{ required: true, message: "Введите позицию" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Статус"
            valuePropName="checked"
          >
            <Switch checkedChildren="Активен" unCheckedChildren="Неактивен" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setTabModalVisible(false)}>
                Отмена
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {editingTab ? "Обновить" : "Создать"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Section Modal */}
      <Modal
        title={editingSection ? "Редактировать секцию" : "Создать секцию"}
        open={sectionModalVisible}
        onCancel={() => setSectionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={sectionForm}
          layout="vertical"
          onFinish={handleSectionSubmit}
        >
          <Form.Item
            name="title"
            label="Название секции"
            rules={[{ required: true, message: "Введите название секции" }]}
          >
            <Input placeholder="Введите название секции" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Введите slug" }]}
          >
            <Input placeholder="Введите slug" />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea 
              rows={3} 
              placeholder="Введите описание секции (необязательно)" 
            />
          </Form.Item>

          <Form.Item
            name="position"
            label="Позиция"
            rules={[{ required: true, message: "Введите позицию" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Статус"
            valuePropName="checked"
          >
            <Switch checkedChildren="Активна" unCheckedChildren="Неактивна" />
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
    </div>
  );
};

export default TabManager;