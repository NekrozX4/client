import React from 'react';
import './Destinataire.css';

const Destinataire = () => {
  return (
    <div className='destinataire-container'>
      <h1>Destinataire</h1>

      <div className='input-container'>
        <div className='input-group'>
          <button>client</button>
          <button>Select One</button>
          <button>Send</button>
        </div>

        <div className='input-group'>
          <h2>Details</h2>
          <input type='text' placeholder='Code' />
          <input type='text' placeholder='Nom' />
          <input type='text' placeholder='Prenom' />
          <input type='text' placeholder='Adresse' />
          <button>envoi</button>
        </div>
      </div>
    </div>
  );
};

export default Destinataire;
