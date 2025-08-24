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
  const status = params.get('status');
  const reason = params.get('reason');

  if (status === 'success') {
    showModal('Почта подтверждена', 'Вы успешно подтвердили почту ✅', true);
  } else {
    let message = 'Ссылка недействительна или уже использована';
    if (reason === 'expired') message = 'Срок действия ссылки истёк';
    if (reason === 'missing') message = 'Токен не найден в ссылке';
    showModal('Ошибка', message, false);
  }
  setLoading(false);
}, [location.search]);

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      {loading && <Spin size="large" tip="Подтверждаем почту..." />}
    </div>
  );
}
