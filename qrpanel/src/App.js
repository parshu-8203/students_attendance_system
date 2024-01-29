import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
import AuthService from './services/authService';
import AdminLogin from './screens/AdminLogin.';
import GenerateQRCode from './screens/QRGenerate';
import Navbar from './screens/Navbar';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to="/generate" />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/generate"
          element={<PrivateRoute element={<GenerateQRCode  />} />}
        />

      </Routes>
    </Router>
  );
};

export default App;
