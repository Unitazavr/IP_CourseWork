import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/api';

function UsersPage({ user }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [goToPage, setGoToPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers(currentPage, pageSize);
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

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= pagination.totalPages) {
      setCurrentPage(pageNum);
      setGoToPage('');
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

          {/* Улучшенная пагинация - теперь всегда видна */}
          <nav className="mt-4">
            <div className="row align-items-center mb-3">
              <div className="col-md-4">
                <div className="d-flex align-items-center">
                  <label className="me-2 text-nowrap">Элементов на странице:</label>
                  <select 
                    className="form-select form-select-sm" 
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <form onSubmit={handleGoToPage} className="d-flex align-items-center">
                  <label className="me-2 text-nowrap">Перейти на:</label>
                  <input
                    type="number"
                    className="form-control form-control-sm me-2"
                    value={goToPage}
                    onChange={(e) => setGoToPage(e.target.value)}
                    placeholder="№"
                    min="1"
                    max={pagination.totalPages || 1}
                    style={{ width: '70px' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-sm btn-outline-primary"
                    disabled={!goToPage}
                  >
                    Перейти
                  </button>
                </form>
              </div>
            </div>

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
                  {pagination.currentPage || 1} / {pagination.totalPages || 1}
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
        </>
      )}
    </div>
  );
}

export default UsersPage;