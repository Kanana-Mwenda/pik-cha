import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaUser, FaCameraRetro } from 'react-icons/fa';

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
    <nav className="flex items-center justify-between h-[90px] px-8 bg-[#212121] text-white">
      <div>
        <Link
          to="/"
          className="flex items-center font-bold text-xl text-[#fdfcfd] font-poppins tracking-wide transition-colors duration-300 border-b-2 border-transparent"
        >
          <FaCameraRetro className="mr-2 text-[1.8rem]" />
          <span className="text-[1.2rem]">Pik-cha</span>
        </Link>
      </div>

      <div className="flex gap-6">
        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold font-poppins text-[1.1rem] transition hover:bg-white/10 hover:rounded-md ${
            location.pathname === '/' ? 'underline' : ''
          }`}
          onClick={handleHomeClick}
        >
          Home
        </button>

        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold font-poppins text-[1.1rem] transition hover:bg-white/10 hover:rounded-md ${
            location.pathname === '/loginsignup' ? 'underline' : ''
          }`}
          onClick={handleLoginSignupClick}
        >
          <FaUser className="mr-[5px]" />
          Login/Signup
        </button>

        
      </div>
    </nav>
  );
};

export default Navbar;
