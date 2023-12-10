import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newUser.css'

const NewUser = () => {
  const [username , setUsername] = useState('')
  const [password , setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    navigate('/main')
  }
  return (
    <div className='newuser-container'>
      <div className='register-container'>
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
          <button type='button' onClick={handleRegister}>
            LOGIN
          </button>
      </div>
    </div>
  )
}

export default NewUser;
