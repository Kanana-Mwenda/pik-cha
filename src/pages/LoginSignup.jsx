// import React, { useState } from 'react';

// const LoginSignup = () => {
//   const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Signup
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '', // Only needed for signup
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isLogin) {
//       console.log('Logging in with', formData.email, formData.password);
//       // Handle login API call here
//     } else {
//       if (formData.password !== formData.confirmPassword) {
//         alert('Passwords do not match!');
//         return;
//       }
//       console.log('Signing up with', formData.email, formData.password);
//       // Handle signup API call here
//     }
//   };

//   return (
//     <div>
//       <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {!isLogin && (
//           <div>
//             <label>Confirm Password:</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//         )}

//         <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
//       </form>

//       <button onClick={() => setIsLogin((prev) => !prev)}>
//         {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
//       </button>
//     </div>
//   );
// };

// export default LoginSignup;
// src/pages/LoginSignup.jsx
import React from 'react';

const LoginSignup = () => {
  return <div>Login or Signup Page</div>;
};

export default LoginSignup; // This is the default export
