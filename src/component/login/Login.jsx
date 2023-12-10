import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate('')

  const handleLogin = () => {
    console.log(`Logging in with username: ${username} and password: ${password}`);
    navigate('/main')
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            placeholder='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            placeholder='Password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <p className='hide-show'type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
          <br />
          <button type='button' onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
