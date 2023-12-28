import React, { useState,useEffect } from 'react';
import '../main/Main.css';
import { useNavigate } from 'react-router-dom';
import Depot from '../depot/Depot';
import Nombre from '../depot/Nombre';
import User from '../user/User';
import Destinataire from '../destinataire/Destinataire';
import Configuration from '../configuration/Configuration';
import Welcome from '../welcome/Welcome';
import Historique from '../historique/Historique';
import F12 from '../F12/F12';
import GroupDetail from '../group_detail/GroupDetail';
import '../../App.css'

const Main = () => {
  const navigate = useNavigate();
  const [clickedDiv, setClickedDiv] = useState(null);
  const [clickedP, setClickedP] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistorique, setShowHistorique] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(true);
  
  const [lightMode, setLightMode] = useState(() => {
    // Load the theme from localStorage or default to false (dark mode)
    const storedMode = localStorage.getItem('lightMode');
    return storedMode === 'true';
  });


const Logout = () => {
 
  localStorage.removeItem('loggedInUser');

  navigate('/');
};

  
  const handleMouseEnter = (section) => {
    setClickedDiv(section);
  };

  const handleMouseLeave = () => {
    setClickedDiv(null);
  };

  const handleClickedP = (p) => {
    console.log('Clicked component:', p);
  
    if (p) {
      setClickedP(p);
      setShowHistorique(false);
      setShowDetail(false);
      localStorage.setItem('lastClickedComponent', p);
      console.log('Stored last clicked component:', p);
    } else {
      console.error('Invalid component name:', p);
    }
  };
  
  
  
  
  useEffect(() => {
    // Load the last clicked component from localStorage when the component mounts
    const storedClickedComponent = localStorage.getItem('lastClickedComponent');
      console.log('Stored last clicked component:', storedClickedComponent);
      if (storedClickedComponent) {
        setClickedP(storedClickedComponent);
      }
  
    // Load the theme from localStorage when the component mounts
    const storedMode = localStorage.getItem('lightMode');
    if (storedMode) {
      setLightMode(storedMode === 'true');
    }
  
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  
  }, []);
  const handleWelcomeClick = (clickedSection) => {
    setClickedP(clickedSection);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toogleLeave = () => {
    setShowDropdown(null);
  };


  const handleHistoryClick = () => {
    setShowHistorique(true);
  };

  const handleShowDetail = (group) => {
    setSelectedGroup(group);
    setShowDetail(true);
  };
  
  
  const toggleTheme = () => {
    setLightMode((prevMode) => {
      // Toggle the theme and store the preference in localStorage
      const newMode = !prevMode;
      localStorage.setItem('lightMode', newMode.toString());
      return newMode;
    });
  };


  // Add a class to the container based on the lightMode state
  const containerClass = lightMode ? 'container light-mode' : 'container';
  const sidebarClass = lightMode ? 'sidebar light-mode' : 'sidebar';
  const contentClass = lightMode ? 'content light-mode' : 'content';
  const headerClass = lightMode ? 'header light-mode': 'header';

  const renderContent = () => {
    if (showHistorique) {
      return <Historique />;
    } else if (showDetail) {
      return <GroupDetail selectedGroup={selectedGroup} onClose={() => setShowDetail(false)} />;
    } else {
      switch (clickedP) {
        case 'Particulier':
          return <Depot onHistoryClick={handleHistoryClick} lightMode={lightMode} />;
        case 'En nombre':
          return <Nombre onHistoryClick={handleHistoryClick} lightMode={lightMode} />;
          case 'F12' :
          return <F12 />
        case 'Groupement': 
          return <Configuration onDetailClick={handleShowDetail} lightMode={lightMode} />;
        case 'Utilisateur':
          return <User lightMode={lightMode} />;
        case 'Destinataire':
          return <Destinataire lightMode={lightMode} />;
        case 'home':
          return <Welcome onWelcomeClick={handleWelcomeClick} lightMode={lightMode} setLastClickedComponent={setClickedP} />;
        default:
          return <Welcome onWelcomeClick={handleWelcomeClick} lightMode={lightMode} setLastClickedComponent={setClickedP} />;
      }
    }
  };
  
  
  return (
    <div className={containerClass}>
      <header className={headerClass}>
  <div className='poste'></div>
  <div className='home' onClick={() => handleClickedP('home')}></div>
  <div className='user-class'>
    <div className='user-name'>{loggedInUser?.Us_nom}</div>
    <div
      onMouseEnter={toggleDropdown}
      onMouseLeave={toogleLeave}
      className={`user-dropdown ${showDropdown ? 'active' : ''}`}
    >
      {showDropdown && (
        <div className="dropdown-content">
          <div>Modification</div>
          <div>Pass</div>
          <button onClick={Logout} className="Btn">
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <h2 className="text">Logout</h2>
          </button>
        </div>
      )}
    </div>
        <label className="ui-switch">
                <input type="checkbox"
                id="themeToggle"
                onChange={toggleTheme}
                checked={lightMode}
                className="theme-toggle"/>
                <div className="slider">
                  <div htmlFor="themeToggle" className="circle"></div>
                </div>
              </label>
        </div>
     
      </header>

      <div className="content-container">
        <aside className={sidebarClass}>
        <div onClick={() => handleClickedP('home')} > home</div>
          <div onMouseEnter={() => handleMouseEnter('depot')} onMouseLeave={handleMouseLeave}>
            Depot
            {clickedDiv === 'depot' && (
              <>
                <p onClick={() => handleClickedP('Particulier')}>Particulier</p>
                <p onClick={() => handleClickedP('En nombre')}>En nombre</p>
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
                <p onClick={() => handleClickedP('F12')}>F12</p>
                <p>Etats</p>
              </>
            )}
          </div>
          <div onMouseEnter={() => handleMouseEnter('configuration')} onMouseLeave={handleMouseLeave}>
            Configuration
            {clickedDiv === 'configuration' && (
              <>
                <p onClick={() => handleClickedP('Groupement')}>Groupement</p>
                <p onClick={() => handleClickedP('Utilisateur')}>Utilisateurs</p>
                <p onClick={() => handleClickedP('Destinataire')}>Destinataires</p>
              </>
            )}
          </div>
          <div className='sidebarshow'> ☰ </div>
        </aside>
        <div className={contentClass}>{renderContent()}</div>
       
      </div>
    </div>
  );
};

export default Main;
