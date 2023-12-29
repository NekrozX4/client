import React, { useState } from 'react';
import './Depot.css';

const Depot = ({ onHistoryClick, lightMode }) => {
  
  const [expediteurName, setExpediteurName] = useState('');
  const [expediteurAddress, setExpediteurAddress] = useState('');
  const [destinataireName, setDestinataireName] = useState('');
  const [destinataireAddress, setDestinataireAddress] = useState('');
  const [destinataireTel, setDestinataireTel] = useState('');
  const [numero, setNumero] = useState('');
  const [montant, setMontant] = useState('');
  const [poids, setPoids] = useState('');
  const[taxes, setTaxes] = useState('')
  const [grpCode, setGrpCode] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);


  const handleEnvoiClick = async () => {
    console.log('Handling Envoi Click');
  
    try {
      const expediteurExists = await verifyBeneficiaire(expediteurName, expediteurAddress);
  
      if (!expediteurExists) {
        alert('Expediteur not found in beneficiaire table');
        return;
      }
  
      const destinataireExists = await verifyBeneficiaire(destinataireName, destinataireAddress);
  
      if (!destinataireExists) {
        alert('Destinataire not found in beneficiaire table');
        return;
      }
  
      // Fetch group code for the expediteur directly
      const expediteurGrpCode = await fetchBeneficiaireGroupCode(expediteurName);
  
      if (!expediteurGrpCode) {
        alert('Group code not found for the expediteur');
        return;
      }
  
      // Fetch groupement data for the expediteur's group code
      const groupementData = await fetchGroupementData(expediteurGrpCode);
  
      if (groupementData.length === 0) {
        alert('Groupement not found for the expediteur');
        return;
      }
  
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
  
      // Find the corresponding groupement for the expediteur
      const matchingGroupement = groupementData.find(groupement => groupement.Grp_code === expediteurGrpCode);
  
      console.log('Expediteur GrpCode:', expediteurGrpCode);
      console.log('Groupement Data:', groupementData);
  
      if (!matchingGroupement) {
        alert('Matching groupement not found for the expediteur');
        return;
      }
  
      const Env_agence_depot = matchingGroupement.Grp_nom;
  
      console.log('Final Env_agence_depot:', Env_agence_depot);
  
      const envoiData = {
        Env_num: numero,
        Env_poids: poids,
        Env_exp: expediteurName,
        Env_dest: destinataireName,
        Env_taxe: taxes,
        Env_date_depot: formattedDate.slice(0, 10),
        Env_agence_depot: Env_agence_depot,
      };
  
      const response = await sendEnvoiData(envoiData);
  
      if (response && response.error) {
        throw new Error(`Failed to send envoi data: ${response.error}`);
      }
  
      console.log('Envoi added successfully!');
      setSuccessPopup(true);
  
      // Reset state
      setExpediteurName('');
      setExpediteurAddress('');
      setDestinataireName('');
      setDestinataireAddress('');
      setDestinataireTel('');
      setNumero('');
      setMontant('');
      setPoids('');
      setGrpCode(''); 
  
      setTimeout(() => {
        setSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error handling envoi:', error);
  
      setErrorPopup(true);
  
      setTimeout(() => {
        setErrorPopup(false);
      }, 3000);
    }
  };
      
  const fetchBeneficiaireGroupCode = async (name) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}`);
      const beneficiaireData = await response.json();
  
      console.log(`Beneficiaire data for ${name}:`, beneficiaireData);
  
      if (beneficiaireData.length > 0) {
        const expediteurData = beneficiaireData.find(beneficiaire => beneficiaire.Ben_Nom === name);
        return expediteurData.Grp_code;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching beneficiaire data:', error);
      return null;
    }
  };
  
    

  const verifyBeneficiaire = async (name) => {
    try {
      const response = await fetch(`http://localhost:8081/benefs?Ben_Nom=${name}&`);
      const beneficiaireData = await response.json();

      console.log(`Verifying ${name}:`, beneficiaireData);

      return beneficiaireData.some(
        (beneficiaire) =>
          beneficiaire.Ben_Nom === name
      );
    } catch (error) {
      console.error('Error verifying beneficiaire:', error);
      return false;
    }
  };

  const fetchGroupementData = async (grpCode) => {
    try {
      const response = await fetch(`http://localhost:8081/groupement/${grpCode}`);
      const groupementData = await response.json();
  
      console.log(`Groupement data for ${grpCode}:`, groupementData);
  
      return groupementData;
    } catch (error) {
      console.error('Error fetching groupement data:', error);
      return [];
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
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(`Failed to send envoi data: ${responseData.message}`);
      }
  
      console.log('Envoi data sent successfully', responseData);
      return responseData; 
    } catch (error) {
      console.error('Error sending envoi data', error);
      throw error; 
    }
  };

  const handleHistoriqueClick = () => {
    onHistoryClick();
  };

  return (
     <div className={`particulier-container ${lightMode ? 'light-mode' : ''}`}>
      <h1>Particulier</h1>
      <h2 className='history' onClick={handleHistoriqueClick}>
        Deposit list
      </h2>
      <button onClick={handleEnvoiClick}>submit</button>

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
          <h1 className='depot-butt' onClick={handleEnvoiClick}>
            Envoi
          </h1>
          <input
            type='text'
            placeholder='Numero'
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type='text'
            placeholder='Montant'
            value={taxes}
            onChange={(e) => setTaxes(e.target.value)}
          />
          <input
            className='bottom-input'
            type='text'
            placeholder='Poids'
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
          />
        </div>
        {successPopup && (
          <div className='success-popup'>send successfully!</div>
        )}

        {/* Error Popup */}
        {errorPopup && (
          <div className='error-popup'>
           Error when sending 
          </div>
        )}
        </div>
      </div>
  );
};

export default Depot;
