import React, { useState } from 'react';
import './Destinataire.css';

const Destinataire = () => {
  const [formData, setFormData] = useState({
    Grp_code: '',
    Ben_Nom: '',
    Ben_Addresse: '',
    Ben_code: '',
    file: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleFileSelection = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, file }));
  };

  const handleUpload = async () => {
    try {
      if (!formData.file) {
        console.error('Please select a file.');
        return;
      }

      setUploading(true);

      const fileData = new FormData();
      fileData.append('file', formData.file);

      const response = await fetch('http://localhost:8081/benefs/upload', {
        method: 'POST',
        body: fileData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('File uploaded successfully!');
      // You may want to fetch the updated beneficiary list or display a success message
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      }

      // If the beneficiary is successfully added, you can handle it here
      console.log('Beneficiary added successfully!');
    } catch (error) {
      console.error('Error adding beneficiary:', error);
    }
  };

  return (
    <div className='destinataire-container'>
      <h1>Destinataire</h1>

      <div className='input-container'>
        <div className='input-first'>
          <label htmlFor='fileInput' className='label-file'>
            import file
          </label>
          <input type='file' id='fileInput' accept='.csv' onChange={handleFileChange} />
          <button className='button-select' onClick={handleFileSelection}>
            Select One
          </button>
          <button className='button-send' onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Send'}
          </button>
        </div>

        <div className='input-group'>
          <h2>Details</h2>
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
            <button type='submit'>Envoi</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Destinataire;
