import React from 'react';
import { Result, Button } from 'antd';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Произошла ошибка:', error, errorInfo);
    // Логирование можно сюда
  }

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Что-то пошло не так"
          subTitle="Произошла ошибка. Вернитесь на главную страницу."
          extra={[
            <Button type="primary" onClick={this.handleGoHome} key="home">
              Перейти на главную
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}
