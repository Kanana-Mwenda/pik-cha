import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-100/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#pikcha-gradient)" />
                <path d="M10 22L16 10L22 22Z" fill="white"/>
                <defs>
                  <linearGradient id="pikcha-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a21caf" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl logo-text text-indigo-700">Pik-Cha</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <UserCircleIcon className="h-6 w-6 text-indigo-500" />
                    <span>{user.username}</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/loginsignup"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors text-sm"
                >
                  <UserCircleIcon className="h-5 w-5 text-white" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
