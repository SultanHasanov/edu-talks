import React from "react";
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
} from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { useToken } = theme;

const AppFooter = () => {
  const { token } = useToken();

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
          // maxWidth: 1200,
          // margin: '0 auto',
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

export default AppFooter;
