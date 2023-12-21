import React, { createContext, useContext, useState } from 'react';

// Create a context
const EnvoiContext = createContext();

// Create a provider for the context
export const EnvoiProvider = ({ children }) => {
  const [csvData, setCSVData] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState([]);
  const [envAgenceDepotData, setEnvAgenceDepotData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  return (
    <EnvoiContext.Provider
      value={{
        csvData,
        setCSVData,
        verificationStatus,
        setVerificationStatus,
        envAgenceDepotData,
        setEnvAgenceDepotData,
        showSuccessPopup,
        setShowSuccessPopup,
      }}
    >
      {children}
    </EnvoiContext.Provider>
  );
};

// Create a custom hook to use the context
export const useEnvoiContext = () => {
  return useContext(EnvoiContext);
};
