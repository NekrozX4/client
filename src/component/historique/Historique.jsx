import React, { useEffect, useState } from 'react';
import './Historique.css';

const Historique = () => {
  const [historiqueData, setHistoriqueData] = useState([]);

  useEffect(() => {
    // Fetch historique data when the component mounts
    fetchHistoriqueData();
  }, []);

  const fetchHistoriqueData = async () => {
    try {
      const response = await fetch('http://localhost:8081/envoi'); // Update the URL accordingly
      const data = await response.json();
      setHistoriqueData(data);
    } catch (error) {
      console.error('Error fetching historique data:', error);
    }
  };

  return (
    <div className='historique-container'>
      <h1>Historique</h1>
      <div className="historique-list">
        {historiqueData.map((envoi) => (
          <div key={envoi.Env_id} className="historique-item">
            <p>
              <strong>From:</strong> {envoi.Env_exp}
              <span className="separator"> | </span>
              <strong>To:</strong> {envoi.Env_dest}
            </p>
            <span>&nbsp;</span>
            <p>
              <strong>Details:</strong> {`Num: ${envoi.Env_num}, Poids: ${envoi.Env_poids}, Taxe: ${envoi.Env_taxe}`}
            </p>
            <p>,</p>
            <span>&nbsp;</span>
            <p>
            <strong>Date:</strong> {envoi.Env_date_depot && new Date(envoi.Env_date_depot).toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi' })}
<span className="separator"> | </span>
<strong>Agence:</strong> {envoi.Env_agence_depot}



            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historique;
