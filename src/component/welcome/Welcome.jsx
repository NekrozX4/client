// Welcome.jsx
import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ onWelcomeClick }) => {
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
    <div className='welcome'>
      <div
        className='deposit'
        onMouseEnter={() => handleMouseEnter('depot')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('depot') ? (
          <>
            <h1 onClick={() => onWelcomeClick('Particulier')}>Particulier</h1>
            <h1 onClick={() => onWelcomeClick('nombre')}>En Nombre</h1>
          </>
        ) : (
          <h1>Depot</h1>
        )}
      </div>

      <div
        className='fadeinup'
        onMouseEnter={() => handleMouseEnter('operations')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('operations') ? (
          <h1>coming soon</h1>
        ) : (
          <h1>Operations</h1>
        )}
      </div>

      <div 
        className='fadeindown'
        onMouseEnter={() => handleMouseEnter('edition')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('edition') ? (
          <>
            <h1>Registre</h1>
            <h1>F12</h1>
            <h1>Etats</h1>
          </>
        ) : (
          <h1>Edition</h1>
        )}
      </div>

      <div 
        className='fadeinup'
        onMouseEnter={() => handleMouseEnter('configuration')}
        onMouseLeave={handleMouseLeave}
      >
        {isSectionActive('configuration') ? (
          <>
            <h1 onClick={() => onWelcomeClick('groupement')}>Groupement</h1>
            <h1 onClick={() => onWelcomeClick('user')}>Utilisateur</h1>
            <h1 onClick={() => onWelcomeClick('destinataire')}>Destinataire</h1>
          </>
        ) : (
          <h1>Configuration</h1>
        )}
      </div>
    </div>
  );
};

export default Welcome;
