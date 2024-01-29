import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
import AuthService from './services/authService';
import AdminLogin from './components/AdminPanel/AdminLogin';
import Admin from './components/AdminPanel';
import AddStudent from './components/AdminPanel/AddStudent';
import ForgotPassword from './components/AdminPanel/ForgotPassword';
import Navbar from './components/AdminPanel/AdminNavbar';
import EditStudentScreen from './components/AdminPanel/EditStudent';
import DeleteStudentScreen from './components/AdminPanel/DeleteStudent';
import ProfileScreen from './components/AdminPanel/ProfileScreen';
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
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to="/admin" />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/admin"
          element={<PrivateRoute element={<Admin />} />}
        />
        <Route
          path="/addStudent"
          element={<PrivateRoute element={<AddStudent />} />}
        />
        <Route
          path="/editStudent"
          element={<PrivateRoute element={<EditStudentScreen />} />}
        />
        <Route
          path="/deleteStudent"
          element={<PrivateRoute element={<DeleteStudentScreen />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<ProfileScreen onLogout={handleLogout} />} />}
        />
        <Route path="/forgot-password/:token" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
