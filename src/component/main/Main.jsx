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

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle search submission logic if needed
    console.log('Search submitted:', searchTerm);
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
        case 'En Nombre':
          return <Nombre onHistoryClick={handleHistoryClick} lightMode={lightMode} />;
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
              <div onClick={logout}>Se deconnecter</div>
              <input
                  type="checkbox"
                  id="themeToggle"
                  onChange={toggleTheme}
                  checked={lightMode}
                  className="theme-toggle"
                />
                <label htmlFor="themeToggle" className="slider"></label>
            </div>
          )}
        </div>
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
        <div className={contentClass}>{renderContent()}</div>
       
      </div>
    </div>
  );
};

export default Main;
