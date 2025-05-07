import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ImageProvider } from './store/ImageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Editor from './pages/Editor';
import Gallery from './pages/Gallery';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/loginsignup" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loginsignup" element={<LoginSignup />} />
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ImageProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AppRoutes />
            <Toaster position="top-right" />
          </div>
        </ImageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
