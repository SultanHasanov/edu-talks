// components/ProtectedLanding.jsx
import { useEffect, useState } from 'react';
import LandingPage from '../pages/LandingPage';

const ProtectedLanding = () => {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Проверяем, видел ли пользователь лендинг ранее
    const hasSeenLanding = localStorage.getItem('hasSeenLanding');
    
    if (hasSeenLanding) {
      // Если видел - перенаправляем на главную страницу приложения
      setShowLanding(false);
      window.location.href = '/recomm'; // или другой путь по умолчанию
    } else {
      // Если не видел - помечаем, что теперь увидел
      localStorage.setItem('hasSeenLanding', 'true');
      setShowLanding(true);
    }
  }, []);

  if (!showLanding) {
    return null; // или можно показать loader
  }

  return <LandingPage />;
};

export default ProtectedLanding;