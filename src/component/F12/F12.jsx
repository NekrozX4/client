import React, { useEffect, useState } from 'react';
import '../historique/Historique.css';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import 'jspdf-autotable';

const F12 = ( { lightMode } ) => {
    const [historiqueData, setHistoriqueData] = useState([]);
    const [beneficiaryData, setBeneficiaryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [groupBy, setGroupBy] = useState('agence'); // Default grouping by address
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showPdfPreview, setShowPdfPreview] = useState(false); // Add PDF preview state
    const [pdfContent, setPdfContent] = useState('');
  
    useEffect(() => {
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
  
    const organizeHistoriqueDataByAgence = () => {
      const organizedData = {};
  
      historiqueData.forEach((envoi) => {
        const agence = envoi.Env_agence_depot;
  
        if (!organizedData[agence]) {
          organizedData[agence] = [];
        }
  
        organizedData[agence].push(envoi);
      });
  
      return organizedData;
    };
  
    const getBeneficiaryAddress = (beneficiaryName) => {
      const beneficiary = beneficiaryData.find((b) => b.Ben_Nom === beneficiaryName);
      return beneficiary ? beneficiary.Ben_Addresse : '';
    };
  
    const organizedData = groupBy === 'address'
      ? organizeHistoriqueDataByBeneficiaryAddress()
      : organizeHistoriqueDataByAgence();
      const handlePreviewPDF = (groupKey) => {
        const pdf = new jsPDF();
        const titleText = 'Feuille d\'expedition des chargements du centre d\'ANTANANARIVO TRI';
        const descriptionText = 'VD des objets charges, lettres et paquets recommande, recouvrement - en precisant les envois contre remboursement';
      
        const maxWidthPercentage = 0.6; // 60%
      
        const titleFontSize = 16;
        const descriptionFontSize = 11;
      
        const maxTitleWidth = pdf.internal.pageSize.getWidth() * maxWidthPercentage;
        const maxDescriptionWidth = pdf.internal.pageSize.getWidth() * maxWidthPercentage;
      
        const titleLines = pdf.splitTextToSize(titleText, maxTitleWidth);
        const descriptionLines = pdf.splitTextToSize(descriptionText, maxDescriptionWidth);
      
        const titleY = 15;
        const descriptionY = titleY + titleLines.length * titleFontSize - 18; // Adjusted spacing
      
        pdf.setFontSize(titleFontSize);
        pdf.text(titleLines, pdf.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });
      
        pdf.setFontSize(descriptionFontSize);
        const lineHeight = -5;
      
        descriptionLines.forEach((line, index) => {
          pdf.text(line, pdf.internal.pageSize.getWidth() / 2, descriptionY + index * (descriptionFontSize + lineHeight), { align: 'center' });
        });
      
     

      // "Récapitulation" title
      const recapTitleWidth = 125.5; // Adjusted width for the title
      pdf.autoTable({
        startY: descriptionY + descriptionLines.length * descriptionFontSize - 10,
        head: [['                                         Récapitulation(en chiffre)']],
        headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
        bodyStyles: { lineWidth: 1 },
        tableWidth: recapTitleWidth,
        margin: { horizontal: (pdf.internal.pageSize.getWidth() - recapTitleWidth) / 2 }, // Centering the title
      });

// "Récapitulation" section
const recapColumns = ['VD', 'LR', 'PR', 'Recouvrement', 'Objets Signalés'];
const recapData = Array.from({ length: 1 }).map(() => ['']);
const recapTableWidth = pdf.internal.pageSize.getWidth() * 0.60; 

pdf.autoTable({
  startY: pdf.autoTable.previous.finalY + 0,
  head: [recapColumns],
  body: recapData,
  headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
  bodyStyles: { lineWidth: 1 },
  tableWidth: recapTableWidth,
  columnStyles: {
    0: { columnWidth: pdf.internal.pageSize.getWidth() * 0.10 },
    1: { columnWidth: pdf.internal.pageSize.getWidth() * 0.10 },
    2: { columnWidth: pdf.internal.pageSize.getWidth() * 0.10},
    3: { columnWidth: pdf.internal.pageSize.getWidth() * 0.15 },
    4: { columnWidth: pdf.internal.pageSize.getWidth() * 0.15 }
  },
  margin: { horizontal: (pdf.internal.pageSize.getWidth() - recapTableWidth) / 2 },
});


  pdf.text('', pdf.internal.pageSize.getWidth() / 2, pdf.autoTable.previous.finalY + 10);

    const agenceText = `Agence: ${groupKey}`;
    pdf.text(agenceText, pdf.internal.pageSize.getWidth() / 2, pdf.autoTable.previous.finalY + 10, { align: 'center' });

      
        pdf.autoTable({
          startY: pdf.autoTable.previous.finalY + 20, 
          head: [
            ["numero d'ordre", 'Expediteur', 'Destinataire', 'Lieux de destination', 'Num', 'Date', 'Montant']
          ],
          body: organizedData[groupKey].map((envoi, index) => [
            index + 1,
            envoi.Env_exp,
            envoi.Env_dest,
            getBeneficiaryAddress(envoi.Env_dest),
            envoi.Env_num,
            envoi.Env_date_depot ? format(new Date(envoi.Env_date_depot), 'MM/dd/yyyy', { timeZone: 'Africa/Nairobi' }) : '',
            `${envoi.Env_taxe} Ar`,
          ]),
          headStyles: { fillColor: 'white', textColor: 'black', lineColor: 'black', lineWidth: 1 },
          bodyStyles: { lineWidth: 1 },
        });
      
      
        const dataUri = pdf.output('datauristring');
        setPdfContent(dataUri);
        setShowPdfPreview(true);
      };
      
      

        
    return (
      <div className={`F12-container ${lightMode ? 'light-mode' : ''}`}>
        <div className='history-header'>
        <h1>Liste des envoi</h1>
          <div className='sorting metho'>
        
          </div>
          </div>
  
        <div className='main-history-container'>
          {showSearchResults ? (
            <div className='search-results'>
              <h2>Search Results</h2>
              {searchResults.map((result) => (
                <div key={result.Env_id} className='historique-item'>
                  <p>
                    <strong>From:</strong> {result.Env_exp}
                    <span className='separator'> | </span>
                    <strong>To:</strong> {result.Env_dest}
                  </p>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Details:</strong> {`Num: ${result.Env_num}, Poids: ${result.Env_poids}g , Taxe: ${result.Env_taxe} Ar `}
                  </p>
                  <span>&nbsp;</span>
                  <p>
                    <strong>Date:</strong>{' '}
                    {result.Env_date_depot &&
                      new Date(result.Env_date_depot).toLocaleDateString('en-US', {
                        timeZone: 'Africa/Nairobi',
                      })}
                    <span className='separator'> | </span>
                    <strong>Agence:</strong> {result.Env_agence_depot}
                    <span className='separator'> | </span>
                    <strong>Address:</strong> {getBeneficiaryAddress(result.Env_dest)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='historique list'>
          {Object.keys(organizedData).map((groupKey) => (
            <div className='grouping' key={groupKey}>
              <h2>
                {`${groupBy === 'address' ? 'Address' : 'Agence'}: ${groupKey} (${
                  organizedData[groupKey].length !== 1
                    ? `nombre de depots: ${organizedData[groupKey].length}`
                    : 'nombre de depot: 1'
                })`}
              </h2>
              <button onClick={() => handlePreviewPDF(groupKey)}>Generer liste F12</button>
              {organizedData[groupKey].map((envoi) => (
                    <div key={envoi.Env_id} className='historique-item'>
                      <p>
                        <strong>From:</strong> {envoi.Env_exp}
                        <span className='separator'> | </span>
                        <strong>To:</strong> {envoi.Env_dest}
                      </p>
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
                        <strong>{groupBy === 'address' ? 'Agence' : 'Address'}:</strong> {groupBy === 'address' ? envoi.Env_agence_depot : getBeneficiaryAddress(envoi.Env_dest)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          </div>
          {showPdfPreview && (
                <div className="pdf-preview-section">
                    {/* Render the PDF content using an iframe */}
                    <iframe title="PDF Preview" src={pdfContent} width="100%" height="600px" />
                    
                    {/* Add a close button or any other UI elements for user interaction */}
                    <button onClick={() => setShowPdfPreview(false)}>Close Preview</button>
                </div>
            )}


      </div>
    );
  };

export default F12
