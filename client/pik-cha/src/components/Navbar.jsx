import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaUser, FaCameraRetro } from 'react-icons/fa';
import { LuMenu } from 'react-icons/lu'; // Import Dashboard icon
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLoginSignupClick = (e) => {
    e.preventDefault();
    navigate('/loginsignup');
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-logo-link" style={{ display: 'flex', alignItems: 'center' }}>
          <FaCameraRetro style={{ marginRight: '8px', fontSize: '1.8rem' }} />
          <span style={{ fontSize: '1.2rem' }}>Pik-cha</span>
        </Link>
      </div>
      <div className="navbar-links">
        <button
          type="button"
          className={`navbar-button ${location.pathname === '/' ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          Home
        </button>
        <button
          type="button"
          className={`navbar-button ${location.pathname === '/loginsignup' ? 'active' : ''}`}
          onClick={handleLoginSignupClick}
        >
          <FaUser style={{ marginRight: '5px' }} />
          Login/Signup
        </button>
        <button
          type="button"
          className={`navbar-button icon-only ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={handleDashboardClick}
          title="Dashboard"
        >
          <LuMenu style={{ fontSize: '1.2rem' }} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
