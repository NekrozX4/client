import './App.css';
import {BrowserRouter as Router ,Routes , Route} from 'react-router-dom'
import Login from './component/login/Login';
import Main from './component/main/Main';
import RemoveUser from './component/user/RemoveUser';
import Saisie from './component/saisie/Saisie';

function App() {

  const isLoggedIn = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return !!loggedInUser; 
  };
  const usMatricule = JSON.parse(localStorage.getItem('loggedInUser'))?.Us_matricule;

  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path='/saisie' element = { <Saisie />} />
        <Route
            key={usMatricule}
            path={`/main/${usMatricule}`}
            element={<Main />}
          />

        <Route path='/remove' element = {<RemoveUser />} />
      </Routes>
    </Router>
  );
}

export default App;
