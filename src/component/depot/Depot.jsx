import React, { useState } from 'react';
import './Depot.css';

const Depot = () => {
  const [expediteurName, setExpediteurName] = useState('');
  const [expediteurAddress, setExpediteurAddress] = useState('');
  const [destinataireName, setDestinataireName] = useState('');
  const [destinataireAddress, setDestinataireAddress] = useState('');
  const [destinataireTel, setDestinataireTel] = useState('');
  const [numero, setNumero] = useState('');
  const [montant, setMontant] = useState('');
  const [poids, setPoids] = useState('');

  const handleEnvoiClick = async () => {
    // Verify if expediteur exists in beneficiaire table
    const expediteurExists = await verifyBeneficiaire(expediteurName, expediteurAddress);

    if (!expediteurExists) {
      alert('Expediteur not found in beneficiaire table');
      return;
    }

    // Verify if destinataire exists in beneficiaire table
    const destinataireExists = await verifyBeneficiaire(destinataireName, destinataireAddress);

    if (!destinataireExists) {
      alert('Destinataire not found in beneficiaire table');
      return;
    }

    // If both expediteur and destinataire exist, send data to envoi table
    const envoiData = {
      Env_num: numero,
      Env_poids: poids,
      Env_exp: expediteurName,
      Env_dest: destinataireName,
      // Add other properties as needed
    };

    // Call a function to send the envoi data to the server or handle it accordingly
    sendEnvoiData(envoiData);
  };

  const verifyBeneficiaire = async (name, address) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}&Ben_Addresse=${address}`);
      const beneficiaireData = await response.json();
    
      return beneficiaireData.length > 0; // Check if beneficiaire exists
    } catch (error) {
      console.error('Error verifying beneficiaire:', error);
      return false; // Handle error accordingly
    }
  };

  const sendEnvoiData = async (envoiData) => {
    try {
      const response = await fetch('http://localhost:8081/envoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envoiData),
      });

      if (!response.ok) {
        throw new Error('Failed to send envoi data');
      }

      const responseData = await response.json();
      console.log('Envoi data sent successfully', responseData);
      // You can add additional logic here if needed
    } catch (error) {
      console.error('Error sending envoi data', error);
      // Handle error accordingly
    }
  };

  return (
    <div>
      <h1>Particulier</h1>
      <h2 className='history'>Historiques</h2>
      <div className="input-container">
        <div className="input-group">
          <h2>Expediteur</h2>
          <input
            type="text"
            placeholder="Name"
            value={expediteurName}
            onChange={(e) => setExpediteurName(e.target.value)}
          />
          <input
            className='bottom-input'
            type="text"
            placeholder="Address"
            value={expediteurAddress}
            onChange={(e) => setExpediteurAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <h2>Destinataire</h2>
          <input
            type="text"
            placeholder="Name"
            value={destinataireName}
            onChange={(e) => setDestinataireName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={destinataireAddress}
            onChange={(e) => setDestinataireAddress(e.target.value)}
          />
          <input
            className='bottom-input'
            type="text"
            placeholder='Tel if exterieur'
            value={destinataireTel}
            onChange={(e) => setDestinataireTel(e.target.value)}
          />
        </div>
      </div>
      <div className="input-container">
        <div className="input-group">
          <button className='depot-butt' onClick={handleEnvoiClick}>
            Envoi
          </button>
          <input
            type='text'
            placeholder='Numero'
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type='text'
            placeholder='Montant'
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
          <input
            className='bottom-input'
            type='text'
            placeholder='Poids'
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Depot;
