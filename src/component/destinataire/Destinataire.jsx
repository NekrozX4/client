import React, { useState } from 'react';
import './Destinataire.css';
import Papa from 'papaparse';

const Destinataire = ({ lightMode }) => {
  const [formData, setFormData] = useState({
    Grp_code: '',
    Ben_Nom: '',
    Ben_Addresse: '',
    Ben_code: '',
    file: null,
  });
  
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [fileName, setFileName] = useState('');


  const parseCSV = (content) => {
    try {
      const parsedData = Papa.parse(content, { header: true }).data;
      return parsedData;
    } catch (error) {
      console.error('Error parsing CSV:', error);
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    // Check if the file was selected using the file input
    setFormData((prevData) => ({ ...prevData, file }));
    setFileName(file.name);
  
    // Read and log the content of the CSV file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      console.log('CSV Content:', content);
  
      // Parse CSV content and update state with the data
      const parsedData = parseCSV(content);
      if (!file) {
        // No file selected, handle this case as needed
        console.log('No file selected');
        return;
      }
      if (parsedData && parsedData.length > 1) {
        const dataArray = parsedData.slice(0); // Exclude the header row
        console.log('Parsed Data:', dataArray);
  
        // Process each row in the dataArray
        for (const row of dataArray) {
          const { Grp_code, Ben_Nom, Ben_Addresse, Ben_code } = row;
  
          // You can add additional checks or validation here if needed
          if (Grp_code || Ben_Nom || Ben_Addresse || Ben_code) {
            // Send each row data to the server
            await sendToServer(Grp_code, Ben_Nom, Ben_Addresse, Ben_code);
          }
        }
  
        // Optionally, update the state with the parsed data
        setFormData((prevData) => ({ ...prevData, csvData: parsedData }));
  
    // 3000 milliseconds (adjust as needed)
      }
    };
  
    reader.readAsText(file);
  };
  
  
  const sendToServer = async (Grp_code, Ben_Nom, Ben_Addresse, Ben_code) => {
    try {
      const response = await fetch('http://localhost:8081/benefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Grp_code, Ben_Nom, Ben_Addresse, Ben_code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the beneficiary is successfully added, you can handle it here
      console.log('Beneficiary added successfully!');
    } catch (error) {
      console.error('Error adding beneficiary:', error);

      // Show error popup if there's an error
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendDataButtonClick = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // You can add any additional logic here before sending data
    console.log('Sending data:', formData);

    // Call the handleFileChange function to send data to the server
    handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/benefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        console.log('Beneficiary added successfully!');
        setSuccessPopup(true);
      }

      setFormData({
        Grp_code: '',
        Ben_Nom: '',
        Ben_Addresse: '',
        Ben_code: '',
      });

      setTimeout(() => {
        setSuccessPopup(false);
      }, 3000); 
    } catch (error) {
      console.error('Error adding beneficiary:', error);

      setErrorPopup(true);

      setTimeout(() => {
        setErrorPopup(false);
      }, 3000);
    }
  };

  return (
    <div  className={`destinataire-container${lightMode ? 'light-mode' : ''}`}>
      <h1>Destinataire</h1>

      <div className='input-container'>
        <div className='input-first'>
          <label htmlFor='fileInput' className='label-file'>
            Importer un fichier exel <p>example.csv(comma delimited)</p>
          </label>
          <input type='file' id='fileInput' accept='.csv' onChange={handleFileChange} />
          <div>{fileName && `Fichier selectioné: ${fileName}`}</div>
          <button type='button' onClick={handleSendDataButtonClick}>
            Ajouter
          </button>
        </div>

        <div className='input-destinataire-group'>
          <h2>Destinataire unique</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='Grp_code'
              placeholder='Code'
              value={formData.Grp_code}
              onChange={handleChange}
            />
            <input
              type='text'
              name='Ben_Nom'
              placeholder='Nom'
              value={formData.Ben_Nom}
              onChange={handleChange}
            />
            <input
              type='text'
              name='Ben_Addresse'
              placeholder='Prenom'
              value={formData.Ben_Addresse}
              onChange={handleChange}
            />
            <input
              type='text'
              name='Ben_code'
              placeholder='Adresse'
              value={formData.Ben_code}
              onChange={handleChange}
            />
            <button type='submit'>Ajouter</button>
          </form>
        </div>
        {successPopup && (
          <div className='popup-success-popup'>Beneficiary added successfully!</div>
        )}

        {errorPopup && (
          <div className='popup-error-popup'>
            Error adding beneficiary. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinataire;
