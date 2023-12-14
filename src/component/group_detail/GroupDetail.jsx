import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Group.css'

const GroupDetail = ({ selectedGroup, onClose }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    // Check if selectedGroup is available
    if (selectedGroup) {
      // Fetch all beneficiaries
      axios.get(`http://localhost:8081/benefs`)
        .then((response) => {
          // Filter beneficiaries with the same group code as the groupement
          const filteredBeneficiaries = response.data.filter(
            (beneficiary) => beneficiary.Grp_code === selectedGroup.Grp_code
          );
          setBeneficiaries(filteredBeneficiaries);
        })
        .catch((error) => {
          console.error('Error fetching beneficiaries:', error);
        });
    }
  }, [selectedGroup]);

  return (
    <div className='detail-container'>
      <h1>{selectedGroup.Grp_nom}</h1>
      <p>Code: {selectedGroup.Grp_code}</p>
      <p>Address: {selectedGroup.Grp_adresse}</p>
      <h2>Beneficiaries:</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Adress</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.Ben_id}>
              <td>{beneficiary.Ben_Nom}</td>
              <td>{beneficiary.Ben_Addresse}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default GroupDetail;
