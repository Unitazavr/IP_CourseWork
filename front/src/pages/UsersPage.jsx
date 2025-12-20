import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/api';

function UsersPage({ user }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers(currentPage, 3);
      setUsers(data.items || []);
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        isFirst: data.isFirst,
        isLast: data.isLast,
      });
    } catch (err) {
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        <i className="bi bi-people me-2"></i>
        Пользователи
      </h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <div className="alert alert-info">Пользователей не найдено</div>
          ) : (
            <div className="row">
              {users.map(u => (
                <div key={u.id} className="col-md-4 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-person-circle display-1 text-primary"></i>
                      <h5 className="card-title mt-2">{u.login}</h5>
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                        {u.role}
                      </span>
                      <div className="mt-3">
                        <small className="text-muted">
                          Подписок: {u.subscriptions?.length || 0}
                        </small>
                        <br />
                        <small className="text-muted">
                          Подписчиков: {u.subscribers?.length || 0}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <Link 
                        to={`/users/${u.id}`} 
                        className="btn btn-sm btn-outline-primary w-100"
                      >
                        Профиль
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.isFirst ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={pagination.isFirst}
                  >
                    Предыдущая
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                </li>
                <li className={`page-item ${pagination.isLast ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={pagination.isLast}
                  >
                    Следующая
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default UsersPage;