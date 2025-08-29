// components/DynamicRoutes.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TabContent from './TabContent';
import TabManager from './TabManager';
import { useAuth } from '../context/AuthContext';
import { Spin } from 'antd';

const DynamicRoutes = () => {
  const [dynamicTabs, setDynamicTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    fetchDynamicTabs();
  }, []);

  const fetchDynamicTabs = async () => {
    try {
      const response = await fetch('https://edutalks.ru/api/taxonomy/tree');
      if (response.ok) {
        const data = await response.json();
        
        // Извлекаем активные табы
        const activeTabs = data.data.data
          .filter(item => item.tab.is_active)
          .map(item => item.tab);

        setDynamicTabs(activeTabs);
      }
    } catch (error) {
      console.error('Ошибка загрузки табов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;
  }

  return (
    <Routes>
      {dynamicTabs.map((tab) => (
        <Route
          key={tab.slug}
          path={tab.slug}
          element={<TabContent tabSlug={tab.slug} />}
        />
      ))}
      {role === 'admin' && (
        <Route path="/admin/tabs" element={<TabManager />} />
      )}
    </Routes>
  );
};

export default DynamicRoutes;