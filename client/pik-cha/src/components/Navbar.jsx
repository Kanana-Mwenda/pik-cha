import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaUser, FaCameraRetro } from 'react-icons/fa';
import '../index.css';

const Navbar = () => {
  return (
    <nav>
      <div>
        <Link to="/">
          <FaCameraRetro />
          Pik-cha
        </Link>
        <Link to="/loginsignup">
          <FaUser />
          Login/Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;