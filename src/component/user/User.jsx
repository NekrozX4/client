import React, { useEffect, useState } from "react";
import axios from "axios";
import './user.css'; // Import the CSS file

function User() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    Us_nom: "",
    Us_matricule: "",
    Us_login: "",
    Us_mail: "",
    Us_pwd: "",
    Fo_id: 0,
    Grp_id: 0,
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8081/utilisateur")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Error fetching data:", err));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const handleAddUser = async () => {
    try {
      const res = await axios.post("http://localhost:8081/utilisateur", formData);
      console.log("User added successfully:", res.data);
      // Update state with the new user
      setUsers([...users, res.data]);
      // Reset form data
      setFormData({
        Us_nom: "",
        Us_matricule: "",
        Us_login: "",
        Us_mail: "",
        Us_pwd: "",
        Fo_id: "" ,
        Grp_id: "" ,
      });
      // Fetch updated data
      fetchData(); // Assuming this function fetches the list of users
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [users]);

  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:8081/utilisateur/${id}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.Us_id !== id);
        setUsers(updatedUsers);
      })
      .catch((err) => console.log("Error deleting user:", err));
  };

  useEffect(() => {
    fetchData();
  }, [users]);

  return (
    <div className="custom-config-container">
      <div className="custom-form-container">
        <form>
          <div className="custom-form-element">
            <label htmlFor="Us_nom" className="custom-label">
              User Name
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_nom"
              name="Us_nom"
              value={formData.Us_nom}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_matricule" className="custom-label">
              Matricule
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_matricule"
              name="Us_matricule"
              value={formData.Us_matricule}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_login" className="custom-label">
              Login
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_login"
              name="Us_login"
              value={formData.Us_login}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_mail" className="custom-label">
              Email
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_mail"
              name="Us_mail"
              value={formData.Us_mail}
              onChange={handleInputChange}
            />
          </div>

          <div className="custom-form-element">
            <label htmlFor="Us_pwd" className="custom-label">
              Password
            </label>
            <input
              type="text"
              className="custom-input"
              id="Us_pwd"
              name="Us_pwd"
              value={formData.Us_pwd}
              onChange={handleInputChange}
            />
          </div>
          <div className="custom-form-element">
  <label htmlFor="Fo_id" className="custom-label">
    Fonction_ID
  </label>
  <input
    type="text"
    className="custom-input"
    id="Fo_id"
    name="Fo_id"
    value={formData.Fo_id}
    onChange={handleInputChange}
  />
</div>

<div className="custom-form-element">
  <label htmlFor="Grp_id" className="custom-label">
    Group ID
  </label>
  <input
    type="text"
    className="custom-input"
    id="Grp_id"
    name="Grp_id"
    value={formData.Grp_id}
    onChange={handleInputChange}
  />
</div>


          <button type="button" className="custom-primary-button" onClick={handleAddUser}>
            Add User
          </button>
        </form>
      </div>

      <div className="custom-list-container">
        <h2>Liste des Utilisateurs</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Matricule</th>
              <th>Login</th>
              <th>Email</th>
              <th>Fo_id</th>
              <th>Grp_id</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.Us_id}>
                <td>{user.Us_nom}</td>
                <td>{user.Us_matricule}</td>
                <td>{user.Us_login}</td>
                <td>{user.Us_mail}</td>
                <td>{user.Fo_id}</td>
                <td>{user.Grp_id}</td>
                <td>
                  <button
                    className="custom-delete-button"
                    onClick={() => handleDeleteUser(user.Us_id)}
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

export default User;
