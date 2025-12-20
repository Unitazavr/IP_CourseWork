import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getCurrentUser } from './api/api';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CategoriesPage from './pages/CategoriesPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import PostsPage from './pages/PostsPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import UsersPage from './pages/UsersPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && <Header user={user} onLogout={() => setUser(null)} />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/posts" /> : <LoginPage onLogin={loadUser} />} />
        <Route path="/register" element={user ? <Navigate to="/posts" /> : <RegisterPage />} />
        
        <Route path="/posts" element={<PrivateRoute user={user}><PostsPage user={user} /></PrivateRoute>} />
        <Route path="/posts/:id" element={<PrivateRoute user={user}><PostDetailPage user={user} /></PrivateRoute>} />
        <Route path="/posts/create" element={<PrivateRoute user={user}><CreatePostPage user={user} /></PrivateRoute>} />
        <Route path="/posts/edit/:id" element={<PrivateRoute user={user}><EditPostPage user={user} /></PrivateRoute>} />
        
        <Route path="/users" element={<PrivateRoute user={user}><UsersPage user={user} /></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute user={user}><UserProfilePage currentUser={user} /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute user={user}><UserProfilePage currentUser={user} isOwnProfile={true} /></PrivateRoute>} />
        
        <Route path="/categories" element={<AdminRoute user={user}><CategoriesPage /></AdminRoute>} />
        
        <Route path="/" element={<Navigate to="/posts" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;