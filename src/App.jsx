import './App.css';
import {BrowserRouter as Router ,Routes , Route} from 'react-router-dom'
import Login from './component/login/Login';
import Main from './component/main/Main';
import NewUser from './component/user/newUser';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Login />} />
        <Route path = '/main' element = {<Main />} />
        <Route path='/newUser' element = {<NewUser />} />
      </Routes>
    </Router>
  );
}

export default App;
