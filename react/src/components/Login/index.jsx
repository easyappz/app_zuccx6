import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { saveUsername } from '../../utils/auth';
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('member', JSON.stringify(data.member));
      saveUsername(username);
      navigate('/chat');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Неверное имя пользователя или пароль');
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Ошибка входа. Попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" data-easytag="id1-react/src/components/Login/index.jsx">
      <div className="login-form-wrapper">
        <h1 className="login-title">Вход</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите пароль"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Нет аккаунта?{' '}
            <Link to="/register" className="footer-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;