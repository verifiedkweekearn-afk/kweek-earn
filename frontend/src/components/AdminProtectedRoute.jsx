import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return <div className="p-8 text-center">Loading...</div>;
  return isAuth ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
