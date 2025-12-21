import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getPosts, getPostsByFilter } from '../api/api';

function PostsPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subscriptionsOnly, setSubscriptionsOnly] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [goToPage, setGoToPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [currentPage, selectedCategory, subscriptionsOnly, pageSize]);

  const loadCategories = async () => {
    try {
      const data = await getCategories(1, 100);
      setCategories(data.items || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      // Если активен хотя бы один фильтр - используем метод фильтрации
      if (selectedCategory || subscriptionsOnly) {
        data = await getPostsByFilter(currentPage, pageSize, selectedCategory, subscriptionsOnly);
        setPosts(data.content || []);
        setPagination({
          totalPages: data.totalPages,
          currentPage: data.number + 1,
          isFirst: data.first,
          isLast: data.last,
        });
      } else {
        data = await getPosts(currentPage, pageSize);
        setPosts(data.items || []);
        setPagination({
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          isFirst: data.isFirst,
          isLast: data.isLast,
        });
      }
    } catch (err) {
      setError('Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === 'all' ? null : parseInt(categoryId));
    setCurrentPage(1);
  };

  const handleSubscriptionsToggle = () => {
    setSubscriptionsOnly(!subscriptionsOnly);
    setCurrentPage(1);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><i className="bi bi-file-text me-2"></i>Посты</h1>
        <Link to="/posts/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Создать пост
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-funnel me-2"></i>Фильтры
          </h5>
          
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="categoryFilter" className="form-label">Категория:</label>
              <select
                id="categoryFilter"
                className="form-select"
                value={selectedCategory || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="all">Все категории</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label d-block">&nbsp;</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="subscriptionsFilter"
                  checked={subscriptionsOnly}
                  onChange={handleSubscriptionsToggle}
                  style={{ cursor: 'pointer' }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="subscriptionsFilter"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-person-check me-1"></i>
                  Только подписки
                </label>
              </div>
            </div>
          </div>

          {(selectedCategory || subscriptionsOnly) && (
            <div className="mt-2">
              <small className="text-muted">
                Активные фильтры: 
                {selectedCategory && <span className="badge bg-secondary ms-2">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>}
                {subscriptionsOnly && <span className="badge bg-info ms-2">Подписки</span>}
              </small>
            </div>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="alert alert-info">
              {subscriptionsOnly 
                ? 'Нет постов от пользователей, на которых вы подписаны' 
                : 'Постов пока нет'}
            </div>
          ) : (
            <div className="row">
              {posts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">
                        {post.content.substring(0, 100)}
                        {post.content.length > 100 ? '...' : ''}
                      </p>
                      <div className="mb-2">
                        <span className="badge bg-secondary">{post.categoryName}</span>
                      </div>
                      <p className="card-text">
                        <small className="text-muted">
                          Автор: <Link to={`/users/${post.authorId}`}>{post.authorLogin}</Link>
                        </small>
                      </p>
                    </div>
                    <div className="card-footer bg-transparent">
                      <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                        Читать полностью
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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

export default PostsPage;