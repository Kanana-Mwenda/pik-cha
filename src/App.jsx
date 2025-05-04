


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LoginSignup from './pages/LoginSignup.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      {/* Remove Navbar since it's not used */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginsignup" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
