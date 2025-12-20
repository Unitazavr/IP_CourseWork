import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/api';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCategories(1, 3);
      setCategories(data.items || []);
    } catch (err) {
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCategoryName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name: categoryName });
      } else {
        await createCategory({ name: categoryName });
      }
      handleCloseModal();
      loadCategories();
    } catch (err) {
      alert('Ошибка сохранения категории');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить категорию? Все посты в этой категории останутся без категории.')) {
      return;
    }

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert('Ошибка удаления категории');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-tags me-2"></i>
          Управление категориями
        </h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Создать категорию
        </button>
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
          {categories.length === 0 ? (
            <div className="alert alert-info">Категорий пока нет</div>
          ) : (
            <div className="row">
              {categories.map(cat => (
                <div key={cat.id} className="col-md-4 col-lg-3 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-tag me-2"></i>
                        {cat.name}
                      </h5>
                      <div className="d-flex gap-2 mt-3">
                        <button 
                          onClick={() => handleOpenModal(cat)} 
                          className="btn btn-sm btn-warning flex-grow-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="btn btn-sm btn-danger flex-grow-1"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Название категории</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                      maxLength={100}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Сохранить' : 'Создать'}
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

export default CategoriesPage;