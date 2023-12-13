// Main.jsx
import React, { useState } from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import Depot from '../depot/Depot';
import Nombre from '../depot/Nombre';
import User from '../user/User';
import Destinataire from '../destinataire/Destinataire';
import Configuration from '../configuration/Configuration';
import Welcome from '../welcome/Welcome';

const Main = () => {
  const navigate = useNavigate();
  const [clickedDiv, setClickedDiv] = useState(null);
  const [clickedP, setClickedP] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const logout = () => {
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMouseEnter = (section) => {
    setClickedDiv(section);
  };

  const handleMouseLeave = () => {
    setClickedDiv(null);
  };

  const handleClickedP = (p) => {
    setClickedP(p);
  };


  const handleWelcomeClick = (clickedSection) => {
    setClickedP(clickedSection);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const toogleLeave = () => {
    setShowDropdown(null)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search submission logic if needed
    console.log('Search submitted:', searchTerm);
  };


  const renderContent = () => {
    switch (clickedP) {
      case 'Particulier':
        return <Depot />;
      case 'nombre':
        return <Nombre />;
      case 'groupement':
        return <Configuration />;
      case 'user':
        return <User />;
      case 'destinataire':
        return <Destinataire />;
      case 'home':
        return <Welcome onWelcomeClick={handleWelcomeClick} />
      default:
        return <Welcome onWelcomeClick={handleWelcomeClick} />;
    }
  };

  return (
    <div className="container">
      <header>
        <div className='poste'></div>
        <div className='home' onClick={() => handleClickedP('home')}></div>
        <div className="search-bar">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit">
              <span role="img" aria-label="Search">
                🔍
              </span>
            </button>
          </form>
        </div>
        <div
          onMouseEnter={toggleDropdown}
          onMouseLeave={toogleLeave}
          className={`user-dropdown ${showDropdown ? 'active' : ''}`}
        >
          {showDropdown && (
            <div className="dropdown-content">
              <div>Modification</div>
              <div>Pass</div>
              <div onClick={logout}>Se deconnecter</div>
            </div>
          )}
        </div>
      </header>

      <div className="content-container">
        <aside className="sidebar">
        <div onClick={() => handleClickedP('home')} > home</div>
          <div onMouseEnter={() => handleMouseEnter('depot')} onMouseLeave={handleMouseLeave}>
            Depot
            {clickedDiv === 'depot' && (
              <>
                <p onClick={() => handleClickedP('Particulier')}>Particulier</p>
                <p onClick={() => handleClickedP('nombre')}>En nombre</p>
              </>
            )}
          </div>
          <div onMouseEnter={() => handleMouseEnter('operation')} onMouseLeave={handleMouseLeave}>
            Operation
          </div>
          <div onMouseEnter={() => handleMouseEnter('edition')} onMouseLeave={handleMouseLeave}>
            Edition
            {clickedDiv === 'edition' && (
              <>
                <p>Registre</p>
                <p>F12</p>
                <p>Etats</p>
              </>
            )}
          </div>
          <div onMouseEnter={() => handleMouseEnter('configuration')} onMouseLeave={handleMouseLeave}>
            Configuration
            {clickedDiv === 'configuration' && (
              <>
                <p onClick={() => handleClickedP('groupement')}>Groupement</p>
                <p onClick={() => handleClickedP('user')}>Utilisateurs</p>
                <p onClick={() => handleClickedP('destinataire')}>Destinataires</p>
              </>
            )}
          </div>
          <div className='sidebarshow'> ☰ </div>
        </aside>

        <div className="content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Main;
