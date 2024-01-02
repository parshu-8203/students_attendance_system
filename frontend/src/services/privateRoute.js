
import React from 'react';
import {Navigate } from 'react-router-dom';
import AuthService from './authService';

const PrivateRoute = ({ element }) => {
    const isAuthenticated = AuthService.isAuthenticated();
    return isAuthenticated ? (
        element
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoute;
