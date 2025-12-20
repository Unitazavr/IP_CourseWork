import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="bi bi-person-plus me-2"></i>
                Регистрация
              </h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="login" className="form-label">Логин</label>
                  <input
                    type="text"
                    className="form-control"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordConfirm" className="form-label">Подтвердите пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">Уже есть аккаунт? Войти</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;