import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Depot.css';

const Nombre = ({ onHistoryClick, lightMode }) => {
  const [csvData, setCSVData] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState([]);
  const [envAgenceDepotData, setEnvAgenceDepotData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (result) => {
        setCSVData(result.data);

        const initialVerificationStatus = await Promise.all(
          result.data.map(async (row) => {
            return await verifyBeneficiaire(row);
          })
        );

        setVerificationStatus(initialVerificationStatus);
      },
    });
  };

  const verifyBeneficiaire = async (row) => {
    try {
      const response = await fetch('http://localhost:8081/benefs');
      const beneficiaireData = await response.json();

      const expediteurExists = beneficiaireData.some((beneficiaire) => {
        const beneficiaireName = (beneficiaire.Ben_Nom || '').trim();
        const envExpName = (row.Env_exp || '').trim();
        return beneficiaireName === envExpName;
      });

      const destinataireExists = beneficiaireData.some((beneficiaire) => {
        const beneficiaireName = (beneficiaire.Ben_Nom || '').trim();
        const envDestName = (row.Env_dest || '').trim();
        return beneficiaireName === envDestName;
      });

      return { expediteurExists, destinataireExists };
    } catch (error) {
      console.error('Error verifying beneficiaire:', error);
      return { expediteurExists: false, destinataireExists: false };
    }
  };

  const fetchGroupementData = async (Grp_code) => {
    try {
      const response = await fetch(`http://localhost:8081/groupement/${Grp_code}`);
      const groupementData = await response.json();

      console.log(`Groupement data for ${Grp_code}:`, groupementData);

      return groupementData;
    } catch (error) {
      console.error('Error fetching groupement data:', error);
      return [];
    }
  };

  const updateEnvAgenceDepotData = async () => {
    try {
      const newEnvAgenceDepotData = await Promise.all(
        csvData.map(async (row) => {
          const expediteurName = (row.Env_exp || '').trim();
          const beneficiaireResponse = await fetch(`http://localhost:8081/benefs?Ben_Nom=${expediteurName}`);
          const beneficiaireData = await beneficiaireResponse.json();
  
          if (beneficiaireData.length > 0) {
            const expediteurData = beneficiaireData.find((beneficiaire) => beneficiaire.Ben_Nom === expediteurName);
            const Grp_code = expediteurData?.Grp_code;
  
            console.log(`Beneficiaire grp_code for ${expediteurName}:`, Grp_code);
  
            const groupementData = await fetchGroupementData(Grp_code);
            console.log(`Groupement data for ${Grp_code}:`, groupementData);
            const matchingGroupement = groupementData.find((groupement) => groupement.Grp_code === Grp_code);

            if (matchingGroupement) {
              const Grp_nom = matchingGroupement.Grp_nom || '';
              return Grp_nom;
            }
          }
  
          return null;
        })
      );
  
      console.log('New EnvAgenceDepotData:', newEnvAgenceDepotData);
      setEnvAgenceDepotData(newEnvAgenceDepotData);
    } catch (error) {
      console.error('Error updating envAgenceDepotData:', error);
      // Handle error as needed
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
  
  const handleSendAllButtonClick = async () => {
    const allEnvoiData = csvData.map((row, index) => ({
      Env_num: row.Env_num,
      Env_poids: row.Env_poids,
      Env_taxe: row.Env_taxe,
      Env_exp: row.Env_exp,
      Env_dest: row.Env_dest,
      Env_agence_depot: envAgenceDepotData[index],
    }));
  
    try {
      const responses = await Promise.all(allEnvoiData.map((envoiData) => sendEnvoiData(envoiData)));
    
      const errors = responses.filter((response) => response && response.error);
    
      if (errors.length > 0) {
        console.error('Failed to send some envoi data:', errors);
      } else {
        console.log('All envoi data sent successfully!');
        alert('Sent succesfully')
      }
    } catch (error) {
      console.error('Error sending envoi data', error);
    } finally {
      setShowSuccessPopup(true);
    
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  }    

  const handleHistoriqueClick = () => {
    onHistoryClick();
  };

  useEffect(() => {
    if (csvData.length > 0) {
      updateEnvAgenceDepotData();
    }
  }, [csvData]);

  const handleCancelButtonClick = async (index) => {
    const updatedCSVData = [...csvData];
    updatedCSVData.splice(index, 1);
  
    // Verify the remaining data
    const updatedVerificationStatus = await Promise.all(
      updatedCSVData.map(async (row) => {
        return await verifyBeneficiaire(row);
      })
    );
  
    setCSVData(updatedCSVData);
    setVerificationStatus(updatedVerificationStatus);
  };
  

  return (
    <div className={`nombre ${lightMode ? 'light-mode' : ''}`}>
      <h2 className='history' onClick={handleHistoriqueClick}>
        Deposit list
      </h2>
      <label htmlFor='fileInput' className='label'>
            Importer un fichier exel
          </label>
      <input type='file' id='fileInput' accept='.csv' onChange={handleFileUpload} />
      <button className= 'send-all' onClick={handleSendAllButtonClick}>send all</button>
      <table className='nbr-table'>
        <thead>
          <tr>
            <th>Numero</th>
            <th>Poids</th>
            <th>Montant</th>
            <th>Expediteur</th>
            <th>Destinataire</th>
            <th className='agence'>Agence</th>
            <th>Verification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {csvData.map((row, index) => (
    <tr key={index}>
      <td>{row.Env_num}</td>
      <td>{row.Env_poids} g</td>
      <td>{row.Env_taxe} <span>&nbsp;</span><span>&nbsp;</span>Ar</td>
      <td style={{ backgroundColor: verificationStatus[index]?.expediteurExists ? 'rgb(0, 128, 0,0.5)': 'rgb(255, 0, 0,0.5)'}}>
        {row.Env_exp}
      </td>
      <td style={{ backgroundColor: verificationStatus[index]?.destinataireExists ? 'rgb(0, 128, 0,0.5)' : 'rgb(255, 0, 0,0.5)' }}>
        {row.Env_dest}
      </td>
      <td>{envAgenceDepotData[index]}</td>
      <td>
        {verificationStatus[index]?.expediteurExists && verificationStatus[index]?.destinataireExists ? (
          <span style={{ color: 'green' }}>✔️</span>
        ) : (
          <span style={{ color: 'red' }}>❌</span>
        )}
      </td>
      <td className='send-cancel-button'>
        {verificationStatus[index]?.expediteurExists && verificationStatus[index]?.destinataireExists ? (
          <h3>can send</h3>
         
        ) : (
          <span>Cannot send</span>
        )}
        <button onClick={() => handleCancelButtonClick(index)}>cancel</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
     
    {showSuccessPopup && (
      <div className="success-popup">
        <p>Envoi added successfully!</p>
      </div>
    )}
  </div>
  );
};

export default Nombre;
