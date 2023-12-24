import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showInputError, setShowInputError] = useState(false);
  const navigate = useNavigate('');

  const handleLogin = async () => {
    try {
      // Reset input error state before attempting login
      setShowInputError(false);
  
      // Validate if email and password are provided
      if (!email || !password) {
        setShowInputError(true);
        return;
      }
  
      const usersResponse = await fetch('http://localhost:8081/utilisateur');
      const usersData = await usersResponse.json();
  
      const user = usersData.find(
        (user) => user.Us_login === email && user.Us_pwd === password
      );
  
      if (user) {
        if (user.Fo_id === 1) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          console.log('Logged-in user data:', user);
          console.log('Login successful! Redirecting to user profile');
          setShowSuccessPopup(true);
  
          // Delay the navigation after showing the success popup
          setTimeout(() => {
            navigate(`/main/${user.Us_matricule}`, {
              state: { loggedInUser: user },
            });
          }, 3000); // Adjust the delay as needed
        } else if (user.Fo_id === 2) {
          console.log('User does not have admin privileges.');
          setShowSuccessPopup(true);
  
          // Delay the navigation after showing the success popup
          setTimeout(() => {
            navigate('/saisie');
          }, 3000); // Adjust the delay as needed
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

  useEffect(() => {
    // Close the error popup after 3000 milliseconds (adjust as needed)
    const timeoutId = setTimeout(() => {
      setShowErrorPopup(false);
      setShowSuccessPopup(false); // Corrected from showSuccessPopup to setShowSuccessPopup
    }, 3000);
  
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showErrorPopup, showSuccessPopup]);

  
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='main-container'>
      <div className='login-container'>
        <div className='login-section'>
          <div className='about-image'></div>
          <h2>LOGIN</h2>
          <input
            placeholder={`Login${showInputError ? ' - veuillez remplir ce champ' : ''}`}
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={showInputError ? 'input-error' : ''}
          />
          <br />
          <input
            placeholder={`Password${
              showInputError ? ' - veuillez remplir ce champ' : ''
            }`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={showInputError ? 'input-error' : ''}
          />
          <br />
          <p className='hide-show' type='button' onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </p>
          <br />
          <button type='button' className = 'login-btn' onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
      {showErrorPopup && (
        <div className='error'>
          <div className='popup'>
            <p>Login failed. Please check your credentials or user privileges.</p>
          </div>
        </div>
      )}
      {
        showSuccessPopup && (
          <div className='success-login'>
          <div className='success-login-content'>
            <p>Login successful</p>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default Login;
