import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/api';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/posts">
          <i className="bi bi-newspaper me-2"></i>
          Blog Service
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/posts">
                <i className="bi bi-file-text me-1"></i>
                Посты
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <i className="bi bi-people me-1"></i>
                Пользователи
              </Link>
            </li>
            {user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link" to="/categories">
                  <i className="bi bi-tags me-1"></i>
                  Категории
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle me-1"></i>
                {user?.login}
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Выход
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;