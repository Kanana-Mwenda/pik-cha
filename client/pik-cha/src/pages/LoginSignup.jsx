import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import bgImage from '../assets/bg2.jpeg';

const LoginSignup = () => {
  const [action, setAction] = useState('login');

  const signupLink = () => setAction('signup');
  const loginLink = () => setAction('login');

  return (
    <div className="w-[1000px] h-[600px] bg-white rounded-lg text-black flex items-center justify-between overflow-hidden transition-all duration-200 mx-auto relative">
      <div className="w-1/2 h-full min-w-[500px] max-w-[500px]">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {action === 'login' && (
        <div className="w-1/2 p-10 z-10">
          <form>
            <h1 className="text-4xl text-center font-semibold mb-6">Login</h1>

            <div className="relative w-full h-[50px] mb-6">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full h-full border-2 border-black rounded-full px-5 pr-12 text-base placeholder-gray-500"
              />
              <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-base" />
            </div>

            <div className="relative w-full h-[50px] mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full h-full border-2 border-black rounded-full px-5 pr-12 text-base placeholder-gray-500"
              />
              <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-base" />
            </div>

            <div className="flex justify-between text-sm mb-4">
              <label>
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-800 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full h-[45px] bg-black text-white font-bold rounded-full cursor-pointer"
            >
              Login
            </button>

            <div className="text-sm text-center mt-5">
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={signupLink} className="text-blue-800 font-semibold hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      )}

      {action === 'signup' && (
        <div className="absolute right-0 w-[45%] p-10 z-10">
          <form>
            <h1 className="text-4xl text-center font-semibold mb-6">Signup</h1>

            <div className="relative w-full h-[50px] mb-6">
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full h-full border-2 border-black rounded-full px-5 pr-12 text-base placeholder-gray-500"
              />
              <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-base" />
            </div>

            <div className="relative w-full h-[50px] mb-6">
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full h-full border-2 border-black rounded-full px-5 pr-12 text-base placeholder-gray-500"
              />
              <FaEnvelope className="absolute right-5 top-1/2 transform -translate-y-1/2 text-base" />
            </div>

            <div className="relative w-full h-[50px] mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full h-full border-2 border-black rounded-full px-5 pr-12 text-base placeholder-gray-500"
              />
              <FaLock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-base" />
            </div>

            <div className="text-sm mb-4">
              <label>
                <input type="checkbox" className="mr-2" /> I agree to the terms & conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-[45px] bg-black text-white font-bold rounded-full cursor-pointer"
            >
              Sign Up
            </button>

            <div className="text-sm text-center mt-5">
              <p>
                Already have an account?{' '}
                <a href="#" onClick={loginLink} className="text-blue-800 font-semibold hover:underline">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
