// components/TabContent.jsx
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Typography,
  Space,
  Tag,
  Spin,
  Alert,
  Empty
} from 'antd';
import SectionContent from './SectionContent';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TabContent = ({ tabSlug }) => {
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTabContent();
  }, [tabSlug]);

  const fetchTabContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://edutalks.ru/api/taxonomy/tree');
      
      if (response.ok) {
        const data = await response.json();
        
        // Находим нужный таб по slug
        const foundTab = data.data.items.find(item => 
          item.tab.slug === tabSlug
        );
        
        if (foundTab) {
          setTabData(foundTab);
        } else {
          setError('Таб не найден');
        }
      } else {
        throw new Error('Ошибка загрузки контента');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Ошибка"
        description={error}
        type="error"
        style={{ margin: '20px' }}
      />
    );
  }

  if (!tabData) {
    return (
      <Empty
        description="Контент не доступен"
        style={{ margin: '40px 0' }}
      />
    );
  }

  const { tab, sections } = tabData;

  return (
    <div style={{ padding: '24px' }}>
     

      {/* Вкладки с секциями */}
      {sections && sections.length > 0 ? (
        <Tabs
          type="card"
          size="large"
          tabPosition="top"
          style={{ background: '#fff', padding: '0 16px' }}
        >
          {sections.map((sectionItem) => {
            const section = sectionItem.section;
            return (
              <TabPane
                key={section.id}
                tab={
                  <Space size="small">
                    <span>{section.title}</span>
                    {!section.is_active && (
                      <Tag color="red" size="small">Неактивна</Tag>
                    )}
                  </Space>
                }
              >
                <div style={{ padding: '24px 0' }}>
                  <SectionContent section={{ ...section, docs_count: sectionItem.docs_count }} />
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      ) : (
        <Card>
          <Empty description="В этом табе нет секций" />
        </Card>
      )}

     
    </div>
  );
};

export default TabContent;