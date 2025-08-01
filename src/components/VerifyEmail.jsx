// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import axios from 'axios';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const showModal = (title, content, isSuccess) => {
    Modal[isSuccess ? 'success' : 'error']({
      title,
      content,
      okText: 'ОК',
      onOk: () => navigate('/'), // редирект на главную
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      showModal('Ошибка', 'Токен не найден в ссылке', false);
      setLoading(false);
      return;
    }

    axios
      .post('https://edutalks.ru/api/verify-email', { token }) // Или GET: `/api/auth/verify-email?token=${token}`
      .then(() => {
        showModal('Почта подтверждена', 'Вы успешно подтвердили свою почту ✅', true);
      })
      .catch((error) => {
        console.error('Ошибка подтверждения:', error);
        showModal('Ошибка', 'Ссылка недействительна или уже использована', false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.search]);

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      {loading && <Spin size="large" tip="Подтверждаем почту..." />}
    </div>
  );
}
