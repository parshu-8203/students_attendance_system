import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
import AuthService from './services/authService';
import AdminLogin from './components/AdminPanel/AdminLogin';
import Admin from './components/AdminPanel';
import ForgotPassword from './components/AdminPanel/ForgotPassword';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to="/admin" />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin"
          element={<PrivateRoute element={<Admin />} />}
        />
        <Route path="/forgot-password/:token" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
