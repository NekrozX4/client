import React, { useState } from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import Depot from '../depot/Depot';
import Nombre from '../depot/Nombre';
import Operation from '../operation/Operation';
import Destinataire from '../destinataire/Destinataire';
import Configuration from '../configuration/Configuration';
import Welcome from '../welcome/Welcome';

const Main = () => {
  const navigate = useNavigate();
  const [clickedDiv, setClickedDiv] = useState(null);
  const [clickedP, setClickedP] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);;
 
  const logout = () => {
    navigate('/');
  };
  
  const handleMouseEnter = (section) => {
    setClickedDiv(section);
  };

  const handleMouseLeave = () => {
    setClickedDiv(null);
  };

  const handleClickedP = (p) => {
    setClickedP(p === clickedP ? null : p);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const renderContent = () => {
    switch (clickedP) {
      case 'Particulier':
        return <Depot />;
      case 'nombre':
        return <Nombre />;
      case 'groupement':
        return <Configuration />;
      case 'destinataire':
        return <Destinataire />;
      default:
        return <Welcome/>;
    }
  };

  return (
    <div className="container">
      <header>
        <div className='poste'></div>
        <div
          onClick={toggleDropdown}
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
              <p>Utilisateurs</p>
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
