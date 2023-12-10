import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newUser.css';

const NewUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    // Perform registration logic here
    // You can send the user data to the server or perform any required actions
    navigate('/main'); // Navigate to the main page after registration
  };

  return (
    <div className='newuser-container'>
      <div className='register-container'>
        <input
          placeholder='Username'
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
        <input
          placeholder='Phone Number'
          type='text'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <br />
        <input
          placeholder='Country'
          type='text'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
          <option value='client'>Client</option>
        </select>
        <br />
        <input
          placeholder='Address'
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <input
          placeholder='Contact Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </p>
        <br />
        <button type='button' onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default NewUser;
