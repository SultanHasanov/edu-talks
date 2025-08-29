import React from 'react';
import { Result, Button, Card } from 'antd';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Произошла ошибка:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
    
    // Логирование в сервис
  }

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  renderErrorContent() {
    const { error, errorInfo } = this.state;

    // Для ошибок с .some()
    if (error?.message?.includes('some is not a function')) {
      return (
        <Result
          status="warning"
          title="Ошибка обработки данных"
          subTitle="Обнаружена проблема с форматом получаемых данных"
          extra={[
            <Button type="primary" onClick={this.handleReload} key="reload">
              Обновить страницу
            </Button>,
            <Button onClick={this.handleGoHome} key="home">
              На главную
            </Button>,
          ]}
        >
          <Card title="Детали ошибки" size="small">
            <p><strong>Тип:</strong> {error?.name}</p>
            <p><strong>Сообщение:</strong> {error?.message}</p>
            <p><strong>Источник:</strong> Проверьте API ответы и обработку массивов</p>
          </Card>
        </Result>
      );
    }

    // Общая ошибка
    return (
      <Result
        status="error"
        title="Что-то пошло не так"
        subTitle="Произошла непредвиденная ошибка"
        extra={[
          <Button type="primary" onClick={this.handleReload} key="reload">
            Обновить страницу
          </Button>,
          <Button onClick={this.handleGoHome} key="home">
            На главную
          </Button>,
        ]}
      >
        {errorInfo && (
          <Card title="Детали ошибки" size="small">
            <p><strong>Ошибка:</strong> {error?.toString()}</p>
            <p><strong>Компонент:</strong> {errorInfo.componentStack}</p>
          </Card>
        )}
      </Result>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorContent();
    }

    return this.props.children;
  }
}