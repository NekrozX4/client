import React from 'react';
import './Depot.css';

const Depot = () => {
  return (
    <div>
      <h1>Particulier</h1>
      <div className="input-container">
        <div className="input-group">
          <h2>Expediteur</h2>
          <input type="text" placeholder="Name" />
          <input className='bottom-input'type="text" placeholder="Adress" />
        </div>

        <div className="input-group">
          <h2>Destinataire</h2>
          <input type="text" placeholder="Name" />
          <input className='bottom-input'type="text" placeholder="Adress" />
        </div>
      </div>
      <div className="send-button-container">
        <button>Send</button>
      </div>
    </div>
  );
};

export default Depot;
