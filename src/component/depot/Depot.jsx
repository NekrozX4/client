import React, { useState } from 'react';
import './Depot.css';

const Depot = ( {onHistoryClick} ) => {
  const [expediteurName, setExpediteurName] = useState('fita');
  const [expediteurAddress, setExpediteurAddress] = useState('Ambohibao');
  const [destinataireName, setDestinataireName] = useState('fita');
  const [destinataireAddress, setDestinataireAddress] = useState('Ambohibao');
  const [destinataireTel, setDestinataireTel] = useState('');
  const [numero, setNumero] = useState('');
  const [montant, setMontant] = useState('');
  const [poids, setPoids] = useState('');

  const handleEnvoiClick = async () => {
    console.log('Handling Envoi Click');
    
    // Verify if expediteur exists in beneficiaire table
    try {
      const expediteurExists = await verifyBeneficiaire(expediteurName, expediteurAddress);

      console.log('Expediteur exists:', expediteurExists);

      if (!expediteurExists) {
        alert('Expediteur not found in beneficiaire table');
        return;
      }

      // Verify if destinataire exists in beneficiaire table
      const destinataireExists = await verifyBeneficiaire(destinataireName, destinataireAddress);

      console.log('Destinataire exists:', destinataireExists);

      if (!destinataireExists) {
        alert('Destinataire not found in beneficiaire table');
        return;
      }
      // Assuming Env_date_depot is a string in the format 'YYYY-MM-DD HH:mm:ss'
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
      console.log (currentDate)


      const envoiData = {
        Env_num: numero,
        Env_poids: poids,
        Env_exp: expediteurName,
        Env_dest: destinataireName,
        Env_date_depot: formattedDate.slice(0, 10), // Format as 'YYYY-MM-DD'
      };

      await sendEnvoiData(envoiData);

      setExpediteurName('fita');
      setExpediteurAddress('Ambohibao');
      setDestinataireName('fita');
      setDestinataireAddress('Ambohibao');
      setDestinataireTel('');
      setNumero('');
      setMontant('');
      setPoids('');
    } catch (error) {
      console.error('Error handling envoi:', error);
    }
  };

  const verifyBeneficiaire = async (name, address) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}&Ben_Addresse=${address}`);
      const beneficiaireData = await response.json();
  
      console.log(`Verifying ${name}:`, beneficiaireData);
      
      // Check if there is an exact match for the given name and address
      return beneficiaireData.some(
        (beneficiaire) =>
          beneficiaire.Ben_Nom === name && beneficiaire.Ben_Addresse === address
      );
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
    } catch (error) {
      console.error('Error sending envoi data', error);
    }
  };

  const handleHistoriqueClick = () => {
    onHistoryClick();
  };

  return (
    <div>
      <h1>Particulier</h1>
      <h2 className='history' onClick={handleHistoriqueClick}>
        Historiques
      </h2>
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
