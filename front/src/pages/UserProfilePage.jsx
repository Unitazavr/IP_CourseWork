import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, getUserById, subscribeToUser, unsubscribeFromUser, updatePassword } from '../api/api';

function UserProfilePage({ currentUser, isOwnProfile }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const userId = isOwnProfile ? currentUser.id : parseInt(id);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserById(userId);
      setUser(data);
      
      if (!isOwnProfile && currentUser) {
        const subscribed = currentUser.subscriptions?.some(sub => sub.id === data.id);
        setIsSubscribed(subscribed);
      }
    } catch (err) {
      setError('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribeToUser(userId);
      setIsSubscribed(true);
      loadUser();
    } catch (err) {
      alert('Ошибка подписки');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromUser(userId);
      setIsSubscribed(false);
      loadUser();
    } catch (err) {
      alert('Ошибка отписки');
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;

    try {
      await deleteUser(userId);
      if (isOwnProfile) {
        window.location.href = '/login';
      } else {
        navigate('/users');
      }
    } catch (err) {
      alert('Ошибка удаления пользователя');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      await updatePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', newPasswordConfirm: '' });
      alert('Пароль успешно изменен');
    } catch (err) {
      alert('Ошибка изменения пароля');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error || 'Пользователь не найден'}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <i className="bi bi-person-circle display-1 text-primary"></i>
              <h2 className="mt-3">{user.login}</h2>
              <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'} mb-3`}>
                {user.role}
              </span>

              {!isOwnProfile && currentUser.id !== user.id && (
                <div className="d-grid gap-2 mb-3">
                  {isSubscribed ? (
                    <button onClick={handleUnsubscribe} className="btn btn-outline-danger">
                      <i className="bi bi-person-dash me-2"></i>
                      Отписаться
                    </button>
                  ) : (
                    <button onClick={handleSubscribe} className="btn btn-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Подписаться
                    </button>
                  )}
                </div>
              )}

              {isOwnProfile && (
                <div className="d-grid gap-2 mb-3">
                  <button 
                    onClick={() => setShowPasswordModal(true)} 
                    className="btn btn-warning"
                  >
                    <i className="bi bi-key me-2"></i>
                    Изменить пароль
                  </button>
                </div>
              )}

              {(isOwnProfile || currentUser.role === 'ADMIN') && (
                <div className="d-grid gap-2">
                  <button onClick={handleDeleteUser} className="btn btn-danger">
                    <i className="bi bi-trash me-2"></i>
                    Удалить аккаунт
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow mb-3">
            <div className="card-body">
              <h4 className="card-title">Подписки ({user.subscriptions?.length || 0})</h4>
              {user.subscriptions && user.subscriptions.length > 0 ? (
                <div className="list-group">
                  {user.subscriptions.map(sub => (
                    <a 
                      key={sub.id} 
                      href={`/users/${sub.id}`} 
                      className="list-group-item list-group-item-action"
                    >
                      <i className="bi bi-person me-2"></i>
                      {sub.login}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Нет подписок</p>
              )}
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title">Подписчики ({user.subscribers?.length || 0})</h4>
              {user.subscribers && user.subscribers.length > 0 ? (
                <div className="list-group">
                  {user.subscribers.map(sub => (
                    <a 
                      key={sub.id} 
                      href={`/users/${sub.id}`} 
                      className="list-group-item list-group-item-action"
                    >
                      <i className="bi bi-person me-2"></i>
                      {sub.login}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Нет подписчиков</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Изменить пароль</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <form onSubmit={handlePasswordChange}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Старый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Новый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Подтвердите новый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPasswordConfirm}
                      onChange={(e) => setPasswordData({...passwordData, newPasswordConfirm: e.target.value})}
                      required
                      minLength={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;