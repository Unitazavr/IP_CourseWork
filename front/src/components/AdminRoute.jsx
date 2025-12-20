import { Navigate } from 'react-router-dom';

function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/posts" />;
  }

  return children;
}

export default AdminRoute;