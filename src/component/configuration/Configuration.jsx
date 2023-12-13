import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Config.css'; // Import the CSS file

function Configuration() {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    Grp_nom: "",
    Grp_code: "",
    Grp_adresse: "",
    Grp_responsable: "",
    Grp_contact: "",
    Grp_type: "",
  });

  const navigate = useNavigate('');

  const redirect = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchData = () => {
    axios
      .get("http://localhost:8081/groupement")
      .then((res) => setGroups(res.data))
      .catch((err) => console.log("Error fetching data:", err));
  };
  
  const handleAddGroup = () => {
    axios.post("http://localhost:8081/groupement", formData)
      .then((res) => {
        console.log("Group added successfully:", res.data);
        // Update state with the new group
        setGroups([...groups, res.data]);
        // Reset form data
        setFormData({
          Grp_nom: "",
          Grp_code: "",
          Grp_adresse: "",
          Grp_responsable: "",
          Grp_contact: "",
          Grp_type: "",
        });
        // Fetch updated data
        fetchData();
      })
      .catch((err) => {
        console.error("Error adding group:", err);
      });
  };
  useEffect(() => {
    fetchData();
  }, [groups]); // Fetch data when 'groups' state changes
  
  const handleDeleteGroup = (id) => {
    axios
      .delete(`http://localhost:8081/groupement/${id}`)
      .then(() => {
        const updatedGroups = groups.filter((group) => group.Grp_id !== id);
        setGroups(updatedGroups);
      })
      .catch((err) => console.log("Error deleting group:", err));
  };
  

  useEffect(() => {
    axios
      .get("http://localhost:8081/groupement")
      .then((res) => setGroups(res.data))
      .catch((err) => console.log("Error fetching data:", err));
  }, []);

  return (
    <div className="custom-config-container"> {/* Updated class name */}
      <div className="custom-form-container"> {/* Updated class name */}
        <form>
          <h1>Nouveau groupe</h1>
          <div className="custom-form-element">
            <label htmlFor="Grp_nom" className="custom-label">
            </label>
            <input
              placeholder="group-name"
              type="text"
              className="custom-input"
              id="Grp_nom"
              name="Grp_nom"
              value={formData.Grp_nom}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Grp_code" className="custom-label">
            </label>
            <input
              placeholder="code"
              type="text"
              className="custom-input"
              id="Grp_code"
              name="Grp_code"
              value={formData.Grp_code}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_adresse" className="custom-label">  
            </label>
            <input
              placeholder="adresse"
              type="text"
              className="custom-input"
              id="Grp_adresse"
              name="Grp_adresse"
              value={formData.Grp_adresse}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_responsable" className="custom-label">
            </label>
            <input
              placeholder="responsable"
              type="text"
              className="custom-input"
              id="Grp_responsable"
              name="Grp_responsable"
              value={formData.Grp_responsable}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_contact" className="custom-label">
            </label>
            <input
              placeholder="contact"
              type="text"
              className="custom-input"
              id="Grp_contact"
              name="Grp_contact"
              value={formData.Grp_contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
            <label htmlFor="Grp_type" className="custom-label">
            </label>
            <input
              placeholder="type"
              type="text"
              className="custom-input"
              id="Grp_type"
              name="Grp_type"
              value={formData.Grp_type}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" className="custom-primary-button" onClick={handleAddGroup}>
            Add Group
          </button>
        </form>
      </div>

      {/* Display Groups Table */}
      <div className="custom-list-container"> {/* Updated class name */}
        <h2>Liste des Groupements</h2>
        <table className="custom-table"> {/* Updated class name */}
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Code</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.Grp_id}>
                <td>{group.Grp_nom}</td>
                <td>{group.Grp_type}</td>
                <td>{group.Grp_code}</td>
                <td>{group.Grp_adresse}</td>
                <td>{group.Grp_contact}</td>
                <td>{group.Grp_mail}</td>
                <td>
                  <button
                    className="custom-delete-button"
                    onClick={() => handleDeleteGroup(group.Grp_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Configuration;
