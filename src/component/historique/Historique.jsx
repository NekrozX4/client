import React, { useEffect, useState } from 'react';
import './Historique.css';
import { parse, format } from 'date-fns';

const Historique = () => {
  const [historiqueData, setHistoriqueData] = useState([]);
  const [beneficiaryData, setBeneficiaryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false); // Added state

  useEffect(() => {
    // Fetch historique and beneficiary data when the component mounts
    fetchHistoriqueData();
    fetchBeneficiaryData();
  }, []);

  const fetchHistoriqueData = async () => {
    try {
      const response = await fetch('http://localhost:8081/envoi');
      const data = await response.json();
      setHistoriqueData(data);
    } catch (error) {
      console.error('Error fetching historique data:', error);
    }
  };

  const fetchBeneficiaryData = async () => {
    try {
      const response = await fetch('http://localhost:8081/benefs');
      const data = await response.json();
      setBeneficiaryData(data);
    } catch (error) {
      console.error('Error fetching beneficiary data:', error);
    }
  };

  const organizeHistoriqueDataByBeneficiaryAddress = () => {
    const organizedData = {};

    historiqueData.forEach((envoi) => {
      const beneficiaryName = envoi.Env_dest;
      const beneficiaryAddress = getBeneficiaryAddress(beneficiaryName);

      if (!organizedData[beneficiaryAddress]) {
        organizedData[beneficiaryAddress] = [];
      }

      organizedData[beneficiaryAddress].push(envoi);
    });

    return organizedData;
  };

  const getBeneficiaryAddress = (beneficiaryName) => {
    const beneficiary = beneficiaryData.find((b) => b.Ben_Nom === beneficiaryName);
    return beneficiary ? beneficiary.Ben_Addresse : '';
  };

  const organizedData = organizeHistoriqueDataByBeneficiaryAddress();
 
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    // Use the searchTerm to filter envoi data based on your criteria
    const filteredResults = historiqueData.filter((envoi) => {
      const formattedDate = envoi.Env_date_depot
        ? format(new Date(envoi.Env_date_depot), 'MM/dd/yyyy', { timeZone: 'Africa/Nairobi' })
        : '';

      return (
        Object.values(envoi).some(
          (value) =>
            typeof value === 'string' &&
            (value.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (formattedDate && formattedDate.includes(searchTerm)))
        ) ||
        formattedDate.includes(searchTerm)
      );
    });

    setSearchResults(filteredResults);
    setShowSearchResults(true); // Show search results
  };



  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false); // Show regular data
  };

  return (
    <div className='historique-container'>
      <h1>Deposit list</h1>

      {/* Search Bar */}
      <div className='search-bar-history'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={() => setShowSearchResults(false)}>Clear</button>
      </div>

      {/* Display data based on the state */}
      {showSearchResults ? (
        <div className='search-results'>
          <h2>Search Results</h2>
          {searchResults.map((result) => (
            <div key={result.Env_id} className='historique-item'>
              {/* Display search results */}
              <p>
                <strong>From:</strong> {result.Env_exp}
                <span className='separator'> | </span>
                <strong>To:</strong> {result.Env_dest}
              </p>
              <span>&nbsp;;</span>
              <p>
                <strong>Details:</strong> {`Num: ${result.Env_num}, Poids: ${result.Env_poids}g , Taxe: ${result.Env_taxe} Ar `}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {result.Env_date_depot &&
                  new Date(result.Env_date_depot).toLocaleDateString('en-US', {
                    timeZone: 'Africa/Nairobi',
                  })}
                <span className='separator'> | </span>
                <strong>Agence:</strong> {result.Env_agence_depot}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className='historique-list'>
          {Object.keys(organizedData).map((address) => (
            <div key={address}>
           <h2>{`Address: ${address} (${
                organizedData[address].length !== 1
                  ? `nombre de depots: ${organizedData[address].length}`
                  : 'nombre de depot: 1'
              })`}</h2>

              {organizedData[address].map((envoi) => (
                <div key={envoi.Env_id} className='historique-item'>
                  {/* Display envoi data for the current address */}
                  <p>
                    <strong>From:</strong> {envoi.Env_exp}
                    <span className='separator'> | </span>
                    <strong>To:</strong> {envoi.Env_dest}
                  </p>
                  <span>&nbsp;</span>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Details:</strong> {`Num: ${envoi.Env_num}, Poids: ${envoi.Env_poids}g , Taxe: ${envoi.Env_taxe} Ar `}
                  </p>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Date:</strong>{' '}
                    {envoi.Env_date_depot &&
                      new Date(envoi.Env_date_depot).toLocaleDateString('en-US', {
                        timeZone: 'Africa/Nairobi',
                      })}
                    <span className='separator'> | </span>
                    <strong>Agence:</strong> {envoi.Env_agence_depot}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Historique;
