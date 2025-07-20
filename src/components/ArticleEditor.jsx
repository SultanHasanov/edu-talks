import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, Space, Input, Select, message } from 'antd';
import { 
  BoldOutlined, 
  ItalicOutlined, 
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  EyeOutlined,
  SaveOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const ArticleEditor = ({ 
  initialTitle = '', 
  initialContent = '', 
  onSave = null,
  showSavedArticles = true 
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [isPreview, setIsPreview] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  const textAreaRef = useRef(null);
  const editorRef = useRef(null);

  // Обновляем значения при изменении пропсов
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  // Функция для получения позиции курсора в contentEditable
  const getCaretPosition = (element) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  // Функция для установки позиции курсора
  const setCaretPosition = (element, position) => {
    const range = document.createRange();
    const selection = window.getSelection();
    
    let charCount = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nextCharCount = charCount + node.textContent.length;
      if (nextCharCount >= position) {
        range.setStart(node, position - charCount);
        range.setEnd(node, position - charCount);
        break;
      }
      charCount = nextCharCount;
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Функция для применения форматирования
  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
    
    // Обновляем состояние с текущим содержимым
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Функции форматирования
  const makeBold = () => applyFormatting('bold');
  const makeItalic = () => applyFormatting('italic');
  const makeUnderline = () => applyFormatting('underline');

  const makeOrderedList = () => {
    applyFormatting('insertOrderedList');
  };

  const makeUnorderedList = () => {
    applyFormatting('insertUnorderedList');
  };

  const makeLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    const url = prompt('Введите URL ссылки:', 'https://');
    if (url) {
      if (selectedText) {
        applyFormatting('createLink', url);
      } else {
        const linkText = prompt('Введите текст ссылки:', '');
        if (linkText) {
          document.execCommand('insertHTML', false, `<a href="${url}">${linkText}</a>`);
          setContent(editorRef.current.innerHTML);
        }
      }
    }
  };

  const insertHeading = (level) => {
    applyFormatting('formatBlock', `h${level}`);
  };

  // Обработчик изменения содержимого редактора
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Обработчик вставки содержимого
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  // Функция сохранения
  const saveArticle = () => {
    if (!title.trim() || !content.trim()) {
      message.error('Пожалуйста, заполните заголовок и содержание статьи');
      return;
    }

    const articleData = {
      title: title.trim(),
      content: content.trim()
    };

    // Если передан колбэк onSave, используем его
    if (onSave) {
      onSave(articleData);
      message.success('Статья сохранена!');
      return;
    }

    // Иначе сохраняем в локальное состояние (для демонстрации)
    const newArticle = {
      id: Date.now(),
      ...articleData,
      createdAt: new Date().toLocaleString('ru-RU')
    };

    setSavedArticles(prev => [...prev, newArticle]);
    message.success('Статья сохранена!');
  };

  const deleteArticle = (id) => {
    setSavedArticles(prev => prev.filter(article => article.id !== id));
    message.success('Статья удалена');
  };

  const loadArticle = (article) => {
    setTitle(article.title);
    setContent(article.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = article.content;
    }
    setIsPreview(false);
    message.success('Статья загружена в редактор');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Title level={1} className="text-center mb-8">Редактор статей</Title>
      
      <div className={`grid grid-cols-1 ${showSavedArticles ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Редактор */}
        <div className={showSavedArticles ? 'lg:col-span-2' : ''}>
          <Card title="Создание статьи" className="mb-6">
            <Space direction="vertical" className="w-full">
              <Input
                placeholder="Введите заголовок статьи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
                size="large"
              />

              {/* Панель инструментов */}
              <Card size="small" className="mb-4">
                <Space wrap>
                  <Select
                    placeholder="Заголовок"
                    style={{ width: 120 }}
                    onChange={insertHeading}
                    value={undefined}
                  >
                    <Select.Option value={1}>H1</Select.Option>
                    <Select.Option value={2}>H2</Select.Option>
                    <Select.Option value={3}>H3</Select.Option>
                  </Select>
                  
                  <Button icon={<BoldOutlined />} onClick={makeBold} title="Жирный">
                    Жирный
                  </Button>
                  <Button icon={<ItalicOutlined />} onClick={makeItalic} title="Курсив">
                    Курсив
                  </Button>
                  <Button icon={<UnderlineOutlined />} onClick={makeUnderline} title="Подчеркнутый">
                    Подчерк.
                  </Button>
                  <Button icon={<OrderedListOutlined />} onClick={makeOrderedList} title="Нумерованный список">
                    1,2,3
                  </Button>
                  <Button icon={<UnorderedListOutlined />} onClick={makeUnorderedList} title="Маркированный список">
                    Список
                  </Button>
                  <Button icon={<LinkOutlined />} onClick={makeLink} title="Ссылка">
                    Ссылка
                  </Button>
                </Space>
              </Card>

              {/* Редактор с живым форматированием */}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-80 p-4 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                style={{ 
                  minHeight: '400px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                onInput={handleContentChange}
                onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: content }}
                placeholder="Начните писать вашу статью здесь..."
              />

              <Space>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={saveArticle}
                >
                  Сохранить
                </Button>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Предпросмотр */}
          {isPreview && (
            <Card title="Предпросмотр статьи">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{title || 'Заголовок статьи'}</h1>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: content || '<p>Содержание статьи появится здесь...</p>'
                  }}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Сохраненные статьи */}
        {showSavedArticles && (
          <div>
            <Card title={`Сохраненные статьи (${savedArticles.length})`}>
              {savedArticles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Нет сохраненных статей</p>
              ) : (
                <Space direction="vertical" className="w-full">
                  {savedArticles.map((article) => (
                    <Card 
                      key={article.id}
                      size="small"
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => loadArticle(article)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-2">
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-500">{article.createdAt}</p>
                          <div 
                            className="text-sm text-gray-600 mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: article.content.substring(0, 100) + '...' }}
                          />
                        </div>
                        <Button 
                          icon={<DeleteOutlined />} 
                          size="small" 
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteArticle(article.id);
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </Space>
              )}
            </Card>

            {/* Помощь по форматированию */}
            <Card title="Справка по форматированию" className="mt-4" size="small">
              <div className="text-sm space-y-2">
                <div>Выделите текст и нажмите кнопку форматирования</div>
                <div><strong>Жирный текст</strong> - кнопка "Жирный"</div>
                <div><em>Курсив</em> - кнопка "Курсив"</div>
                <div><u>Подчеркнутый</u> - кнопка "Подчерк."</div>
                <div>
                  <ol className="ml-4">
                    <li>Нумерованный список</li>
                  </ol>
                  - кнопка "1,2,3"
                </div>
                <div>
                  <ul className="ml-4 list-disc">
                    <li>Маркированный список</li>
                  </ul>
                  - кнопка "Список"
                </div>
                <div><a href="#" className="text-blue-600 underline">Ссылка</a> - кнопка "Ссылка"</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Пример использования компонента
const ExampleUsage = () => {
  const handleSave = (articleData) => {
    console.log('Сохраняем статью:', articleData);
    // Здесь можно отправить данные на сервер или обработать их
  };

  return (
    <div>
      <ArticleEditor 
        initialTitle="Пример заголовка"
        initialContent="<p>Пример начального содержания статьи</p>"
        onSave={handleSave}
        showSavedArticles={true}
      />
    </div>
  );
};

export default ExampleUsage;