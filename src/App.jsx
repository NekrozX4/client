import './App.css';
import {BrowserRouter as Router ,Routes , Route} from 'react-router-dom'
import Login from './component/login/Login';
import Main from './component/main/Main';
import Saisie from './component/saisie/Saisie';
function App() {
  
  const usMatricule = JSON.parse(localStorage.getItem('loggedInUser'))?.Us_matricule;

  return (
    <Router>
      <Routes> 
        <Route
          key="main"
          path="/main/:usMatricule"
          element={<Main />}
        />

          <Route path='/' element={<Login />} />
        <Route path='/saisie' element={<Saisie />} />
      </Routes>
    </Router>
  );
}

export default App;

