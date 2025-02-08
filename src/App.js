import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";
import HomePage from './HomePage';
import './App.css';

function App() {
  const isAuthenticated = useIsAuthenticated();
  return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
      </Router>
  );
}

export default App;
