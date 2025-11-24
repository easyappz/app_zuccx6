import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/profile';
import { getToken, removeToken } from '../../utils/auth';
import './styles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(token);
        setProfile(data);
      } catch (err) {
        setError('Ошибка загрузки профиля');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleBackToChat = () => {
    navigate('/chat');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p className="error">{error}</p>
          <button onClick={handleBackToChat} className="btn btn-secondary">
            Вернуться в чат
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-card">
        <h1>Профиль</h1>
        {profile && (
          <div className="profile-info">
            <div className="profile-field">
              <label>Имя пользователя:</label>
              <p>{profile.username}</p>
            </div>
            <div className="profile-field">
              <label>Дата регистрации:</label>
              <p>{formatDate(profile.created_at)}</p>
            </div>
          </div>
        )}
        <div className="profile-actions">
          <button onClick={handleBackToChat} className="btn btn-secondary">
            Вернуться в чат
          </button>
          <button onClick={handleLogout} className="btn btn-logout">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;