import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Space,
  Row,
  Col,
  Divider,
  Button,
  Menu,
  theme,
  Avatar,
  Card,
  Descriptions,
} from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  BankOutlined,
  IdcardOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { RequisitesPage } from "./RequisitesPage";

const { Footer } = Layout;
const { useToken } = theme;

const AppFooter = () => {
  const { token } = useToken();
  const navigate = useNavigate();

  return (
    <Footer
      style={{
        backgroundColor: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        padding: "10px 0",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 15px",
        }}
      >
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <Col xs={24} md={8}>
            <Space direction="vertical" size="middle">
              <Space>
                <Avatar
                  shape="square"
                  style={{
                    backgroundColor: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography.Text
                    strong
                    style={{ color: "white", fontSize: 18 }}
                  >
                    B
                  </Typography.Text>
                </Avatar>
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    color: token.colorTextHeading,
                    fontWeight: 600,
                  }}
                >
                  EduTalks
                </Typography.Title>
              </Space>
              <Typography.Text type="secondary">
                Образовательная платформа для современных педагогов
              </Typography.Text>
              <Space size="middle">
                <Button type="text" shape="circle" icon={<GithubOutlined />} />
                <Button type="text" shape="circle" icon={<TwitterOutlined />} />
                <Button
                  type="text"
                  shape="circle"
                  icon={<LinkedinOutlined />}
                />
              </Space>
            </Space>
          </Col>

          <Col xs={24} md={8}>
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              Контакты
            </Typography.Title>
            <Space direction="vertical" size="middle">
              <Space>
                <MailOutlined />
                <Typography.Link href="mailto:info@edutalks.ru">
                  info@edutalks.ru
                </Typography.Link>
              </Space>
              <Space>
                <Typography.Link onClick={() => navigate("/requisites")}>
                  Реквизиты
                </Typography.Link>
              </Space>
              <Typography.Text type="secondary">
                © {new Date().getFullYear()} EduTalks. Все права защищены.
              </Typography.Text>
              <Typography.Text type="secondary">Версия 1.0.0</Typography.Text>
            </Space>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

// Новая страница с реквизитами
<RequisitesPage/>
export default AppFooter;