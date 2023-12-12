import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate('');

  const handleLogin = async () => {
    // Check if both username and password are provided
    if (!email || !password) {
      console.log('Please enter both username and password.');
      // You might want to show an error message to the user
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8081/admin');
      const data = await response.json();
  
      // Find a user with the matching username and password
      const user = data.find((user) => user.email === email && user.password === password);
  
      if (user && user.privilege === 1) {
        console.log('Login successful! Redirecting to /main');
        navigate('/main');
      } else {
        console.log('Invalid credentials or insufficient privilege.');
        // Handle other cases, e.g., show an error message
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error, e.g., show an error message
      setShowErrorPopup(true);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className='main-container'>
      <div className='login-container'>
        <div className='about-section'>
          <div className='about-image'></div>
        </div>
        <div className='login-section'>
          <h2>LOGIN</h2>
          <input
            placeholder='Email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder='Password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
          <br />
          <button type='button' onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
      {showErrorPopup && (
        <div className="error-popup" onClick={closeErrorPopup}>
          <div className="popup-content">
            <p>Login failed. Please check your credentials.</p>
            <button onClick={closeErrorPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
