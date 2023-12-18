import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ onWelcomeClick, lightMode }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const handleMouseEnter = (section) => {
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const isSectionActive = (section) => {
    return hoveredSection === section;
  };

  return (
    <div className={`welcome ${lightMode ? 'light-mode' : ''}`}>
      <div
        className='deposit'
        onMouseEnter={() => handleMouseEnter('depot')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('depot') ? (
          <>
            <h2 onClick={() => onWelcomeClick('Particulier')}>Particulier</h2>
            <h2 onClick={() => onWelcomeClick('nombre')}>En Nombre</h2>
          </>
        ) : (
          <h1>DEPOT</h1>
        )}
      </div>

      <div
        className='operation'
        onMouseEnter={() => handleMouseEnter('operations')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('operations') ? (
          <h2>coming soon</h2>
        ) : (
          <h1>OPERATION</h1>
        )}
      </div>

      <div 
        className='edit'
        onMouseEnter={() => handleMouseEnter('edition')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('edition') ? (
          <>
            <h2>Registre</h2>
            <h2>F12</h2>
            <h2>Etats</h2>
          </>
        ) : (
          <h1>EDITION</h1>
        )}
      </div>

      <div 
        className='fadeinup'
        onMouseEnter={() => handleMouseEnter('configuration')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('configuration') ? (
          <>
            <h2 onClick={() => onWelcomeClick('groupement')}>Groupement</h2>
            <h2 onClick={() => onWelcomeClick('user')}>Utilisateur</h2>
            <h2 onClick={() => onWelcomeClick('destinataire')}>Destinataire</h2>
          </>
        ) : (
          <h1>CONFIGURATION</h1>
        )}
      </div>
    </div>
  );
};

export default Welcome;
