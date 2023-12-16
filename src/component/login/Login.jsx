import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showInputError, setShowInputError] = useState(false); // State for input error
  const navigate = useNavigate('');

  const handleLogin = async () => {
    try {
      // Validate inputs
      if (!email || !password) {
        setShowInputError(true);
        return;
      }
  
      setShowInputError(false);
  
      // Fetch users
      const usersResponse = await fetch('http://localhost:8081/utilisateur');
      const usersData = await usersResponse.json();
  
      // Find a user with matching email and password
      const user = usersData.find((user) => user.Us_login === email && user.Us_pwd === password);
  
      if (user) {
        if (user.Fo_id === 1) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          console.log('Logged-in user data:', user);
          console.log('Login successful! Redirecting to /main');
          navigate('/main', { state: { loggedInUser: user } });
        } else if (user.Fo_id === 2) {
          console.log('User does not have admin privileges.');
          navigate('/saisie');
        }
      } else {
        console.log('Invalid credentials.');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
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
            placeholder={`Login${showInputError ? ' - veuillez remplir ce champ' : ''}`}
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={showInputError ? 'input-error' : ''} // Apply the input error class conditionally
          />
          <br /> 
          <input
            placeholder={`Password${showInputError ? ' - veuillez remplir ce champ' : ''}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showInputError ? 'input-error' : ''} // Apply the input error class conditionally
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
            <p>Login failed. Please check your credentials or user privileges.</p>
            <button onClick={closeErrorPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
