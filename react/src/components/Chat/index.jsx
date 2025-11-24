import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken, removeToken, getUsername } from '../../utils/auth';
import { getMessages, createMessage } from '../../api/messages';
import './styles.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const username = getUsername();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    fetchMessages();
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const data = await getMessages(token);
      setMessages(data);
    } catch (err) {
      setError('Ошибка при загрузке сообщений');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSending(true);
      setError(null);
      const token = getToken();
      const newMessage = await createMessage(token, text);
      setMessages([...messages, newMessage]);
      setText('');
    } catch (err) {
      setError('Ошибка при отправке сообщения');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container" data-easytag="id1-react/src/components/Chat/index.jsx">
      <header className="chat-header">
        <div className="chat-header-content">
          <h1>Групповой чат</h1>
          <div className="chat-header-actions">
            <Link to="/profile" className="profile-link">
              {username}
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="messages-container">
        {loading && <div className="loading-message">Загрузка сообщений...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && messages.length === 0 && (
          <div className="empty-message">Пока нет сообщений. Будьте первым!</div>
        )}
        {!loading && messages.length > 0 && (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-header">
                  <span className="message-username">{message.username}</span>
                  <span className="message-timestamp">
                    {formatTimestamp(message.created_at)}
                  </span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите сообщение..."
            className="message-input"
            disabled={sending}
          />
          <button
            type="submit"
            className="send-button"
            disabled={sending || !text.trim()}
          >
            {sending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;