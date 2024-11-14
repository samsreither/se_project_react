import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    // check if user is authenticated by isLoggedIn state or checking token
    const isAuthenticated = isLoggedIn || localStorage.getItem('token');
    console.log(isAuthenticated);
    // return protected component if authenticated, otherwise redirect
    return isAuthenticated ? children : <Navigate to="/" replace/> ;

};

export default ProtectedRoute;