import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getCategories } from '../api/api';

function CreatePostPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories(1, 100);
      setCategories(data.items || []);
    } catch (err) {
      setError('Ошибка загрузки категорий');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const post = await createPost({
        ...formData,
        categoryId: parseInt(formData.categoryId),
      });
      navigate(`/posts/${post.id}`);
    } catch (err) {
      setError(err.message || 'Ошибка создания поста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <i className="bi bi-plus-circle me-2"></i>
                Создать пост
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Заголовок</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={255}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="categoryId" className="form-label">Категория</label>
                  <select
                    className="form-select"
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Содержание</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="10"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Создание...' : 'Создать пост'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/posts')}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;