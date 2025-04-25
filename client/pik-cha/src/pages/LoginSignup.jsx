import React, {useState} from 'react'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import bgImage from '../assets/bg.webp';
import '../index.css';

const LoginSignup = () => {

  const [action,setAction] = useState('login');

  const signupLink = () => {
    setAction('signup');
  };

  const loginLink = () => {
    setAction('login');
  };

  return (
    <div className="wrapper">
      <div className="image-container">
        <img src={bgImage} alt="Background" />
      </div>
      {action === 'login' && (
        <div className='form-box login'>
          <form action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder='Username' required/>
              <FaUser className='icon'/>
            </div>
            <div className="input-box">
              <input type="password" placeholder='Password' required/>
              <FaLock className='icon'/>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>Remember me</label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>

            <div className="signup-link">
              <p>Don't have an account? <a href="#" onClick={signupLink}>Sign Up</a></p>
            </div>
          </form>
        </div>
      )}

      {action === 'signup' && (
        <div className='form-box signup'>
          <form action="">
            <h1>Signup</h1>
            <div className="input-box">
              <input type="text" placeholder='Username' required/>
              <FaUser className='icon'/>
            </div>
            <div className="input-box">
              <input type="email" placeholder='Email' required/>
              <FaEnvelope className='icon'/>
            </div>
            <div className="input-box">
              <input type="password" placeholder='Password' required/>
              <FaLock className='icon'/>
            </div>

            <div className="remember-forgot">
              <label><input type="checkbox"/>I agree to the terms & conditions</label>
            </div>

            <button type="submit">Sign Up</button>

            <div className="signup-link">
              <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default LoginSignup;
