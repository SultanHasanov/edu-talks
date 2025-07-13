import { Typography, Box, Container, Chip, Alert, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BackButtonIcon from "../ui/BackButtonIcon";
import { useEffect, useState } from "react";

const BlockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverNews, setServerNews] = useState([]);

   const blocks = [
    {
      id: "1",
      title: "Как написать содержательный раздел ООП под ФОП",
      type: "РЕКОМЕНДАЦИЯ",
      content: `
      <h3>Основные требования к разделу ООП</h3>
      <p>При составлении основной образовательной программы согласно ФГОС необходимо учитывать:</p>
      <ul>
        <li>Требования федерального государственного образовательного стандарта</li>
        <li>Особенности контингента обучающихся</li>
        <li>Специфику образовательной организации</li>
      </ul>
      <p>Рекомендуемый объем раздела - не менее 15 страниц.</p>
    `,
       date: "Сегодня",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      color: "#93c5fd"
    },
    {
      id: "2",
      title: "Положение о локальных актах",
      type: "ДОКУМЕНТ",
      content: `
      <h3>Структура положения</h3>
      <p>Типовое положение о локальных нормативных актах должно включать:</p>
      <ol>
        <li>Общие положения</li>
        <li>Порядок разработки и принятия</li>
        <li>Виды локальных актов</li>
        <li>Порядок внесения изменений</li>
      </ol>
      <p>Документ подлежит утверждению приказом директора.</p>
    `,
       date: "Сегодня",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      color: "#86efac"
    },
    {
      id: "3",
      title: "Правила приема в школу",
      type: "ИНСТРУКЦИЯ",
      content: `
      <h3>Алгоритм приема учащихся</h3>
      <p>Прием документов осуществляется:</p>
      <ul>
        <li>С 1 апреля по 30 июня - для детей, проживающих на закрепленной территории</li>
        <li>С 6 июля - для детей, не проживающих на закрепленной территории</li>
      </ul>
      <p>Необходимые документы: заявление, свидетельство о рождении, документ о регистрации.</p>
    `,
      date: "Вчера",
       color: "#fca5a5",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"

    },
    {
      id: "4",
      title: "Справка об обучении для сдающих ЕГЭ",
      type: "ОБРАЗЕЦ",
      content: `
      <h3>Форма справки</h3>
      <p>Справка должна содержать:</p>
      <ul>
        <li>Наименование образовательной организации</li>
        <li>ФИО обучающегося</li>
        <li>Класс/курс</li>
        <li>Подпись директора и печать</li>
      </ul>
      <p>Срок действия справки - 1 год с даты выдачи.</p>
    `,
      date: "2 дня назад",
      color: "#d8b4fe",
      image: "https://images.unsplash.com/photo-1561164517-686f490ee86d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "5",
      title: "Как оформить отношения с учеником, который не сдал ЕГЭ",
      type: "РЕКОМЕНДАЦИЯ",
      content: `
      <h3>Варианты продолжения обучения</h3>
      <p>Для учащихся, не сдавших ЕГЭ:</p>
      <ol>
        <li>Повторное обучение</li>
        <li>Перевод на обучение по индивидуальному учебному плану</li>
        <li>Получение справки об обучении</li>
      </ol>
      <p>Все решения оформляются приказом по школе.</p>
    `,
      date: "3 дня назад",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      color: "#93c5fd"
    },
    {
      id: "6",
      title: "Изменения в учебных планах с 1 сентября 2025 года",
      type: "ИЗМЕНЕНИЯ",
      content: `
      <h3>Основные изменения</h3>
      <p>С 1 сентября 2025 года вступают в силу:</p>
      <ul>
        <li>Новые требования к часам внеурочной деятельности</li>
        <li>Обязательный второй иностранный язык с 5 класса</li>
        <li>Изменения в перечне обязательных предметов</li>
      </ul>
      <p>Переходный период - 1 учебный год.</p>
    `,
      date: "Неделю назад",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      color: "#fcd34d"
    },
  ];

   useEffect(() => {
    if (id && id.startsWith("server-")) {
      const fetchNewsDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://85.143.175.100:8080/news');
          if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
          }
          const data = await response.json();
          setServerNews(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNewsDetails();
    }
  }, [id]);

  const serverBlocks = serverNews?.map((newsItem, index) => ({
    id: `server-${index}`,
    title: newsItem.title,
    type: "НОВОСТЬ",
    content: `<p>${newsItem.content}</p>`,
    date: new Date().toLocaleDateString(),
    image: "https://charodeikibg.ru/_si/0/78235036.jpg",
    color: "#7dd3fc"
  }));

  // Объединение локальных и серверных блоков
  const allBlocks = [...blocks, ...serverBlocks];
  const block = allBlocks.find((b) => b.id === id);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

 if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка при загрузке новости: {error}
        </Alert>
        <BackButtonIcon />
      </Container>
    );
  }

  if (!block) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Новость не найдена
        </Alert>
        <BackButtonIcon />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <BackButtonIcon />
      
      <Box sx={{ 
        backgroundColor: "#fff", 
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}>
        {/* Баннер с изображением */}
        <Box sx={{
          height: 300,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${block.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "flex-end",
          p: 3
        }}>
          <Box>
            <Chip 
              label={block.type} 
              sx={{ 
                backgroundColor: block.color, 
                color: "white",
                fontWeight: "bold",
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{ 
                color: "white", 
                fontWeight: 700,
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
              }}
            >
              {block.title}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "rgba(255,255,255,0.9)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
              }}
            >
              Опубликовано: {block.date}
            </Typography>
          </Box>
        </Box>

        {/* Контент */}
        <Box sx={{ p: 4 }}>
          <Box 
            sx={{
              "& h3": {
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2937",
                mt: 4,
                mb: 2
              },
              "& p": {
                fontSize: "1.1rem",
                lineHeight: 1.6,
                mb: 2,
                color: "#4b5563"
              },
              "& ul, & ol": {
                pl: 3,
                mb: 2
              },
              "& li": {
                mb: 1,
                fontSize: "1.1rem",
                color: "#4b5563"
              }
            }}
            dangerouslySetInnerHTML={{ __html: block.content }} 
          />
        </Box>
      </Box>
    </Container>
  );
};

export default BlockDetails;