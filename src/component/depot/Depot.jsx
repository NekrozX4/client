import React from 'react';
import './Depot.css';

const Depot = () => {
  return (
    <div>
      <h1>Particulier</h1>
      <h2 className='history'>Historiques</h2>
      <div className="input-container">
        <div className="input-group">
          <h2>Expediteur</h2>
          <input type="text" placeholder="Name" />
          <input className='bottom-input'type="text" placeholder="Adress" />
        </div>

        <div className="input-group">
          <h2>Destinataire</h2>
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Adress" />
          <input className='bottom-input' type ="number" placeholder='tel si exterieur' />
        </div>
      </div>
      <div className="input-container" >
        <div className="input-group" >
        <button className='depot-butt'>Envoi</button>
        <input type = 'number' placeholder='numero'/>
        <input type = 'number' placeholder='montant' />
        <input className='bottom-input' type = 'text' placeholder='poids' />
      </div>
          </div>
    </div>
  );
};

export default Depot;
