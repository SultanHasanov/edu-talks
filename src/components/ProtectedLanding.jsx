import LandingPage from '../pages/LandingPage';

// Синхронная проверка localStorage
const ProtectedLanding = () => {
  const hasSeenLanding = localStorage.getItem('hasSeenLanding');

  if (hasSeenLanding) {
    // Если уже видел лендинг, сразу редиректим
    window.location.href = '/recomm';
    return null; // ничего не рендерим
  } else {
    // Если не видел — отмечаем и показываем лендинг
    localStorage.setItem('hasSeenLanding', 'true');
    return <LandingPage />;
  }
};

export default ProtectedLanding;
