import React from "react";
import { Layout, Typography, Card } from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PaymentsAndRefunds = () => {
  return (
    <Layout style={{ background: "#fff", minHeight: "100vh" }}>
      <Content style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <Typography>
          <Title level={2}>Оплата и возвраты</Title>

          <Card style={{ marginBottom: 24 }}>
            <Title level={3}>Условия оплаты</Title>
            <Paragraph>
              • <b>Разовая оплата:</b> доступ предоставляется на выбранный период
              (1 месяц, 6 месяца, 1 год). Сумма списывается единоразово при
              оформлении заказа.
            </Paragraph>
            <Paragraph>
              • <b>Подписка с автопродлением:</b> при выборе тарифа с
              автопродлением оплата списывается автоматически в конце оплаченного
              периода с привязанной карты до момента отмены подписки.
            </Paragraph>
            <Paragraph>
              • <b>Безопасность:</b> все операции проходят через защищённые
              платёжные системы, данные карты не сохраняются на сервере.
            </Paragraph>
          </Card>

          <Card style={{ marginBottom: 24 }}>
            <Title level={3}>Условия возврата</Title>
            <Paragraph>
              • Возврат средств возможен в течение <b>7 календарных дней</b> с
              момента покупки, если доступ к сервису <b>не был использован</b>.
            </Paragraph>
            <Paragraph>
              • Если доступ уже использовался, возврат невозможен, так как услуга
              считается оказанной.
            </Paragraph>
            <Paragraph>
              • Возврат осуществляется на тот же платёжный метод в течение{" "}
              <b>10 рабочих дней</b> после подтверждения запроса.
            </Paragraph>
          </Card>

          <Card>
            <Title level={3}>Отмена подписки</Title>
            <Paragraph>
              • Вы можете отключить автосписание в любой момент:
            </Paragraph>
            <Paragraph>
              Позвоните по номеру +7 (963) 777-50-13.
            
              
            </Paragraph>
            <Paragraph>
              • Доступ будет активен до конца оплаченного периода, новые списания
              не будут производиться.
            </Paragraph>
            <Paragraph>
              • Также подписку можно отменить, написав на{" "}
              <a href="mailto:esutalks@mail.ru">esutalks@mail.ru</a>.
            </Paragraph>
          </Card>
        </Typography>
      </Content>
    </Layout>
  );
};

export default PaymentsAndRefunds;
